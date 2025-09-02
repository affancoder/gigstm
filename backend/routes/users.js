const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/gigstm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User schema for the userform collection
const UserSchema = new mongoose.Schema({}, { 
    collection: 'userforms',  // specify the collection name
    strict: false  // allow flexible schema
});

const User = mongoose.model('UserForm', UserSchema);

// Route to get all users
router.get('/api/v1/userforms', async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
