const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Auth Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/check-auth', authController.isLoggedIn);
router.get('/logout', authController.logout);

module.exports = router;
