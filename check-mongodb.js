/**
 * MongoDB Connection Checker
 * 
 * This script checks if MongoDB is running, verifies database connection,
 * and inspects the userforms collection.
 */

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// MongoDB connection string - update this if your connection string is different
const MONGODB_URI = 'mongodb://localhost:27017/gigstm';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Print a formatted message with color
 */
function printMessage(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Print a section header
 */
function printHeader(title) {
  console.log('\n' + colors.cyan + '='.repeat(80) + colors.reset);
  console.log(colors.cyan + ' ' + title + colors.reset);
  console.log(colors.cyan + '='.repeat(80) + colors.reset);
}

/**
 * Check if MongoDB is running using mongoose
 */
async function checkMongoDBConnection() {
  printHeader('CHECKING MONGODB CONNECTION');
  
  try {
    printMessage('Attempting to connect to MongoDB...', colors.yellow);
    printMessage(`Connection URI: ${MONGODB_URI}`, colors.blue);
    
    // Set connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      connectTimeoutMS: 10000 // 10 seconds connection timeout
    };
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, options);
    
    printMessage('✓ Successfully connected to MongoDB!', colors.green);
    return true;
  } catch (error) {
    printMessage('✗ Failed to connect to MongoDB', colors.red);
    printMessage(`Error: ${error.message}`, colors.red);
    
    // Provide troubleshooting guidance based on error message
    if (error.message.includes('ECONNREFUSED')) {
      printMessage('\nTROUBLESHOOTING:', colors.yellow);
      printMessage('1. MongoDB server is not running. Start it with:', colors.yellow);
      printMessage('   - Windows: Start MongoDB service or run mongod.exe', colors.white);
      printMessage('   - macOS/Linux: sudo service mongod start or mongod', colors.white);
      printMessage('2. Check if MongoDB is installed correctly', colors.yellow);
      printMessage('3. Verify MongoDB is running on the default port (27017)', colors.yellow);
    } else if (error.message.includes('Authentication failed')) {
      printMessage('\nTROUBLESHOOTING:', colors.yellow);
      printMessage('1. Check username and password in connection string', colors.yellow);
      printMessage('2. Verify authentication database is correct', colors.yellow);
    } else if (error.message.includes('ServerSelectionTimeoutError')) {
      printMessage('\nTROUBLESHOOTING:', colors.yellow);
      printMessage('1. MongoDB server might be running but not responding', colors.yellow);
      printMessage('2. Check if MongoDB is running on the correct port', colors.yellow);
      printMessage('3. Verify network connectivity to MongoDB server', colors.yellow);
    }
    
    return false;
  }
}

/**
 * Check database collections
 */
async function checkDatabaseCollections() {
  printHeader('CHECKING DATABASE COLLECTIONS');
  
  try {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    printMessage('Connected to MongoDB using MongoClient', colors.green);
    
    // Get database name from connection string
    const dbName = MONGODB_URI.split('/').pop().split('?')[0];
    const db = client.db(dbName);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    printMessage(`Found ${collections.length} collections in database '${dbName}':`, colors.blue);
    
    if (collections.length === 0) {
      printMessage('No collections found in the database!', colors.yellow);
      printMessage('\nTROUBLESHOOTING:', colors.yellow);
      printMessage('1. Database exists but is empty', colors.yellow);
      printMessage('2. Run seed-data.js to populate the database', colors.yellow);
    } else {
      collections.forEach((collection, index) => {
        printMessage(`${index + 1}. ${collection.name}`, colors.white);
      });
      
      // Check if userforms collection exists
      const userformsExists = collections.some(col => 
        col.name === 'userforms' || col.name === 'user-forms' || col.name === 'userForm' || col.name === 'userForms');
      
      if (userformsExists) {
        printMessage('✓ Found userforms collection!', colors.green);
        
        // Check for possible collection names
        const possibleCollectionNames = ['userforms', 'user-forms', 'userForm', 'userForms'];
        
        for (const collName of possibleCollectionNames) {
          try {
            const count = await db.collection(collName).countDocuments();
            if (count > 0) {
              printMessage(`✓ Collection '${collName}' contains ${count} documents`, colors.green);
              
              // Show sample document
              const sampleDoc = await db.collection(collName).findOne();
              printMessage('Sample document:', colors.blue);
              console.log(JSON.stringify(sampleDoc, null, 2));
              break;
            } else if (count === 0) {
              printMessage(`Collection '${collName}' exists but is empty (0 documents)`, colors.yellow);
              printMessage('Run seed-data.js to populate the collection', colors.yellow);
            }
          } catch (err) {
            // Collection doesn't exist or other error
          }
        }
      } else {
        printMessage('✗ Could not find userforms collection!', colors.red);
        printMessage('\nTROUBLESHOOTING:', colors.yellow);
        printMessage('1. Collection might be named differently', colors.yellow);
        printMessage('2. Run seed-data.js to create and populate the collection', colors.yellow);
      }
    }
    
    await client.close();
  } catch (error) {
    printMessage(`Error checking collections: ${error.message}`, colors.red);
  }
}

/**
 * Check API endpoints
 */
async function checkAPIEndpoints() {
  printHeader('CHECKING API ENDPOINTS');
  
  const endpoints = [
    { url: 'http://localhost:5000/api/v1/userforms', name: 'Primary userforms endpoint' },
    { url: 'http://localhost:5000/api/v1/user-forms', name: 'Alternative user-forms endpoint' },
    { url: 'http://localhost:5000/api/v1/user-forms-all', name: 'All user forms endpoint' }
  ];
  
  printMessage('Testing API endpoints...', colors.yellow);
  
  for (const endpoint of endpoints) {
    try {
      printMessage(`Testing: ${endpoint.name} (${endpoint.url})`, colors.blue);
      
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (response.ok) {
        const data = await response.json();
        printMessage(`✓ Endpoint ${endpoint.url} is working!`, colors.green);
        printMessage(`Response status: ${response.status}`, colors.green);
        printMessage(`Data received: ${JSON.stringify(data).substring(0, 100)}...`, colors.white);
      } else {
        printMessage(`✗ Endpoint ${endpoint.url} returned status ${response.status}`, colors.red);
        const text = await response.text();
        printMessage(`Response: ${text.substring(0, 100)}...`, colors.red);
      }
    } catch (error) {
      printMessage(`✗ Failed to connect to ${endpoint.url}`, colors.red);
      printMessage(`Error: ${error.message}`, colors.red);
    }
    
    console.log(); // Add spacing between endpoint tests
  }
}

/**
 * Main function to run all checks
 */
async function runDiagnostics() {
  printHeader('MONGODB CONNECTION DIAGNOSTICS');
  printMessage('Starting diagnostics...', colors.magenta);
  
  const isConnected = await checkMongoDBConnection();
  
  if (isConnected) {
    await checkDatabaseCollections();
    await checkAPIEndpoints();
    
    printHeader('DIAGNOSTICS SUMMARY');
    printMessage('MongoDB connection: SUCCESS', colors.green);
    printMessage('\nNext steps:', colors.blue);
    printMessage('1. Start both backend servers:', colors.white);
    printMessage('   - node app.js (port 5000)', colors.white);
    printMessage('   - node server.js (port 3001)', colors.white);
    printMessage('2. Open dashboard.html in your browser', colors.white);
    printMessage('3. Check browser console for any remaining errors', colors.white);
  } else {
    printHeader('DIAGNOSTICS SUMMARY');
    printMessage('MongoDB connection: FAILED', colors.red);
    printMessage('\nPlease fix MongoDB connection issues before proceeding.', colors.yellow);
  }
}

// Run the diagnostics
runDiagnostics().catch(error => {
  printMessage(`Unhandled error in diagnostics: ${error.message}`, colors.red);
  process.exit(1);
});