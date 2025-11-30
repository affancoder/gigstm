const express = require('express');
const path = require('path');
const authRoutes = require('./authRoutes');

const router = express.Router();

// API Routes
router.use('/api/auth', authRoutes);

// API Test Route
router.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve static files from the root directory
router.use(express.static(path.join(__dirname, '..')));

// Redirect root URL to login page
router.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Handle 404 - Keep this as the last route
router.use((req, res) => {
  // If the request is for an API endpoint, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      status: 'error',
      message: 'API endpoint not found'
    });
  }
  
  // Otherwise, try to serve the requested HTML file
  const filePath = path.join(__dirname, '..', req.path.endsWith('.html') ? req.path : `${req.path}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      // If file not found, send 404 with a message
      res.status(404).send('Page not found');
    }
  });
});

module.exports = router;
