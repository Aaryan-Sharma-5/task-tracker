const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createTaskValidation,
  updateTaskValidation
} = require('../validators/taskValidator');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getTasks);

router.get('/stats/summary', getTaskStats);

router.get('/:id', getTask);

router.post('/', createTaskValidation, validate, createTask);

router.put('/:id', updateTaskValidation, validate, updateTask);

router.delete('/:id', deleteTask);

module.exports = router;
