const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadFile } = require('../controllers/storageController');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   POST /api/storage/upload
// @desc    Upload a file to Supabase Storage
// @access  Private
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;
