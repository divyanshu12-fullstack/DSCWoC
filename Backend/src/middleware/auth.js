import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import User from '../models/User.model.js';
import logger from '../utils/logger.js';

// Function to get Supabase client (lazy initialization)
const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    logger.error('Missing Supabase environment variables');
    return null;
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
};

/**
 * Middleware to authenticate requests using Supabase JWT
 */
export const authenticate = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Authentication service not available',
      });
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Access token required',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify Supabase JWT
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    
    if (error || !supabaseUser) {
      logger.error('Supabase auth error:', error);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Invalid or expired token',
      });
    }

    // Find user in our database
    const user = await User.findOne({ 
      github_id: supabaseUser.user_metadata?.provider_id || supabaseUser.id 
    }).populate('badges');

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'User not found in database',
      });
    }

    if (!user.isActive) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'error',
        message: 'Account is deactivated',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Attach user to request
    req.user = user;
    req.supabaseUser = supabaseUser;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: 'error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Middleware to authorize based on user roles
 */
export const authorize = (...roles) => (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'error',
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }

    next();
  } catch (error) {
    logger.error('Authorization error:', error);
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      status: 'error',
      message: 'Authorization failed',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return next(); // Continue without authentication if Supabase not available
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);

    // Verify Supabase JWT
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    
    if (error || !supabaseUser) {
      return next(); // Continue without authentication
    }

    // Find user in our database
    const user = await User.findOne({ 
      github_id: supabaseUser.user_metadata?.provider_id || supabaseUser.id 
    }).populate('badges');

    if (user && user.isActive) {
      req.user = user;
      req.supabaseUser = supabaseUser;
    }

    next();
  } catch (error) {
    logger.error('Optional auth error:', error);
    next(); // Continue without authentication on error
  }
};

