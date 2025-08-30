const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path to your User model

// Route to fetch all users with pagination and search
router.get('/api/v1/admin/users', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        // Build a search query
        const query = search
            ? { $or: [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
            : {};

        // Fetch users with pagination
        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
