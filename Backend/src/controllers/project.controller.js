import Project from '../models/Project.model.js';
import User from '../models/User.model.js';
import { HTTP_STATUS } from '../config/constants.js';
import { successResponse } from '../utils/response.js';
import logger from '../utils/logger.js';
import githubService from '../services/github.service.js';

/**
 * @desc    Get all projects
 * @route   GET /api/v1/projects
 * @access  Public
 */
export const getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      difficulty,
      tags,
      tech,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      status = 'approved', // approved, pending, all
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Filter by approval status
    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    }
    // 'all' shows both

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by tags (comma-separated)
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      query.tags = { $in: tagArray };
    }

    // Filter by tech stack (comma-separated)
    if (tech) {
      const techArray = tech.split(',').map(t => t.trim());
      query.tech_stack = { $in: techArray };
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('mentor', 'github_username fullName avatar_url')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Project.countDocuments(query),
    ]);

    successResponse(res, {
      projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProjects: total,
        hasMore: skip + projects.length < total,
      },
    }, 'Projects fetched successfully');

  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to fetch projects',
    });
  }
};

/**
 * @desc    Get single project
 * @route   GET /api/v1/projects/:id
 * @access  Public
 */
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('mentor', 'github_username fullName avatar_url email')
      .populate({
        path: 'pullRequests',
        options: { sort: { createdAt: -1 }, limit: 10 },
        populate: { path: 'user', select: 'github_username avatar_url' },
      });

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    successResponse(res, { project }, 'Project fetched successfully');

  } catch (error) {
    logger.error('Error fetching project:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to fetch project',
    });
  }
};

/**
 * @desc    Get featured projects
 * @route   GET /api/v1/projects/featured
 * @access  Public
 */
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isActive: true,
      isApproved: true,
    })
      .populate('mentor', 'github_username fullName avatar_url')
      .sort({ 'stats.contributors': -1, 'stats.stars': -1 })
      .limit(6)
      .lean();

    successResponse(res, { projects }, 'Featured projects fetched successfully');

  } catch (error) {
    logger.error('Error fetching featured projects:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to fetch featured projects',
    });
  }
};

/**
 * @desc    Get current user's projects (mentor's projects)
 * @route   GET /api/v1/projects/my-projects
 * @access  Private (Mentor/Admin)
 */
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ mentor: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    successResponse(res, { projects }, 'Your projects fetched successfully');

  } catch (error) {
    logger.error('Error fetching user projects:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to fetch your projects',
    });
  }
};

/**
 * @desc    Create new project
 * @route   POST /api/v1/projects
 * @access  Private (Admin/Mentor)
 */
export const createProject = async (req, res) => {
  try {
    const { name, description, github_url, difficulty, tags, tech_stack } = req.body;

    // Parse GitHub URL
    let owner, repo;
    try {
      const parsed = githubService.parseRepoUrl(github_url);
      owner = parsed.owner;
      repo = parsed.repo;
    } catch (err) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Invalid GitHub repository URL',
      });
    }

    // Check if project already exists
    const existingProject = await Project.findOne({ github_owner: owner, github_repo: repo });
    if (existingProject) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'error',
        message: 'This repository is already registered as a project',
      });
    }

    // Validate repository exists and is accessible
    const validation = await githubService.validateRepository(owner, repo);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: `Cannot access repository: ${validation.error}`,
      });
    }

    // Create project
    const project = new Project({
      name: name || validation.data.name,
      description: description || validation.data.description || '',
      github_url,
      github_owner: owner,
      github_repo: repo,
      difficulty: difficulty || 'Intermediate',
      tags: tags || [],
      tech_stack: tech_stack || (validation.data.language ? [validation.data.language] : []),
      mentor: req.user._id,
      stats: {
        stars: validation.data.stars,
        forks: validation.data.forks,
      },
      isApproved: req.user.role === 'Admin', // Auto-approve if admin creates it
    });

    await project.save();
    await project.populate('mentor', 'github_username fullName avatar_url');

    logger.info(`Project created: ${project.name} by ${req.user.github_username}`);

    successResponse(res, { project }, 'Project created successfully', HTTP_STATUS.CREATED);

  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to create project',
    });
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/v1/projects/:id
 * @access  Private (Admin/Mentor - owner only)
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, difficulty, tags, tech_stack, isActive, syncEnabled } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'Admin' && project.mentor.toString() !== req.user._id.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'error',
        message: 'You can only update your own projects',
      });
    }

    // Update allowed fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (difficulty) project.difficulty = difficulty;
    if (tags) project.tags = tags;
    if (tech_stack) project.tech_stack = tech_stack;
    if (typeof isActive === 'boolean') project.isActive = isActive;
    if (typeof syncEnabled === 'boolean') project.syncEnabled = syncEnabled;

    await project.save();
    await project.populate('mentor', 'github_username fullName avatar_url');

    logger.info(`Project updated: ${project.name} by ${req.user.github_username}`);

    successResponse(res, { project }, 'Project updated successfully');

  } catch (error) {
    logger.error('Error updating project:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to update project',
    });
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/v1/projects/:id
 * @access  Private (Admin only)
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    // Soft delete - just mark as inactive
    project.isActive = false;
    await project.save();

    logger.info(`Project deleted: ${project.name} by ${req.user.github_username}`);

    successResponse(res, null, 'Project deleted successfully');

  } catch (error) {
    logger.error('Error deleting project:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to delete project',
    });
  }
};

/**
 * @desc    Sync project with GitHub
 * @route   POST /api/v1/projects/:id/sync
 * @access  Private (Admin/Mentor - owner only)
 */
export const syncProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'Admin' && project.mentor.toString() !== req.user._id.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'error',
        message: 'You can only sync your own projects',
      });
    }

    // Sync with GitHub
    const syncResult = await githubService.syncProjectPRs(project);

    successResponse(res, { 
      syncResult,
      project: await Project.findById(id).populate('mentor', 'github_username fullName avatar_url'),
    }, 'Project synced successfully');

  } catch (error) {
    logger.error('Error syncing project:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to sync project',
    });
  }
};

/**
 * @desc    Approve project (Admin only)
 * @route   PUT /api/v1/projects/:id/approve
 * @access  Private (Admin)
 */
export const approveProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    project.isApproved = true;
    await project.save();
    await project.populate('mentor', 'github_username fullName avatar_url');

    logger.info(`Project approved: ${project.name} by ${req.user.github_username}`);

    successResponse(res, { project }, 'Project approved successfully');

  } catch (error) {
    logger.error('Error approving project:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to approve project',
    });
  }
};

/**
 * @desc    Get all unique tags and tech stacks (for filters)
 * @route   GET /api/v1/projects/filters
 * @access  Public
 */
export const getProjectFilters = async (req, res) => {
  try {
    const [tags, techStacks] = await Promise.all([
      Project.distinct('tags', { isActive: true, isApproved: true }),
      Project.distinct('tech_stack', { isActive: true, isApproved: true }),
    ]);

    successResponse(res, {
      tags: tags.filter(Boolean).sort(),
      techStacks: techStacks.filter(Boolean).sort(),
      difficulties: ['Beginner', 'Intermediate', 'Advanced'],
    }, 'Filters fetched successfully');

  } catch (error) {
    logger.error('Error fetching filters:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to fetch filters',
    });
  }
};
