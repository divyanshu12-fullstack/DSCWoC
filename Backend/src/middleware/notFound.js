import { HTTP_STATUS } from '../config/constants.js';

/**
 * 404 Not Found middleware
 * Handles all undefined routes
 */
export const notFound = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    path: req.originalUrl,
    method: req.method,
  });
};

export default notFound;
