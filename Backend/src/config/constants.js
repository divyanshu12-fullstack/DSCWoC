// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  PARTICIPANT: 'participant',
};

// Badge Types
export const BADGE_TYPES = {
  FIRST_PR: 'first_pr',
  FIVE_PRS: 'five_prs',
  TEN_PRS: 'ten_prs',
  MERGED_PR: 'merged_pr',
  TOP_CONTRIBUTOR: 'top_contributor',
  REVIEWER: 'reviewer',
  MENTOR: 'mentor',
  EARLY_BIRD: 'early_bird',
};

// Pull Request Status
export const PR_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  MERGED: 'merged',
  DRAFT: 'draft',
};

// Project Status
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

// Project Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// GitHub PR Labels
export const GITHUB_LABELS = {
  DSCWOC: 'dscwoc',
  BUG: 'bug',
  FEATURE: 'feature',
  DOCUMENTATION: 'documentation',
  GOOD_FIRST_ISSUE: 'good first issue',
  HELP_WANTED: 'help wanted',
};

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  PROJECT_NOT_FOUND: 'Project not found',
  PR_NOT_FOUND: 'Pull request not found',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  PROJECT_DELETED: 'Project deleted successfully',
  PR_SYNCED: 'Pull requests synced successfully',
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Event Configuration
export const EVENT_CONFIG = {
  START_DATE: '2025-01-01',
  END_DATE: '2025-02-28',
  NAME: 'DSCWoC 2025',
  DESCRIPTION: 'Developer Student Club Winter of Code',
};

export default {
  HTTP_STATUS,
  USER_ROLES,
  BADGE_TYPES,
  PR_STATUS,
  PROJECT_STATUS,
  DIFFICULTY_LEVELS,
  GITHUB_LABELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  EVENT_CONFIG,
};
