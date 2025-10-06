const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const allowedOrigins = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost',
  'http://127.0.0.1',
  'https://gigstm.onrender.com',
  'https://gigstm-api.onrender.com'
];

// Simple CORS middleware for development
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Always log the origin for debugging
  console.log('Request origin:', origin);
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For development, allow any origin if not in the allowed list
    // Comment this out in production
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    console.log('Warning: Allowing request from non-whitelisted origin:', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  next();
});

// Also keep the cors middleware as a fallback
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin
    if (!origin) {
      console.log('Request with no origin');
      return callback(null, true);
    }
    
    console.log('CORS middleware checking origin:', origin);
    
    // For development, allow all origins
    // Comment this out in production and use the below code instead
    return callback(null, true);
    
    /* Production code:
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
    */
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin']
}));

// All API routes have been removed.

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
