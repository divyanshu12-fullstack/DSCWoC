import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Middleware to validate request using express-validator
 * Checks validation results and returns errors if any
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
};

export default validate;
