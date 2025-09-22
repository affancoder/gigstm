const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
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
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Also keep the cors middleware as a fallback
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Import and mount routes
const adminRoutes = require('./routes/admin');
const userFormRoutes = require('./routes/userform');
const userFormsRoutes = require('./routes/userforms');

app.use('/api', adminRoutes);
app.use('/api', userFormRoutes);
app.use('/api', userFormsRoutes);

// Connect to MongoDB
mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost:27017/gigstm', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 second timeout for server selection
    connectTimeoutMS: 10000, // 10 seconds for initial connection
  })
  .then(() => {
    console.log('MongoDB connected successfully on server.js server');
    
    // Check if UserForm collection exists and create it if it doesn't
    mongoose.connection.db.listCollections({name: 'userforms'}).toArray(function(err, collections) {
      if (err) {
        console.log('Error checking collections:', err);
        return;
      }
      
      console.log('Available collections:', collections.map(c => c.name));
      
      if (collections.length === 0) {
        console.log('UserForm collection does not exist. Please run the seed-data.js script to create sample data.');
      } else {
        // Count documents in the collection
        const UserForm = require('./models/UserForm');
        UserForm.countDocuments()
          .then(count => {
            console.log(`Found ${count} documents in UserForm collection`);
            if (count === 0) {
              console.log('UserForm collection exists but is empty. Please run the seed-data.js script to create sample data.');
            }
          })
          .catch(err => console.error('Error counting documents:', err));
      }
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error in server.js:', error);
    console.log('Please make sure MongoDB is running on your system');
  });

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});