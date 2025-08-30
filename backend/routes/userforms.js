const express = require('express');
const router = express.Router();
const UserForm = require('../models/UserForm'); // Adjust the path to your UserForm model

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

module.exports = router;
