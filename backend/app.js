const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRoute = require('./routes/users');
const userFormRoutes = require('./routes/userform');
const userFormsRoutes = require('./routes/userforms'); // Import the userforms routes

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

// Routes
app.use('/api/v1/user-forms', usersRoute);
app.use(userFormRoutes);
app.use(userFormsRoutes); // Mount the userforms routes

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/gigstm', {
        serverSelectionTimeoutMS: 5000, // 5 second timeout for server selection
        connectTimeoutMS: 10000 // 10 second timeout for initial connection
    })
    .then(() => {
        console.log('MongoDB connected successfully on app.js server');
        // Check if db property exists before trying to list collections
        if (mongoose.connection.db) {
            // Log available collections to help with debugging
            mongoose.connection.db.listCollections().toArray()
                .then(collections => {
                    console.log('Available collections:', collections.map(c => c.name));
                    
                    // Check if userforms collection exists
                    const userformsCollection = collections.find(c => c.name === 'userforms');
                    if (!userformsCollection) {
                        console.warn('Warning: userforms collection does not exist in the database.');
                        console.log('Please run the seed-data.js script to populate the database with sample data.');
                    } else {
                        console.log('userforms collection found in the database.');
                    }
                })
                .catch(err => {
                    console.log('Error listing collections:', err);
                });
        } else {
            console.warn('Warning: mongoose.connection.db is undefined. Cannot list collections.');
        }
    })
    .catch((error) => {
        console.error('MongoDB connection error in app.js:', error);
        console.log('Please make sure MongoDB is running on your system');
        console.log('Troubleshooting tips:');
        console.log('1. Install MongoDB if not already installed');
        console.log('2. Start MongoDB service');
        console.log('3. Check if MongoDB is running on the default port (27017)');
        console.log('4. Run the check-mongodb.js script to diagnose connection issues');
    });

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});