const express = require('express');
const router = express.Router();
// Import the UserForm model or use the existing one to prevent OverwriteModelError
const mongoose = require('mongoose');
let UserForm;

try {
  // Try to get the existing model first
  UserForm = mongoose.model('UserForm');
} catch (error) {
  // If model doesn't exist, import it from the models directory
  UserForm = require('../models/UserForm');
}

// Route to fetch all userforms
router.get('/api/v1/user-forms-all', async (req, res) => {
  try {
    const userForms = await UserForm.find();
    res.status(200).json(userForms);
  } catch (error) {
    console.error('Error fetching userforms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch all userforms with the endpoint used by dashboard.html
router.get('/api/v1/userforms', async (req, res) => {
  try {
    const userForms = await UserForm.find();
    res.status(200).json({ success: true, data: userForms });
  } catch (error) {
    console.error('Error fetching userforms:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
