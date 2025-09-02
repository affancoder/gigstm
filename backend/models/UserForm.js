const mongoose = require('mongoose');

const userFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
  },
  skills: {
    type: [String],
    required: [true, 'Please provide at least one skill'],
  },
  experience: {
    type: String,
    required: [true, 'Please provide your experience level'],
    enum: ['Beginner', 'Intermediate', 'Expert'],
  },
  location: {
    type: String,
    required: [true, 'Please provide your location'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserForm', userFormSchema);