require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/auth');
const storageRoutes = require('./routes/storage');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
const allowedOrigins = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost',
  'http://127.0.0.1',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://gigstm.onrender.com',
  'https://gigstm-api.onrender.com',
  process.env.PRODUCTION_DOMAIN,
  process.env.PRODUCTION_DOMAIN ? `https://www.${process.env.PRODUCTION_DOMAIN.replace('https://', '')}` : null
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com') || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/storage', storageRoutes);

// Serve static files from the GigsTm-V.2 directory
app.use(express.static(path.join(__dirname, '../GigsTm-V.2')));

// Serve index.html as the default page for any route not handled by the API or static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../GigsTm-V.2/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
