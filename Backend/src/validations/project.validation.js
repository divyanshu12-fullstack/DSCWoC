import { body, param, query } from 'express-validator';

/**
 * Validation for creating a project
 */
export const createProjectValidation = [
  body('github_url')
    .trim()
    .notEmpty()
    .withMessage('GitHub repository URL is required')
    .matches(/^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/)
    .withMessage('Invalid GitHub repository URL format'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Project name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),

  body('tech_stack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array'),

  body('tech_stack.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tech must be between 1 and 30 characters'),
];

/**
 * Validation for updating a project
 */
export const updateProjectValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Project name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tech_stack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('syncEnabled')
    .optional()
    .isBoolean()
    .withMessage('syncEnabled must be a boolean'),
];

/**
 * Validation for project ID param
 */
export const projectIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
];

/**
 * Validation for listing projects query params
 */
export const listProjectsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  query('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty filter'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'name', 'stats.stars', 'stats.contributors'])
    .withMessage('Invalid sort field'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
];
