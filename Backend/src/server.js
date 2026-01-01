// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/database.js';
import cronService from './services/cron.service.js';
import Badge from './models/Badge.model.js';
import logger from './utils/logger.js';

// Configuration
const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid conflicts
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
connectDB();

// Initialize default badges (disabled temporarily for testing)
// Badge.initializeDefaultBadges().catch(err => {
//   logger.error('Failed to initialize default badges:', err);
// });

// Start cron jobs (disabled for debugging)
// if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
//   cronService.startAllJobs();
// }

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  cronService.stopAllJobs();
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

export default server;
