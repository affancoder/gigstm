/**
 * CORS Test Script for GigsTm
 * 
 * This script sets up a minimal Express server with proper CORS configuration
 * to test if the CORS issue is related to the server configuration or other factors.
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// CORS configuration with detailed logging
app.use((req, res, next) => {
  console.log('\n==== CORS Middleware ====');
  console.log(`Request from origin: ${req.headers.origin || 'No origin header'}`);
  console.log(`Request method: ${req.method}`);
  console.log(`Request path: ${req.path}`);
  console.log('Request headers:', req.headers);
  
  // Allow all origins for testing
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    console.log('Responding with 200 OK and CORS headers');
    return res.status(200).end();
  }
  
  next();
});

// Test endpoint that returns sample user forms data
app.get('/api/v1/userforms', (req, res) => {
  console.log('GET /api/v1/userforms request received');
  
  // Sample data to return
  const sampleData = [
    {
      _id: '1',
      name: 'Test User 1',
      email: 'test1@example.com',
      phone: '123-456-7890',
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'Test User 2',
      email: 'test2@example.com',
      phone: '098-765-4321',
      createdAt: new Date()
    }
  ];
  
  console.log('Responding with sample data');
  console.log('Response headers:', res._headers);
  
  res.json(sampleData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n====================================`);
  console.log(`CORS Test Server running on port ${PORT}`);
  console.log(`====================================`);
  console.log(`\nTest your frontend by accessing:`);
  console.log(`http://localhost:3001/dashboard.html`);
  console.log(`\nThis server will respond to:`);
  console.log(`GET http://localhost:${PORT}/api/v1/userforms`);
  console.log(`\nAll CORS headers are enabled for testing purposes.`);
  console.log(`====================================`);
});

// Error handling
app.on('error', (error) => {
  console.error('Server error:', error);
});