const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { saveProfileData } = require('../controllers/profileController');

// @route   POST /api/profile
// @desc    Save or update user profile data
// @access  Private
router.post('/', authMiddleware, saveProfileData);

module.exports = router;