import { createClient } from '@supabase/supabase-js';
import User from '../models/User.model.js';
import Badge from '../models/Badge.model.js';
import { HTTP_STATUS } from '../config/constants.js';
import { successResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

// Function to get Supabase client (lazy initialization)
const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error('Missing Supabase environment variables for auth controller');
    return null;
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
};

/**
 * @desc    Initiate GitHub OAuth login
 * @route   GET /api/v1/auth/github
 * @access  Public
 */
export const initiateGitHubAuth = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Authentication service not available',
      });
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.CORS_ORIGIN}/auth/callback`,
        scopes: 'read:user user:email',
      },
    });

    if (error) {
      logger.error('GitHub OAuth initiation error:', error);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Failed to initiate GitHub authentication',
        error: error.message,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'GitHub authentication initiated',
      data: {
        url: data.url,
      },
    });
  } catch (error) {
    logger.error('GitHub OAuth error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Authentication service error',
    });
  }
};

/**
 * @desc    Handle GitHub OAuth callback
 * @route   POST /api/v1/auth/github/callback
 * @access  Public
 */
export const handleGitHubCallback = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Authentication service not available',
      });
    }

    const { access_token, refresh_token, intended_role } = req.body;

    if (!access_token) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Access token is required',
      });
    }

    // Log the intended role for debugging
    logger.info(`Login attempt with intended role: ${intended_role || 'contributor'}`);

    // Get user from Supabase
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser(access_token);

    if (authError || !supabaseUser) {
      logger.error('Supabase user fetch error:', authError);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Invalid access token',
      });
    }

    // Extract GitHub user data
    const githubData = supabaseUser.user_metadata;
    const githubId = githubData.provider_id || supabaseUser.id;
    const githubUsername = githubData.user_name || githubData.preferred_username;
    const email = supabaseUser.email;
    const fullName = githubData.full_name || githubData.name || githubUsername;
    const avatarUrl = githubData.avatar_url || '';

    // Find or create user in our database
    let user = await User.findOne({ github_id: githubId });
    let isNewMentorRequest = false;

    if (user) {
      // Update existing user
      user.github_username = githubUsername;
      user.email = email;
      user.fullName = fullName;
      user.avatar_url = avatarUrl;
      user.lastLogin = new Date();

      // Check if user is trying to login as mentor but doesn't have mentor/admin role
      if (intended_role === 'mentor' && user.role === 'Contributor') {
        // User is trying to use mentor login but is only a contributor
        // They should use the contributor login instead
        logger.warn(`Contributor ${githubUsername} attempted to login via mentor portal`);
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          status: 'error',
          message:
            'You are not authorized as a Mentor/Admin. Please use the "Continue with GitHub" button for contributor login.',
        });
      }

      await user.save();
    } else {
      // Create new user
      // If they're using the mentor login but are a new user, they can't be a mentor yet
      if (intended_role === 'mentor') {
        isNewMentorRequest = true;
        logger.info(`New user ${githubUsername} attempting mentor login - creating as contributor`);
      }

      user = new User({
        github_id: githubId,
        github_username: githubUsername,
        email: email,
        fullName: fullName,
        avatar_url: avatarUrl,
        role: 'Contributor', // Always default to Contributor, admins assign roles manually
        lastLogin: new Date(),
      });
      await user.save();

      // Check for badges for new user
      await Badge.checkAndAwardBadges(user._id);

      // If new user tried to use mentor login, inform them
      if (isNewMentorRequest) {
        await user.populate('badges');
        return res.status(HTTP_STATUS.OK).json({
          status: 'success',
          message:
            'Account created as Contributor. Contact an admin if you should have Mentor/Admin access.',
          data: {
            user: {
              id: user._id,
              github_id: user.github_id,
              github_username: user.github_username,
              email: user.email,
              fullName: user.fullName,
              avatar_url: user.avatar_url,
              role: user.role,
              stats: user.stats,
              badges: user.badges,
            },
            tokens: {
              access_token,
              refresh_token,
            },
            redirectUrl: '/dashboard',
            mentorRequestNote:
              'You used the Mentor/Admin login but your account was created as a Contributor. Please contact an administrator if you should have elevated privileges.',
          },
        });
      }
    }

    // Populate user data
    await user.populate('badges');

    // Determine redirect URL based on role
    let redirectUrl = '/dashboard';
    switch (user.role) {
      case 'Admin':
        redirectUrl = '/admin';
        break;
      case 'Mentor':
        redirectUrl = '/mentor/dashboard';
        break;
      default:
        redirectUrl = '/dashboard';
    }

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Authentication successful',
      data: {
        user: {
          id: user._id,
          github_id: user.github_id,
          github_username: user.github_username,
          email: user.email,
          fullName: user.fullName,
          avatar_url: user.avatar_url,
          role: user.role,
          stats: user.stats,
          badges: user.badges,
        },
        tokens: {
          access_token,
          refresh_token,
        },
        redirectUrl,
      },
    });
  } catch (error) {
    logger.error('GitHub callback error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Authentication callback failed',
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges').select('-__v');

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'User not found',
      });
    }

    successResponse(
      res,
      {
        user: {
          id: user._id,
          github_id: user.github_id,
          github_username: user.github_username,
          email: user.email,
          fullName: user.fullName,
          avatar_url: user.avatar_url,
          bio: user.bio,
          college: user.college,
          role: user.role,
          stats: user.stats,
          badges: user.badges,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        },
      },
      'User profile retrieved successfully'
    );
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to retrieve user profile',
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    // Supabase handles token invalidation on client side
    // We just need to confirm logout on server side

    successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Logout failed',
    });
  }
};

/**
 * @desc    Refresh user data from GitHub
 * @route   POST /api/v1/auth/refresh
 * @access  Private
 */
export const refreshUserData = async (req, res) => {
  try {
    const user = req.user;

    // Update user stats
    await user.updateStats();

    // Check for new badges
    const newBadges = await Badge.checkAndAwardBadges(user._id);

    // Get updated user data
    const updatedUser = await User.findById(user._id).populate('badges');

    successResponse(
      res,
      {
        user: {
          id: updatedUser._id,
          github_id: updatedUser.github_id,
          github_username: updatedUser.github_username,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          avatar_url: updatedUser.avatar_url,
          bio: updatedUser.bio,
          college: updatedUser.college,
          role: updatedUser.role,
          stats: updatedUser.stats,
          badges: updatedUser.badges,
        },
        newBadges: newBadges.map((badge) => ({
          id: badge._id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          color: badge.color,
          rarity: badge.rarity,
        })),
      },
      'User data refreshed successfully'
    );
  } catch (error) {
    logger.error('Refresh user data error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to refresh user data',
    });
  }
};
