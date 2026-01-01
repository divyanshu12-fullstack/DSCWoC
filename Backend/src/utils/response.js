import { HTTP_STATUS } from '../config/constants.js';

/**
 * Standard success response
 */
export const successResponse = (res, data, message = 'Success', statusCode = HTTP_STATUS.OK) =>
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });

/**
 * Standard error response
 */
export const errorResponse = (
  res,
  message = 'Error',
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors = null
) =>
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
  });

/**
 * Paginated response
 */
export const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);

  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
};
