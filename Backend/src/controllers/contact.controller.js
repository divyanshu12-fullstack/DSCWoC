import Contact from '../models/Contact.model.js';
import logger from '../utils/logger.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Submit a contact form message
 * POST /api/v1/contact/submit
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return errorResponse(res, 'Name, email, and message are required', 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 'Please provide a valid email address', 400);
    }

    // Create new contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: 'New'
    });

    await contact.save();

    logger.info(`Contact message submitted by ${email}: "${message.substring(0, 50)}..."`);

    successResponse(res, {
      message: 'Your message has been sent successfully!',
      contactId: contact._id
    }, 'Contact message submitted successfully', 201);
  } catch (error) {
    logger.error(`Error submitting contact: ${error.message}`);
    errorResponse(res, 'Failed to submit contact message', 500);
  }
};

/**
 * Get all contact messages (admin only)
 * GET /api/v1/admin/contacts
 */
export const getAllContacts = async (req, res) => {
  try {
    const { status, search, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(filter)
      .populate('respondedBy', 'username fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);

    successResponse(res, {
      contacts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    }, 'Contacts retrieved successfully');
  } catch (error) {
    logger.error(`Error fetching contacts: ${error.message}`);
    errorResponse(res, 'Failed to fetch contacts', 500);
  }
};

/**
 * Update contact status (mark as read/responded)
 * PATCH /api/v1/admin/contacts/:id/status
 */
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !['New', 'Read', 'Responded'].includes(status)) {
      return errorResponse(res, 'Valid status required (New, Read, or Responded)', 400);
    }

    const updateData = {
      status,
      ...(adminNotes && { adminNotes })
    };

    if (status === 'Responded') {
      updateData.respondedAt = new Date();
      updateData.respondedBy = req.user._id;
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('respondedBy', 'username fullName');

    if (!contact) {
      return errorResponse(res, 'Contact message not found', 404);
    }

    logger.info(`Contact ${id} status updated to ${status} by ${req.user.username}`);

    successResponse(res, contact, 'Contact status updated successfully');
  } catch (error) {
    logger.error(`Error updating contact status: ${error.message}`);
    errorResponse(res, 'Failed to update contact status', 500);
  }
};

/**
 * Delete a contact message
 * DELETE /api/v1/admin/contacts/:id
 */
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return errorResponse(res, 'Contact message not found', 404);
    }

    logger.info(`Contact ${id} deleted by ${req.user.username}`);

    successResponse(res, null, 'Contact deleted successfully');
  } catch (error) {
    logger.error(`Error deleting contact: ${error.message}`);
    errorResponse(res, 'Failed to delete contact', 500);
  }
};

/**
 * Get contact stats (admin only)
 * GET /api/v1/admin/contacts/stats
 */
export const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: {
            $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] }
          },
          read: {
            $sum: { $cond: [{ $eq: ['$status', 'Read'] }, 1, 0] }
          },
          responded: {
            $sum: { $cond: [{ $eq: ['$status', 'Responded'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || { total: 0, new: 0, read: 0, responded: 0 };

    successResponse(res, result, 'Contact stats retrieved successfully');
  } catch (error) {
    logger.error(`Error fetching contact stats: ${error.message}`);
    errorResponse(res, 'Failed to fetch contact stats', 500);
  }
};

/**
 * Keep old function for backward compatibility
 */
export const submitContactForm = async (req, res) => {
  return submitContact(req, res);
};