import Project from '../models/Project.model.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * @desc    Get all projects
 * @route   GET /api/v1/projects
 * @access  Public
 */
export const getProjects = asyncHandler(async (req, res) => {
  // TODO: Implement pagination
  // TODO: Implement filtering (difficulty, tags, status)
  // TODO: Implement search functionality
  
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Get all projects - TODO: Implement this endpoint',
  });
});

/**
 * @desc    Get single project
 * @route   GET /api/v1/projects/:id
 * @access  Public
 */
export const getProject = asyncHandler(async (req, res) => {
  // TODO: Fetch project by ID
  // TODO: Populate mentors and pull requests
  
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Get single project - TODO: Implement this endpoint',
  });
});

/**
 * @desc    Create new project
 * @route   POST /api/v1/projects
 * @access  Private (Admin/Mentor)
 */
export const createProject = asyncHandler(async (req, res) => {
  // TODO: Validate GitHub repository URL
  // TODO: Fetch repository data from GitHub API
  // TODO: Create project in database
  
  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: 'Create project - TODO: Implement this endpoint',
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/v1/projects/:id
 * @access  Private (Admin/Mentor)
 */
export const updateProject = asyncHandler(async (req, res) => {
  // TODO: Find project by ID
  // TODO: Update allowed fields
  
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Update project - TODO: Implement this endpoint',
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/v1/projects/:id
 * @access  Private (Admin)
 */
export const deleteProject = asyncHandler(async (req, res) => {
  // TODO: Find and delete project
  
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Delete project - TODO: Implement this endpoint',
  });
});

/**
 * @desc    Sync project with GitHub
 * @route   POST /api/v1/projects/:id/sync
 * @access  Private (Admin/Mentor)
 */
export const syncProject = asyncHandler(async (req, res) => {
  // TODO: Fetch latest data from GitHub API
  // TODO: Update project stats
  
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Sync project - TODO: Implement this endpoint',
  });
});

/**
 * @desc    Get featured projects
 * @route   GET /api/v1/projects/featured
 * @access  Public
 */
export const getFeaturedProjects = asyncHandler(async (req, res) => {
  // TODO: Fetch featured projects
  
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Get featured projects - TODO: Implement this endpoint',
  });
});
