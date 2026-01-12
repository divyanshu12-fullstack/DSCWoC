import User from '../models/User.model.js';
import Project from '../models/Project.model.js';
import PullRequest from '../models/PullRequest.model.js';
import Badge from '../models/Badge.model.js';
import Contact from '../models/Contact.model.js';
import { HTTP_STATUS } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Get Admin Dashboard Overview Statistics
 * @route GET /api/admin/overview
 */
export const getOverview = async (req, res) => {
  try {
    // Total registrations
    const totalUsers = await User.countDocuments();
    const activeContributors = await User.countDocuments({ 
      role: 'Contributor', 
      isActive: true 
    });

    // Total projects
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ isActive: true });

    // Pull requests stats
    const totalPRs = await PullRequest.countDocuments();
    const mergedPRs = await PullRequest.countDocuments({ status: 'merged' });
    const pendingPRs = await PullRequest.countDocuments({ status: 'open' });

    // Points distributed - use stats.points field
    const pointsResult = await User.aggregate([
      { $group: { _id: null, totalPoints: { $sum: '$stats.points' } } }
    ]);
    const totalPointsDistributed = pointsResult[0]?.totalPoints || 0;

    // Badges issued
    const totalBadgesIssued = await User.aggregate([
      { $project: { badgeCount: { $size: { $ifNull: ['$badges', []] } } } },
      { $group: { _id: null, total: { $sum: '$badgeCount' } } }
    ]);
    const badgesIssued = totalBadgesIssued[0]?.total || 0;

    // Contact messages stats
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });

    // Top 5 contributors
    const topContributors = await User.find({ role: 'Contributor' })
      .sort({ 'stats.points': -1 })
      .limit(5)
      .select('github_username fullName avatar_url stats.points')
      .lean();

    // Projects with no activity (no PRs in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const inactiveProjects = await Project.countDocuments({
      isActive: true,
      updatedAt: { $lt: sevenDaysAgo }
    });

    successResponse(res, {
      stats: {
        totalUsers,
        activeContributors,
        totalProjects,
        activeProjects,
        totalPRs,
        mergedPRs,
        pendingPRs,
        totalPointsDistributed,
        badgesIssued,
        totalContacts,
        newContacts
      },
      topContributors: topContributors.map(u => ({
        _id: u._id,
        username: u.github_username,
        fullName: u.fullName,
        avatar_url: u.avatar_url,
        totalPoints: u.stats?.points || 0
      })),
      alerts: {
        pendingPRs,
        inactiveProjects,
        newContacts
      }
    }, 'Admin overview fetched successfully');

  } catch (error) {
    logger.error('Error fetching admin overview:', error);
    errorResponse(res, 'Failed to fetch overview statistics', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get all users with filters
 * @route GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role, track, status, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (track) filter.track = track;
    if (status) filter.isActive = status === 'active';
    if (search) {
      filter.$or = [
        { github_username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-__v')
      .populate('badges', 'name icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(filter);

    // Map to expected format
    const mappedUsers = users.map(u => ({
      _id: u._id,
      username: u.github_username,
      fullName: u.fullName,
      email: u.email,
      avatar_url: u.avatar_url,
      role: u.role,
      track: u.track || 'N/A',
      totalPoints: u.stats?.points || 0,
      isActive: u.isActive,
      badges: u.badges
    }));

    successResponse(res, {
      users: mappedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Users fetched successfully');

  } catch (error) {
    logger.error('Error fetching users:', error);
    errorResponse(res, 'Failed to fetch users', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update user role
 * @route PATCH /api/admin/users/:id/role
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, reason } = req.body;

    const validRoles = ['Contributor', 'Mentor', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('Invalid role')
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('User not found')
      );
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Log the action
    logger.info(`Admin ${req.user.github_username} changed role of ${user.github_username} from ${oldRole} to ${role}. Reason: ${reason || 'N/A'}`);

    res.json(successResponse(
      { user: { id: user._id, username: user.github_username, role: user.role } },
      'User role updated successfully'
    ));

  } catch (error) {
    logger.error('Error updating user role:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to update user role')
    );
  }
};

/**
 * Update user status (active/inactive)
 * @route PATCH /api/admin/users/:id/status
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('User not found')
      );
    }

    user.isActive = isActive;
    await user.save();

    logger.info(`Admin ${req.user.github_username} ${isActive ? 'activated' : 'deactivated'} user ${user.github_username}. Reason: ${reason || 'N/A'}`);

    res.json(successResponse(
      { user: { id: user._id, username: user.github_username, isActive: user.isActive } },
      `User ${isActive ? 'activated' : 'deactivated'} successfully`
    ));

  } catch (error) {
    logger.error('Error updating user status:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to update user status')
    );
  }
};

/**
 * Manually adjust user points
 * @route PATCH /api/admin/users/:id/points
 */
export const adjustUserPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { points, reason } = req.body;

    if (typeof points !== 'number' || !reason) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('Points (number) and reason are required')
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('User not found')
      );
    }

    const oldPoints = user.stats?.points || 0;
    user.stats.bonusPoints = Math.max(0, (user.stats?.bonusPoints || 0) + points);
    user.stats.points = Math.max(0, (user.stats?.prPoints || 0) + user.stats.bonusPoints);
    await user.save();

    logger.warn(`Admin ${req.user.github_username} adjusted points for ${user.github_username} from ${oldPoints} to ${user.stats.points}. Change: ${points}. Reason: ${reason}`);

    res.json(successResponse(
      { 
        user: { 
          id: user._id, 
          username: user.github_username,
          oldPoints, 
          newPoints: user.stats.points,
          change: points
        } 
      },
      'User points adjusted successfully'
    ));

  } catch (error) {
    logger.error('Error adjusting user points:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to adjust user points')
    );
  }
};

/**
 * Get user's PR history
 * @route GET /api/admin/users/:id/prs
 */
export const getUserPRHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('User not found')
      );
    }

    const prs = await PullRequest.find({ user: id })
      .populate('project', 'name github_url github_owner github_repo')
      .sort({ createdAt: -1 })
      .lean();

    res.json(successResponse(
      { user: { username: user.github_username, fullName: user.fullName }, prs },
      'User PR history fetched successfully'
    ));

  } catch (error) {
    logger.error('Error fetching user PR history:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to fetch PR history')
    );
  }
};

// ==================== PROJECT MANAGEMENT ====================

/**
 * Get all projects with filters
 * @route GET /api/admin/projects
 */
export const getAllProjects = async (req, res) => {
  try {
    const { track, status, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (track) filter.track = track;
    if (status) filter.isActive = status === 'active';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(filter)
      .populate('mentor', 'github_username fullName avatar_url')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add PR count for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const prCount = await PullRequest.countDocuments({ project: project._id });
        return { 
          ...project, 
          prCount,
          repoLink: project.github_url,
          track: project.difficulty || 'N/A',
          mentor: project.mentor ? {
            username: project.mentor.github_username,
            fullName: project.mentor.fullName
          } : null
        };
      })
    );

    const total = await Project.countDocuments(filter);

    successResponse(res, {
      projects: projectsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Projects fetched successfully');

  } catch (error) {
    logger.error('Error fetching projects:', error);
    errorResponse(res, 'Failed to fetch projects', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Create/Approve a new project
 * @route POST /api/admin/projects
 */
export const createProject = async (req, res) => {
  try {
    const { name, description, repoLink, track, techStack, difficulty, mentor } = req.body;

    // Check if project already exists
    const existingProject = await Project.findOne({ repoLink });
    if (existingProject) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('Project with this repository already exists')
      );
    }

    const project = new Project({
      name,
      description,
      repoLink,
      track,
      techStack,
      difficulty,
      mentor,
      isActive: true
    });

    await project.save();

    logger.info(`Admin ${req.user.github_username} created project: ${name}`);

    res.status(HTTP_STATUS.CREATED).json(successResponse(
      { project },
      'Project created successfully'
    ));

  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to create project')
    );
  }
};

/**
 * Update project details
 * @route PATCH /api/admin/projects/:id
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('mentor', 'username fullName');

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('Project not found')
      );
    }

    logger.info(`Admin ${req.user.github_username} updated project: ${project.name}`);

    res.json(successResponse(
      { project },
      'Project updated successfully'
    ));

  } catch (error) {
    logger.error('Error updating project:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to update project')
    );
  }
};

/**
 * Assign/Change project mentor
 * @route PATCH /api/admin/projects/:id/mentor
 */
export const assignMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.body;

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'Mentor') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('Invalid mentor ID or user is not a mentor')
      );
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { mentor: mentorId },
      { new: true }
    ).populate('mentor', 'username fullName');

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('Project not found')
      );
    }

    logger.info(`Admin ${req.user.github_username} assigned mentor ${mentor.github_username} to project ${project.name}`);

    res.json(successResponse(
      { project },
      'Mentor assigned successfully'
    ));

  } catch (error) {
    logger.error('Error assigning mentor:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to assign mentor')
    );
  }
};

/**
 * Deactivate/Activate project
 * @route PATCH /api/admin/projects/:id/status
 */
export const toggleProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, reason } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('Project not found')
      );
    }

    project.isActive = isActive;
    await project.save();

    logger.info(`Admin ${req.user.github_username} ${isActive ? 'activated' : 'deactivated'} project ${project.name}. Reason: ${reason || 'N/A'}`);

    res.json(successResponse(
      { project: { id: project._id, name: project.name, isActive: project.isActive } },
      `Project ${isActive ? 'activated' : 'deactivated'} successfully`
    ));

  } catch (error) {
    logger.error('Error toggling project status:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to update project status')
    );
  }
};

// ==================== PULL REQUEST MONITORING ====================

/**
 * Get all PRs with filters
 * @route GET /api/admin/prs
 */
export const getAllPRs = async (req, res) => {
  try {
    const { project, contributor, status, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (project) filter.project = project;
    if (contributor) filter.user = contributor;
    if (status) filter.status = status;
    
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prs = await PullRequest.find(filter)
      .populate('user', 'github_username fullName avatar_url')
      .populate('project', 'name github_url')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await PullRequest.countDocuments(filter);

    // Map to expected format
    const mappedPRs = prs.map(pr => ({
      _id: pr._id,
      prNumber: pr.github_pr_number,
      title: pr.title,
      prLink: pr.github_url,
      status: pr.status === 'merged' ? 'Merged' : pr.status === 'open' ? 'Pending' : 'Rejected',
      pointsAwarded: pr.points || 0,
      contributor: pr.user ? { username: pr.user.github_username } : null,
      project: pr.project ? { name: pr.project.name } : null,
      createdAt: pr.createdAt
    }));

    successResponse(res, {
      prs: mappedPRs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Pull requests fetched successfully');

  } catch (error) {
    logger.error('Error fetching PRs:', error);
    errorResponse(res, 'Failed to fetch pull requests', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update PR status (verify/reject spam)
 * @route PATCH /api/admin/prs/:id/status
 */
export const updatePRStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, adminNote } = req.body;

    const validStatuses = ['Pending', 'Merged', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('Invalid status')
      );
    }

    const pr = await PullRequest.findById(id);

    if (!pr) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('Pull request not found')
      );
    }

    const oldStatus = pr.status;

    // Map legacy admin statuses to our PR/validation model
    if (status === 'Merged') {
      pr.status = 'merged';
      pr.validation.isValidated = true;
      pr.validation.validationStatus = 'approved';
      pr.validation.validatedBy = req.user._id;
      pr.validation.validatedAt = new Date();
      if (adminNote) pr.validation.validationNotes = adminNote;
    } else if (status === 'Pending') {
      pr.status = 'open';
      if (adminNote) pr.validation.validationNotes = adminNote;
    } else if (status === 'Rejected') {
      pr.status = 'closed';
      pr.validation.isValidated = true;
      pr.validation.validationStatus = 'rejected';
      pr.validation.validatedBy = req.user._id;
      pr.validation.validatedAt = new Date();
      pr.validation.validationNotes = adminNote || reason || 'Rejected by admin';
    }

    pr.calculatePoints();
    await pr.save();

    // Update user stats
    const userDoc = await User.findById(pr.user);
    if (userDoc) {
      await userDoc.updateStats();
      await Badge.checkAndAwardBadges(userDoc._id);
    }
    await User.updateRanks();

    logger.info(`Admin ${req.user.github_username} changed PR #${pr.github_pr_number} status from ${oldStatus} to ${pr.status}. Reason: ${reason || 'N/A'}`);

    res.json(successResponse(
      { pr: { id: pr._id, prNumber: pr.github_pr_number, status: pr.status } },
      'PR status updated successfully'
    ));

  } catch (error) {
    logger.error('Error updating PR status:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to update PR status')
    );
  }
};

/**
 * Adjust PR points
 * @route PATCH /api/admin/prs/:id/points
 */
export const adjustPRPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { points, reason } = req.body;

    if (typeof points !== 'number' || points < 0 || !reason) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('Valid points (>=0) and reason are required')
      );
    }

    const pr = await PullRequest.findById(id);

    if (!pr) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('Pull request not found')
      );
    }

    const oldPoints = pr.points || 0;
    const pointsDiff = points - oldPoints;

    // Update PR points (manual override)
    pr.pointsOverride = points;
    pr.calculatePoints();
    await pr.save();

    // Update user stats
    const userDoc = await User.findById(pr.user);
    if (userDoc) {
      await userDoc.updateStats();
      await Badge.checkAndAwardBadges(userDoc._id);
    }
    await User.updateRanks();

    logger.warn(`Admin ${req.user.github_username} adjusted PR #${pr.github_pr_number} points from ${oldPoints} to ${points}. User points changed by ${pointsDiff}. Reason: ${reason}`);

    res.json(successResponse(
      { 
        pr: { 
          id: pr._id, 
          prNumber: pr.github_pr_number,
          oldPoints, 
          newPoints: points,
          change: pointsDiff
        } 
      },
      'PR points adjusted successfully'
    ));

  } catch (error) {
    logger.error('Error adjusting PR points:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to adjust PR points')
    );
  }
};

/**
 * Add admin note to PR
 * @route PATCH /api/admin/prs/:id/note
 */
export const addPRNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || note.trim().length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('Note cannot be empty')
      );
    }

    const pr = await PullRequest.findByIdAndUpdate(
      id,
      { 'validation.validationNotes': note },
      { new: true }
    );

    if (!pr) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('Pull request not found')
      );
    }

    logger.info(`Admin ${req.user.github_username} added note to PR #${pr.github_pr_number}`);

    res.json(successResponse(
      { pr: { id: pr._id, prNumber: pr.github_pr_number, adminNote: pr.validation?.validationNotes || '' } },
      'Admin note added successfully'
    ));

  } catch (error) {
    logger.error('Error adding PR note:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to add admin note')
    );
  }
};

// ==================== LEADERBOARD & POINTS CONTROL ====================

/**
 * Get leaderboard data (all or by track)
 * @route GET /api/admin/leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const { track, limit = 100 } = req.query;

    const filter = { role: 'Contributor', isActive: true };
    if (track) filter.track = track;

    const leaderboard = await User.find(filter)
      .select('github_username fullName avatar_url stats.points stats.totalPRs stats.mergedPRs college')
      .sort({ 'stats.points': -1, 'stats.totalPRs': -1 })
      .limit(parseInt(limit))
      .lean();

    // Add rank
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      username: user.github_username,
      totalPoints: user.stats?.points || 0,
      rank: index + 1
    }));

    res.json(successResponse(
      { leaderboard: rankedLeaderboard, total: leaderboard.length },
      'Leaderboard fetched successfully'
    ));

  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to fetch leaderboard')
    );
  }
};

/**
 * Recalculate all user points (based on merged PRs)
 * @route POST /api/admin/points/recalculate
 */
export const recalculatePoints = async (req, res) => {
  try {
    const users = await User.find({ role: 'Contributor' });

    let updatedCount = 0;
    for (const user of users) {
      const before = user.stats?.points || 0;
      await user.updateStats();
      await Badge.checkAndAwardBadges(user._id);
      const after = user.stats?.points || 0;
      if (before !== after) updatedCount++;
    }

    await User.updateRanks();

    logger.warn(`Admin ${req.user.github_username} recalculated points for ${updatedCount} users`);

    res.json(successResponse(
      { usersUpdated: updatedCount },
      'Points recalculated successfully'
    ));

  } catch (error) {
    logger.error('Error recalculating points:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to recalculate points')
    );
  }
};

// ==================== BADGES & CERTIFICATES ====================

/**
 * Get all badges with assignment count
 * @route GET /api/admin/badges
 */
export const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().lean();

    // Count how many users have each badge
    const badgesWithCounts = await Promise.all(
      badges.map(async (badge) => {
        const count = await User.countDocuments({ badges: badge._id });
        return { ...badge, assignedCount: count };
      })
    );

    res.json(successResponse(
      { badges: badgesWithCounts },
      'Badges fetched successfully'
    ));

  } catch (error) {
    logger.error('Error fetching badges:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to fetch badges')
    );
  }
};

/**
 * Manually assign badge to user
 * @route POST /api/admin/badges/assign
 */
export const assignBadge = async (req, res) => {
  try {
    const { userId, badgeId, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('User not found')
      );
    }

    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse('Badge not found')
      );
    }

    const awarded = await badge.awardToUser(user._id);
    if (!awarded) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('User already has this badge')
      );
    }

    logger.info(`Admin ${req.user.github_username} assigned badge "${badge.name}" to ${user.github_username}. Reason: ${reason || 'N/A'}`);

    res.json(successResponse(
      { user: { username: user.github_username }, badge: { name: badge.name } },
      'Badge assigned successfully'
    ));

  } catch (error) {
    logger.error('Error assigning badge:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to assign badge')
    );
  }
};

// ==================== EXPORTS & REPORTS ====================

/**
 * Export users list as CSV data
 * @route GET /api/admin/export/users
 */
export const exportUsers = async (req, res) => {
  try {
    const { role, track } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (track) filter.track = track;

    const users = await User.find(filter)
      .select('github_username fullName email github_id role track college stats.points isActive createdAt')
      .lean();

    const exportedUsers = users.map((u) => ({
      ...u,
      username: u.github_username,
      totalPoints: u.stats?.points || 0,
    }));

    res.json(successResponse(
      { users: exportedUsers, count: exportedUsers.length },
      'Users data exported successfully'
    ));

  } catch (error) {
    logger.error('Error exporting users:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to export users')
    );
  }
};

/**
 * Export PRs data
 * @route GET /api/admin/export/prs
 */
export const exportPRs = async (req, res) => {
  try {
    const prs = await PullRequest.find()
      .populate('user', 'github_username fullName')
      .populate('project', 'name')
      .select('github_pr_number title github_url status points pointsOverride github_data.merged_at github_data.created_at createdAt')
      .lean();

    const exportedPRs = prs.map((pr) => ({
      ...pr,
      prNumber: pr.github_pr_number,
      prLink: pr.github_url,
      pointsAwarded: pr.points || 0,
      contributor: pr.user,
      mergedAt: pr.github_data?.merged_at,
    }));

    res.json(successResponse(
      { prs: exportedPRs, count: exportedPRs.length },
      'PRs data exported successfully'
    ));

  } catch (error) {
    logger.error('Error exporting PRs:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to export PRs')
    );
  }
};

/**
 * Export leaderboard snapshot
 * @route GET /api/admin/export/leaderboard
 */
export const exportLeaderboard = async (req, res) => {
  try {
    const { track } = req.query;

    const filter = { role: 'Contributor', isActive: true };
    if (track) filter.track = track;

    const leaderboard = await User.find(filter)
      .select('github_username fullName email stats.points stats.totalPRs track college')
      .sort({ 'stats.points': -1, 'stats.totalPRs': -1 })
      .lean();

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user,
      username: user.github_username,
      totalPoints: user.stats?.points || 0,
    }));

    res.json(successResponse(
      { leaderboard: rankedLeaderboard, count: rankedLeaderboard.length },
      'Leaderboard exported successfully'
    ));

  } catch (error) {
    logger.error('Error exporting leaderboard:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      errorResponse('Failed to export leaderboard')
    );
  }
};
