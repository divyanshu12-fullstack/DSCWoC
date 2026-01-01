import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @desc    Initiate GitHub OAuth login
 * @route   GET /api/v1/auth/github
 * @access  Public
 */
router.get('/github', authController.initiateGitHubAuth);

/**
 * @desc    Handle GitHub OAuth callback
 * @route   POST /api/v1/auth/github/callback
 * @access  Public
 */
router.post('/github/callback', asyncHandler(authController.handleGitHubCallback));

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
router.get('/me', authenticate, asyncHandler(authController.getCurrentUser));

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
router.post('/logout', authenticate, asyncHandler(authController.logout));

/**
 * @desc    Refresh user data from GitHub
 * @route   POST /api/v1/auth/refresh
 * @access  Private
 */
router.post('/refresh', authenticate, asyncHandler(authController.refreshUserData));

export default router;