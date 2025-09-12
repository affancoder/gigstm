/**
 * Production CORS Test Script for GigsTm
 * 
 * This script tests CORS configuration with the production domain
 * to ensure it's properly set up for Hostinger deployment.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Get production domain from .env
const productionDomain = process.env.PRODUCTION_DOMAIN || 'https://yourdomain.com';

// CORS configuration with detailed logging
app.use((req, res, next) => {
  console.log('\n==== CORS Middleware ====');
  console.log(`Request from origin: ${req.headers.origin || 'No origin header'}`);
  console.log(`Request method: ${req.method}`);
  console.log(`Request path: ${req.path}`);
  
  // Check if origin is allowed
  const allowedOrigins = [
    'http://localhost:3001',
    productionDomain,
    productionDomain.startsWith('https://') ? 
      `https://www.${productionDomain.replace('https://', '')}` : 
      `https://www.${productionDomain}`
  ];
  
  const origin = req.headers.origin;
  const isAllowed = !origin || allowedOrigins.includes(origin);
  
  console.log(`Origin allowed: ${isAllowed ? 'Yes' : 'No'}`);
  console.log(`Allowed origins: ${JSON.stringify(allowedOrigins)}`);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', isAllowed ? origin : 'null');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  next();
});

// Test endpoint
app.get('/api/v1/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS test successful',
    origin: req.headers.origin || 'No origin header',
    productionDomain,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n====================================`);
  console.log(`Production CORS Test Server running on port ${PORT}`);
  console.log(`====================================`);
  console.log(`\nTest your frontend by accessing:`);
  console.log(`${productionDomain}/test-cors.html`);
  console.log(`\nThis server will respond to:`);
  console.log(`GET http://localhost:${PORT}/api/v1/cors-test`);
  console.log(`\nProduction domain set to: ${productionDomain}`);
  console.log(`====================================`);
});