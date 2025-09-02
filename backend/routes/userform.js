const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Enable mongoose debugging
mongoose.set('debug', true);

// Schema matching your form structure
const userFormSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    profile: {
        personalInfo: {
            name: String,
            email: String,
            mobile: String,
            gender: String,
            dob: Date,
            jobRole: String
        },
        documents: {
            aadhaar: String,
            pan: String
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: String
        }
    },
    isActive: Boolean,
    createdAt: { type: Date, default: Date.now }
}, { 
    collection: 'userforms',  // specify exact collection name
    strict: false 
});

// Check if model already exists to prevent OverwriteModelError
const UserForm = mongoose.models.UserForm || mongoose.model('UserForm', userFormSchema);

// GET endpoint with detailed error logging
router.get('/api/v1/userforms', async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            console.error('MongoDB not connected. Current state:', mongoose.connection.readyState);
            throw new Error('Database connection not available');
        }

        // List collections to verify userforms exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        // Fetch all documents
        const userForms = await UserForm.find({});
        console.log(`Found ${userForms.length} documents in userforms collection`);

        res.json({
            success: true,
            data: userForms
        });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({
            success: false,
            message: `Database error: ${error.message}`,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
