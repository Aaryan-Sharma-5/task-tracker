const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  updatePasswordValidation
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidation, validate, register);

router.post('/login', loginValidation, validate, login);

router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfileValidation, validate, updateProfile);

router.put('/password', protect, updatePasswordValidation, validate, updatePassword);

module.exports = router;
