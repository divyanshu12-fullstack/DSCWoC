import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * @desc    Submit contact form
 * @route   POST /api/v1/contact
 * @access  Public
 */
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Name, email, and message are required',
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Please provide a valid email address',
    });
  }

  // Log the contact form submission
  logger.info('Contact form submission:', {
    name,
    email,
    message: message.substring(0, 100) + '...', // Log first 100 chars
    timestamp: new Date().toISOString(),
    ip: req.ip,
  });

  // In a real application, you might:
  // 1. Save to database
  // 2. Send email to admin
  // 3. Send auto-reply to user
  // 4. Integrate with a ticketing system

  // For now, we'll just log it and return success
  successResponse(res, {
    name,
    email,
    submittedAt: new Date().toISOString(),
  }, 'Thank you for your message! We will get back to you soon.');
});