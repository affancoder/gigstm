require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Configure CORS
const allowedOrigins = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost',
  'http://127.0.0.1',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://gigstm.onrender.com', // Add your Render frontend URL here
  'https://gigstm-api.onrender.com', // Add your Render backend URL here
  process.env.PRODUCTION_DOMAIN, // Hostinger domain from environment variables
  process.env.PRODUCTION_DOMAIN ? `https://www.${process.env.PRODUCTION_DOMAIN.replace('https://', '')}` : null // www subdomain
].filter(Boolean); // Remove null values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list or is a subdomain of your Render app
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') // Allow all Render deployments
      // process.env.NODE_ENV === 'development' // Allow all in development
    ) {
      return callback(null, true);
    }
    
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Content-Length', 
    'Accept',
    'X-Access-Token',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: [
    'Set-Cookie',
    'Access-Control-Allow-Credentials'
  ],
  maxAge: 3600, // 1 hour
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add Supabase client to request object
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Admin dashboard route
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../GigsTm-V.2/admin-dashboard.html'));
});

// Serve index.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../GigsTm-V.2/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Not Found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend available at: /`);
  console.log(`🔐 API endpoints available at: /api/auth`);
});
