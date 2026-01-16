import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as pullRequestController from '../controllers/pullRequest.controller.js';

const router = express.Router();

// Public routes
router.get('/', pullRequestController.getPullRequests);
router.get('/recent', pullRequestController.getRecentPullRequests);
router.get('/:id', pullRequestController.getPullRequest);
router.get('/user/:userId', pullRequestController.getUserPullRequests);
router.get('/project/:projectId', pullRequestController.getProjectPullRequests);
router.get('/joinedprojects/:userId', pullRequestController.getContributorjoinedProjects);

// Protected routes - Mentor/Admin only
router.post(
  '/sync/:projectId',
  authenticate,
  authorize('admin', 'mentor'),
  pullRequestController.syncPullRequests
);
router.put(
  '/:id/validate',
  authenticate,
  authorize('admin', 'mentor'),
  pullRequestController.validatePullRequest
);

export default router;
