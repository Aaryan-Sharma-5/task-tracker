const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { sendResponse, sendError } = require('../utils/responseHandler');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User already exists with this email');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user' 
    });

    const token = generateToken(user._id);
    logger.info(`New user registered: ${email}`);

    sendResponse(res, 201, { user, token }, 'User registered successfully');
  } catch (error) {
    logger.error('Register error:', error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }
  
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    if (!user.isActive) {
      return sendError(res, 401, 'Account is deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const token = generateToken(user._id);
    logger.info(`User logged in: ${email}`);

    user.password = undefined;

    sendResponse(res, 200, { user, token }, 'Login successful');
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    sendResponse(res, 200, { user }, 'User retrieved successfully');
  } catch (error) {
    logger.error('Get me error:', error);
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    logger.info(`User profile updated: ${user.email}`);

    sendResponse(res, 200, { user }, 'Profile updated successfully');
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Please provide current and new password');
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    logger.info(`Password updated for user: ${user.email}`);

    sendResponse(res, 200, { token }, 'Password updated successfully');
  } catch (error) {
    logger.error('Update password error:', error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword
};
