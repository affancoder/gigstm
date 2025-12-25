const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logout
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/change-password', protect, changePassword);
router.get('/logout', logout);

module.exports = router;