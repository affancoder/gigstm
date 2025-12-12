const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Auth Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/check-auth', authController.isLoggedIn);
router.get('/logout', authController.logout);
router.post("/change-password",protect, authController.changePassword);

module.exports = router;
