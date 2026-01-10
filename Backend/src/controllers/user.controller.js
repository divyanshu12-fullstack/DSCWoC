import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Badge from '../models/Badge.model.js';
import PullRequest from '../models/PullRequest.model.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Public
 */
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = { isActive: true };

  // Filter by role
  if (req.query.role) {
    query.role = req.query.role;
  }

  // Search functionality
  if (req.query.search) {
    query.$or = [
      { fullName: { $regex: req.query.search, $options: 'i' } },
      { github_username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Sort options
  let sortOptions = { 'stats.points': -1 }; // Default: sort by points
  if (req.query.sortBy) {
    switch (req.query.sortBy) {
      case 'name':
        sortOptions = { fullName: 1 };
        break;
      case 'joined':
        sortOptions = { createdAt: -1 };
        break;
      case 'prs':
        sortOptions = { 'stats.totalPRs': -1 };
        break;
      default:
        sortOptions = { 'stats.points': -1 };
    }
  }

  const users = await User.find(query)
    .populate('badges', 'name icon color rarity')
    .select('-__v')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  paginatedResponse(res, users, page, limit, total, 'Users retrieved successfully');
});

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('badges', 'name description icon color rarity points_reward')
    .populate({
      path: 'pullRequests',
      select: 'title github_url status points github_data.created_at',
      options: { sort: { 'github_data.created_at': -1 }, limit: 10 }
    })
    .select('-__v');

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  successResponse(res, user, 'User retrieved successfully');
});

/**
 * @desc    Get user by username
 * @route   GET /api/v1/users/username/:username
 * @access  Public
 */
export const getUserByUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    github_username: req.params.username,
    isActive: true
  })
    .populate('badges', 'name description icon color rarity')
    .populate({
      path: 'pullRequests',
      select: 'title github_url status points github_data.created_at',
      options: { sort: { 'github_data.created_at': -1 }, limit: 10 }
    })
    .select('-__v');

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      message: 'User not found',
    });
  }

  successResponse(res, user, 'User retrieved successfully');
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/:id
 * @access  Private
 */
export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Check if user can update (own profile or admin)
  if (req.user._id.toString() !== userId && req.user.role !== 'Admin') {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      status: 'error',
      message: 'You can only update your own profile',
    });
  }

  // Allowed fields for update
  const allowedFields = ['fullName', 'bio', 'college', 'yearOfStudy'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Admin can update role
  if (req.user.role === 'Admin' && req.body.role) {
    updateData.role = req.body.role;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).populate('badges', 'name description icon color rarity');

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  successResponse(res, user, 'User updated successfully');
});

/**
 * @desc    Get user leaderboard with filter support
 * @route   GET /api/v1/users/leaderboard
 * @access  Public
 * @query   {string} filter - 'overall' (default) or 'weekly'
 * @query   {number} page - Page number for pagination
 * @query   {number} limit - Items per page
 * @returns {Object} Paginated leaderboard data with user rankings
 */
export const getLeaderboard = asyncHandler(async (req, res) => {
  // Extract and validate query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;
  const filter = req.query.filter || 'overall';

  let users;
  let total;
  let summary;

  try {
    if (filter === 'weekly') {
      // Calculate date 7 days ago for weekly filter
      // This filters users who have had PR activity in the last week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Aggregate PRs from last 7 days to calculate weekly stats
      // Groups by user and sums points/PR count
      const weeklyStats = await PullRequest.aggregate([
        {
          $match: {
            'github_data.created_at': { $gte: weekAgo }
          }
        },
        {
          $group: {
            _id: '$user',
            weeklyPoints: { $sum: '$points' },
            weeklyPRs: { $sum: 1 }
          }
        },
        { $sort: { weeklyPoints: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);

      // Get user details for the weekly stats results
      const userIds = weeklyStats.map(s => s._id);
      const usersData = await User.find({ _id: { $in: userIds }, isActive: true })
        .populate('badges', 'name icon color rarity')
        .select('fullName github_username avatar_url stats badges role createdAt');

      // Merge weekly stats with user data and add rank
      users = weeklyStats.map((stat, index) => {
        const userData = usersData.find(u => u._id.toString() === stat._id.toString());
        if (!userData) return null;
        return {
          ...userData.toObject(),
          weeklyStats: {
            points: stat.weeklyPoints,
            prs: stat.weeklyPRs
          },
          rank: skip + index + 1
        };
      }).filter(u => u !== null); // Filter out null users

      // Get total count of users with weekly activity
      const totalResult = await PullRequest.aggregate([
        { $match: { 'github_data.created_at': { $gte: weekAgo } } },
        { $group: { _id: '$user' } },
        { $count: 'total' }
      ]);
      total = totalResult[0]?.total || 0;

      // Weekly summary (best-effort): totals for last 7 days
      const weeklySummaryAgg = await PullRequest.aggregate([
        { $match: { 'github_data.created_at': { $gte: weekAgo } } },
        {
          $group: {
            _id: null,
            totalPoints: { $sum: '$points' },
            totalPRs: { $sum: 1 },
          },
        },
      ]);
      summary = {
        contributors: total,
        totalPoints: weeklySummaryAgg[0]?.totalPoints || 0,
        totalPRs: weeklySummaryAgg[0]?.totalPRs || 0,
        generatedAt: new Date().toISOString(),
        filter,
      };
    } else {
      // Overall leaderboard - returns all-time rankings
      // Sorted by points (primary) and total PRs (secondary)
      users = await User.find({ isActive: true })
        .populate('badges', 'name icon color rarity')
        .select('fullName github_username avatar_url stats badges role createdAt')
        .sort({ 'stats.points': -1, 'stats.totalPRs': -1 })
        .skip(skip)
        .limit(limit);

      total = await User.countDocuments({ isActive: true });

      // Add rank to each user based on position
      users = users.map((user, index) => ({
        ...user.toObject(),
        rank: skip + index + 1
      }));

      // Overall summary
      const overallSummaryAgg = await User.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalPoints: { $sum: '$stats.points' },
            totalMergedPRs: { $sum: '$stats.mergedPRs' },
          },
        },
      ]);
      summary = {
        contributors: total,
        totalPoints: overallSummaryAgg[0]?.totalPoints || 0,
        totalMergedPRs: overallSummaryAgg[0]?.totalMergedPRs || 0,
        generatedAt: new Date().toISOString(),
        filter,
      };
    }

    // Add per-user projects count for the current page (distinct projects from PRs)
    const userIds = users.map(u => u?._id).filter(Boolean);
    if (userIds.length > 0) {
      const projectsAgg = await PullRequest.aggregate([
        { $match: { user: { $in: userIds } } },
        { $group: { _id: '$user', projects: { $addToSet: '$project' } } },
        { $project: { projectsCount: { $size: '$projects' } } },
      ]);

      const projectsMap = new Map(projectsAgg.map(p => [p._id.toString(), p.projectsCount]));
      users = users.map(u => ({
        ...u,
        projectsCount: projectsMap.get(u._id.toString()) || 0,
      }));
    }

    // Custom response to include summary
    const totalPages = Math.ceil(total / limit);
    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Leaderboard retrieved successfully',
      data: users,
      summary,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    // Log error with context for debugging
    console.error('Leaderboard fetch error in user.controller.js:', error);
    throw error;
  }
});


/**
 * @desc    Get current user profile
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('badges', 'name description icon color rarity points_reward')
    .populate({
      path: 'pullRequests',
      select: 'title github_url status points github_data.created_at project',
      populate: {
        path: 'project',
        select: 'name github_url'
      },
      options: { sort: { 'github_data.created_at': -1 }, limit: 20 }
    })
    .select('-__v');

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  successResponse(res, user, 'User profile retrieved successfully');
});

/**
 * @desc    Get current user badges
 * @route   GET /api/v1/users/me/badges
 * @access  Private
 */
export const getUserBadges = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('badges', 'name description icon color rarity points_reward')
    .select('-__v');

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  successResponse(res, user.badges, 'User badges retrieved successfully');
});

/**
 * @desc    Get current user points
 * @route   GET /api/v1/users/me/points
 * @access  Private
 */
export const getUserPoints = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('badges', 'name description icon color rarity points_reward')
    .select('-__v');

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  successResponse(res, user.stats.points, 'User points retrieved successfully');
});

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/v1/users/:id/role
 * @access  Private (Admin)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['Contributor', 'Mentor', 'Admin'].includes(role)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid role. Must be Contributor, Mentor, or Admin',
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('fullName github_username email role');

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  successResponse(res, user, 'User role updated successfully');
});

/**
 * @desc    Get user statistics
 * @route   GET /api/v1/users/stats
 * @access  Public
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isActive: true });
  const totalContributors = await User.countDocuments({ role: 'Contributor', isActive: true });
  const totalMentors = await User.countDocuments({ role: 'Mentor', isActive: true });
  const totalAdmins = await User.countDocuments({ role: 'Admin', isActive: true });

  // Get top contributors
  const topContributors = await User.find({ isActive: true })
    .select('fullName github_username avatar_url stats')
    .sort({ 'stats.points': -1 })
    .limit(5);

  const stats = {
    totalUsers,
    totalContributors,
    totalMentors,
    totalAdmins,
    topContributors
  };

  successResponse(res, stats, 'User statistics retrieved successfully');
});
