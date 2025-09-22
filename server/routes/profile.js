const express = require('express');
const router = express.Router();
const { saveProfile, saveProfileWithUploads, getProfile, getAllProfiles, saveDraft, getDraft } = require('../controllers/profileController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { deleteProfile } = require('../controllers/deleteProfile');
const { auth } = require('../middleware/auth');

// GET /api/profile/all - Get all users' profiles (public endpoint)
router.get('/all', getAllProfiles);

// Protected routes (require authentication)
router.use(auth);

// GET /api/profile - Get user profile
router.get('/', getProfile);

// POST /api/profile - Save or update user profile (supports files)
router.post('/', upload.any(), saveProfileWithUploads);

// Draft endpoints
router.get('/draft', getDraft);
router.post('/draft', saveDraft);

// DELETE /api/profile/:id - Delete user profile (admin only)
router.delete('/:id', deleteProfile);

module.exports = router;
