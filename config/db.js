const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Connection options
    const options = {
      serverSelectionTimeoutMS: 10000,  // 10 seconds
      socketTimeoutMS: 45000,          // 45 seconds
      connectTimeoutMS: 10000,         // 10 seconds
      retryWrites: true,
      w: 'majority'
    };

    // Log masked connection string (hides password)
    const maskedUri = process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/(mongodb\+srv:\/\/[^:]+):[^@]+@/, '$1:*****@') : 
      'not set';
    console.log('📡 Connection String:', maskedUri);

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Connection events
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('❌ Mongoose disconnected from DB');
    });

    return conn.connection.getClient();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('\n🔍 Troubleshooting Steps:');
    console.error('1. Verify your MongoDB Atlas credentials');
    console.error('2. Check if your IP is whitelisted in MongoDB Atlas');
    console.error('3. Ensure your internet connection is stable');
    console.error('4. Verify the database name in the connection string');
    
    process.exit(1);
  }
};

module.exports = connectDB;
