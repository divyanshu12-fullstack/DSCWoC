import { body, param } from 'express-validator';

/**
 * Validation schemas for project routes
 * TODO: Implement validation rules for:
 * - Project creation
 * - Project update
 * - GitHub URL validation
 */

export const createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('githubRepoUrl').isURL().withMessage('Please provide a valid GitHub repository URL'),
  // TODO: Add more validation rules
];

export const updateProjectValidation = [
  // TODO: Add validation rules
];
