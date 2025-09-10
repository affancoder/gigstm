/**
 * MongoDB Connection Verification Script
 * 
 * This script tests the MongoDB connection using the connection string
 * from the .env file. Run this before deployment to verify database access.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔌 Testing connection to MongoDB...');
    console.log('Connection string used:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':***@')); // Hide password
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    // List collections to verify access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('Connection string used:', process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/:[^:]*@/, ':***@') : 'Not defined');
    process.exit(1);
  }
};

// Run the test
connectDB();