const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const AppError = require('../utils/AppError');
const { sendError } = require('../utils/responseHandler');
const logger = require('../utils/logger');

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return sendError(res, 401, 'User no longer exists');
      }

      if (!req.user.isActive) {
        return sendError(res, 401, 'User account is deactivated');
      }

      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return sendError(res, 401, 'Not authorized to access this route');
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return sendError(res, 500, 'Server error in authentication');
  }
};

// Authorize roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
