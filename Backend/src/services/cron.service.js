import cron from 'node-cron';
import GitHubService from './github.service.js';
import logger from '../utils/logger.js';

class CronService {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Start PR sync cron job
   */
  startPRSyncJob() {
    const cronExpression = process.env.PR_SYNC_INTERVAL || '*/30 * * * *'; // Every 30 minutes by default
    
    const job = cron.schedule(cronExpression, async () => {
      logger.info('Starting scheduled PR sync job');
      
      try {
        const results = await GitHubService.syncAllProjects();
        
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        
        logger.info(`PR sync job completed: ${successCount} successful, ${failureCount} failed`);
        
        // Log detailed results
        results.forEach(result => {
          if (result.success) {
            logger.info(`${result.project}: ${result.syncedCount} PRs synced, ${result.newPRsCount} new`);
          } else {
            logger.error(`${result.project}: Sync failed - ${result.error}`);
          }
        });
        
      } catch (error) {
        logger.error('PR sync job failed:', error.message);
      }
    }, {
      scheduled: false, // Don't start immediately
      timezone: 'UTC'
    });

    this.jobs.set('prSync', job);
    logger.info(`PR sync cron job scheduled: ${cronExpression}`);
    
    return job;
  }

  /**
   * Start all cron jobs
   */
  startAllJobs() {
    logger.info('Starting all cron jobs...');
    
    // Start PR sync job
    const prSyncJob = this.startPRSyncJob();
    prSyncJob.start();
    
    logger.info('All cron jobs started successfully');
  }

  /**
   * Stop all cron jobs
   */
  stopAllJobs() {
    logger.info('Stopping all cron jobs...');
    
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped cron job: ${name}`);
    });
    
    this.jobs.clear();
    logger.info('All cron jobs stopped');
  }

  /**
   * Get status of all jobs
   */
  getJobsStatus() {
    const status = {};
    
    this.jobs.forEach((job, name) => {
      status[name] = {
        running: job.running || false,
        scheduled: job.scheduled || false,
      };
    });
    
    return status;
  }

  /**
   * Manually trigger PR sync
   */
  async triggerPRSync() {
    logger.info('Manually triggering PR sync...');
    
    try {
      const results = await GitHubService.syncAllProjects();
      logger.info('Manual PR sync completed successfully');
      return results;
    } catch (error) {
      logger.error('Manual PR sync failed:', error.message);
      throw error;
    }
  }
}

export default new CronService();