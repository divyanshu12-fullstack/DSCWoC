import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as projectController from '../controllers/project.controller.js';

const router = express.Router();

// Static routes MUST come before dynamic :id routes
router.get('/filters', projectController.getProjectFilters);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/my-projects', authenticate, projectController.getMyProjects);

// Public list route
router.get('/', projectController.getProjects);

// Protected routes - Mentor/Admin only
router.post('/', authenticate, authorize('Mentor', 'Admin'), projectController.createProject);

// Dynamic :id routes come last
router.get('/:id', projectController.getProject);
router.put('/:id', authenticate, authorize('Mentor', 'Admin'), projectController.updateProject);
router.post('/:id/sync', authenticate, authorize('Mentor', 'Admin'), projectController.syncProject);
router.put('/:id/approve', authenticate, authorize('Admin'), projectController.approveProject);
router.delete('/:id', authenticate, authorize('Admin'), projectController.deleteProject);

export default router;
