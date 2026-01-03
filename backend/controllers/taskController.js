const Task = require('../models/Task');
const { sendResponse, sendError } = require('../utils/responseHandler');
const logger = require('../utils/logger');

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, page = 1, limit = 10 } = req.query;

    const query = {};
  
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    let sortOption = { createdAt: -1 }; 
    if (sort) {
      const sortFields = sort.split(',').join(' ');
      sortOption = sortFields;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('user', 'name email');

    const total = await Task.countDocuments(query);

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    };

    sendResponse(res, 200, { tasks, pagination }, 'Tasks retrieved successfully');
  } catch (error) {
    logger.error('Get tasks error:', error);
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    if (task.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to access this task');
    }

    sendResponse(res, 200, { task }, 'Task retrieved successfully');
  } catch (error) {
    logger.error('Get task error:', error);
    next(error);
  }
};
 
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.id
    });

    logger.info(`Task created by user ${req.user.email}: ${task.title}`);

    sendResponse(res, 201, { task }, 'Task created successfully');
  } catch (error) {
    logger.error('Create task error:', error);
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to update this task');
    }

    const { title, description, status, priority, dueDate } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email');

    logger.info(`Task updated: ${task.title}`);

    sendResponse(res, 200, { task }, 'Task updated successfully');
  } catch (error) {
    logger.error('Update task error:', error);
    next(error);
  }
};


const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to delete this task');
    }

    await task.deleteOne();

    logger.info(`Task deleted: ${task.title}`);

    sendResponse(res, 200, {}, 'Task deleted successfully');
  } catch (error) {
    logger.error('Delete task error:', error);
    next(error);
  }
};

const getTaskStats = async (req, res, next) => {
  try {
    const matchCondition = {};
    
    if (req.user.role !== 'admin') {
      matchCondition.user = req.user._id;
    }

    const stats = await Task.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      pending: 0,
      'in-progress': 0,
      completed: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    sendResponse(res, 200, { stats: formattedStats }, 'Task statistics retrieved successfully');
  } catch (error) {
    logger.error('Get task stats error:', error);
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
