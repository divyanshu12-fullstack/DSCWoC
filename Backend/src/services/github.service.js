import axios from 'axios';
import User from '../models/User.model.js';
import Project from '../models/Project.model.js';
import PullRequest from '../models/PullRequest.model.js';
import Badge from '../models/Badge.model.js';
import logger from '../utils/logger.js';

/**
 * GitHub Service
 * Handles all interactions with GitHub API
 */

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.client = null;
  }

  // Lazy initialization of the client to ensure env vars are loaded
  getClient() {
    if (!this.client || this.token !== process.env.GITHUB_TOKEN) {
      this.token = process.env.GITHUB_TOKEN;
      
      if (!this.token) {
        logger.warn('GITHUB_TOKEN not set in environment variables');
      }

      this.client = axios.create({
        baseURL: this.baseURL,
        headers: {
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        timeout: 10000,
      });

      // Add response interceptor for error handling
      this.client.interceptors.response.use(
        (response) => response,
        (error) => {
          logger.error('GitHub API Error:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            url: error.config?.url,
          });
          throw error;
        }
      );
    }
    return this.client;
  }

  /**
   * Get repository information
   */
  async getRepository(owner, repo) {
    try {
      const response = await this.getClient().get(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching repository ${owner}/${repo}:`, error.message);
      throw error;
    }
  }

  /**
   * Get pull requests for a repository
   */
  async getPullRequests(owner, repo, options = {}) {
    try {
      const params = {
        state: options.state || 'all',
        sort: options.sort || 'updated',
        direction: options.direction || 'desc',
        per_page: options.per_page || 100,
        page: options.page || 1,
      };

      const response = await this.getClient().get(`/repos/${owner}/${repo}/pulls`, { params });
      return response.data;
    } catch (error) {
      logger.error(`Error fetching PRs for ${owner}/${repo}:`, error.message);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific pull request
   */
  async getPullRequest(owner, repo, prNumber) {
    try {
      const response = await this.getClient().get(`/repos/${owner}/${repo}/pulls/${prNumber}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching PR #${prNumber} for ${owner}/${repo}:`, error.message);
      throw error;
    }
  }

  /**
   * Get GitHub user information
   */
  async getUser(username) {
    try {
      const response = await this.getClient().get(`/users/${username}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching user ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Parse GitHub repository URL
   */
  parseRepoUrl(url) {
    const match = url.match(/^https:\/\/github\.com\/([\w\-\.]+)\/([\w\-\.]+)(?:\.git)?$/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    
    return {
      owner: match[1],
      repo: match[2]
    };
  }

  /**
   * Sync pull requests for a project
   */
  async syncProjectPRs(project) {
    try {
      logger.info(`Starting PR sync for project: ${project.name}`);
      
      const { github_owner, github_repo } = project;
      
      // Get all PRs from GitHub
      const githubPRs = await this.getPullRequests(github_owner, github_repo, {
        state: 'all',
        per_page: 100
      });

      let syncedCount = 0;
      let newPRsCount = 0;
      const errors = [];

      for (const githubPR of githubPRs) {
        try {
          // Find user by GitHub username
          const user = await User.findOne({ 
            github_username: githubPR.user.login 
          });

          if (!user) {
            logger.warn(`User not found for GitHub username: ${githubPR.user.login}`);
            continue;
          }

          // Check if PR already exists
          const existingPR = await PullRequest.findOne({
            github_pr_id: githubPR.id,
            project: project._id
          });

          // Pull request list items don't include additions/deletions/changed_files/commits.
          // Fetch full PR details so calculatePoints() is accurate.
          let prDetails = githubPR;
          try {
            prDetails = await this.getPullRequest(github_owner, github_repo, githubPR.number);
          } catch (detailError) {
            logger.warn(`Falling back to list payload for PR #${githubPR.number}: ${detailError.message}`);
          }

          if (existingPR) {
            // Update existing PR
            await this.updatePRFromGitHub(existingPR, prDetails);
            syncedCount++;
          } else {
            // Create new PR
            await this.createPRFromGitHub(prDetails, user._id, project._id);
            newPRsCount++;
            syncedCount++;
          }

          // Update user stats and check badges
          await user.updateStats();
          await Badge.checkAndAwardBadges(user._id);

        } catch (prError) {
          logger.error(`Error syncing PR #${githubPR.number}:`, prError.message);
          errors.push({
            pr: githubPR.number,
            error: prError.message
          });
        }
      }

      // Update project stats
      await project.updateStats();
      project.lastSyncAt = new Date();
      await project.save();

      // Update leaderboard ranks
      await User.updateRanks();

      logger.info(`PR sync completed for ${project.name}: ${syncedCount} synced, ${newPRsCount} new`);

      return {
        success: true,
        syncedCount,
        newPRsCount,
        errors,
        lastSyncAt: project.lastSyncAt
      };

    } catch (error) {
      logger.error(`Error syncing project ${project.name}:`, error.message);
      throw error;
    }
  }

  /**
   * Create new PR from GitHub data
   */
  async createPRFromGitHub(githubPR, userId, projectId) {
    const prData = {
      github_pr_id: githubPR.id,
      github_pr_number: githubPR.number,
      title: githubPR.title,
      description: githubPR.body || '',
      github_url: githubPR.html_url,
      user: userId,
      project: projectId,
      status: githubPR.merged_at ? 'merged' : githubPR.state,
      github_data: {
        created_at: new Date(githubPR.created_at),
        updated_at: new Date(githubPR.updated_at),
        merged_at: githubPR.merged_at ? new Date(githubPR.merged_at) : null,
        closed_at: githubPR.closed_at ? new Date(githubPR.closed_at) : null,
        additions: githubPR.additions || 0,
        deletions: githubPR.deletions || 0,
        changed_files: githubPR.changed_files || 0,
        commits: githubPR.commits || 0,
      },
      submissionType: 'auto_sync',
      lastSyncAt: new Date(),
    };

    const newPR = new PullRequest(prData);
    newPR.calculatePoints();
    await newPR.save();

    return newPR;
  }

  /**
   * Update existing PR from GitHub data
   */
  async updatePRFromGitHub(existingPR, githubPR) {
    existingPR.title = githubPR.title;
    existingPR.description = githubPR.body || '';
    existingPR.status = githubPR.merged_at ? 'merged' : githubPR.state;
    
    existingPR.github_data = {
      created_at: new Date(githubPR.created_at),
      updated_at: new Date(githubPR.updated_at),
      merged_at: githubPR.merged_at ? new Date(githubPR.merged_at) : null,
      closed_at: githubPR.closed_at ? new Date(githubPR.closed_at) : null,
      additions: githubPR.additions || 0,
      deletions: githubPR.deletions || 0,
      changed_files: githubPR.changed_files || 0,
      commits: githubPR.commits || 0,
    };
    
    existingPR.lastSyncAt = new Date();
    existingPR.calculatePoints();
    
    await existingPR.save();
    return existingPR;
  }

  /**
   * Sync all active projects
   */
  async syncAllProjects() {
    try {
      const activeProjects = await Project.find({ 
        isActive: true, 
        isApproved: true,
        syncEnabled: true 
      });

      logger.info(`Starting sync for ${activeProjects.length} projects`);

      const results = [];
      
      for (const project of activeProjects) {
        try {
          const result = await this.syncProjectPRs(project);
          results.push({
            project: project.name,
            ...result
          });
        } catch (error) {
          logger.error(`Failed to sync project ${project.name}:`, error.message);
          results.push({
            project: project.name,
            success: false,
            error: error.message
          });
        }
      }

      logger.info('All projects sync completed');
      return results;

    } catch (error) {
      logger.error('Error in syncAllProjects:', error.message);
      throw error;
    }
  }

  /**
   * Validate GitHub repository access
   */
  async validateRepository(owner, repo) {
    try {
      const repoData = await this.getRepository(owner, repo);
      return {
        valid: true,
        data: {
          name: repoData.name,
          description: repoData.description,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          language: repoData.language,
          isPrivate: repoData.private,
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
}

export default new GitHubService();
