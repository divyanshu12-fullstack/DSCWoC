import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as projectController from '../controllers/project.controller.js';
// Import validation schemas when created
// import { projectValidation } from '../validations/project.validation.js';

const router = express.Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/:id', projectController.getProject);

// Protected routes - Mentor/Admin only
router.post('/', authenticate, authorize('admin', 'mentor'), projectController.createProject);
router.put('/:id', authenticate, authorize('admin', 'mentor'), projectController.updateProject);
router.post('/:id/sync', authenticate, authorize('admin', 'mentor'), projectController.syncProject);

// Admin only
router.delete('/:id', authenticate, authorize('admin'), projectController.deleteProject);

export default router;
