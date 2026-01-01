import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as badgeController from '../controllers/badge.controller.js';

const router = express.Router();

// Public routes
router.get('/', badgeController.getBadges);
router.get('/:id', badgeController.getBadge);
router.get('/:id/check/:userId', badgeController.checkBadgeEligibility);

// Admin only routes
router.post('/', authenticate, authorize('admin'), badgeController.createBadge);
router.put('/:id', authenticate, authorize('admin'), badgeController.updateBadge);
router.post('/:id/award', authenticate, authorize('admin'), badgeController.awardBadge);
router.post('/initialize', authenticate, authorize('admin'), badgeController.initializeBadges);

export default router;
