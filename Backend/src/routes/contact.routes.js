import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as contactController from '../controllers/contact.controller.js';

const router = express.Router();

/**
 * @desc    Submit contact form
 * @route   POST /api/v1/contact
 * @access  Public
 */
router.post('/', asyncHandler(contactController.submitContactForm));

export default router;