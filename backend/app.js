const express = require('express');
const router = express.Router();
const UserForm = require('../models/UserForm');

// @desc    Get all user forms
// @route   GET /api/v1/user-forms
// @access  Public
router.get('/api/v1/user-forms', async (req, res) => {
    try {
        const userForms = await UserForm.find();
        res.status(200).json(userForms);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create a new user form
// @route   POST /api/v1/user-forms
// @access  Public
router.post('/api/v1/user-forms', async (req, res) => {
    try {
        const newUserForm = new UserForm(req.body);
        await newUserForm.save();
        res.status(201).json(newUserForm);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

module.exports = router;