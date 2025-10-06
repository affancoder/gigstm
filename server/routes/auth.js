const express = require('express');
const router = express.Router();
const { signup, signin, signout, verify } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/signin
// @desc    Authenticate user and set cookie
// @access  Public
router.post('/signin', signin);

// @route   POST /api/auth/signout
// @desc    Sign out user by clearing cookie
// @access  Public
router.post('/signout', signout);

// @route   GET /api/auth/verify
// @desc    Verify user session via cookie
// @access  Private
router.get('/verify', authMiddleware, verify);

module.exports = router;
