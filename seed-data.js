/**
 * Seed script to populate the MongoDB database with sample user form data
 * 
 * This script will:
 * 1. Connect to MongoDB
 * 2. Create the UserForm model if it doesn't exist
 * 3. Clear existing data in the userforms collection
 * 4. Insert sample user form data
 */

const mongoose = require('mongoose');
let UserForm;

// Try to import the UserForm model, or create it if it doesn't exist
try {
  UserForm = require('./UserForm');
  console.log('Successfully imported UserForm model');
} catch (error) {
  console.log('UserForm model not found, creating it now...');
  
  // Define the UserForm schema
  const userFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    skills: { type: [String], default: [] },
    experience: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  
  // Create the model
  UserForm = mongoose.model('UserForm', userFormSchema);
  console.log('UserForm model created');
}

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/gigstm';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Sample user form data
const sampleUserForms = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: '5 years',
    location: 'New York',
    createdAt: new Date()
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    skills: ['Python', 'Django', 'AWS'],
    experience: '3 years',
    location: 'San Francisco',
    createdAt: new Date()
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '555-123-4567',
    skills: ['Java', 'Spring', 'Hibernate'],
    experience: '7 years',
    location: 'Chicago',
    createdAt: new Date()
  },
  {
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    phone: '444-555-6666',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
    experience: '4 years',
    location: 'Seattle',
    createdAt: new Date()
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    phone: '777-888-9999',
    skills: ['DevOps', 'Docker', 'Kubernetes'],
    experience: '6 years',
    location: 'Austin',
    createdAt: new Date()
  }
];

console.log(`${colors.cyan}=== MongoDB Seed Data Script ===${colors.reset}`);
console.log(`${colors.yellow}Attempting to connect to MongoDB at ${MONGODB_URI}${colors.reset}`);

// Connect to MongoDB with improved error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
  connectTimeoutMS: 10000 // 10 seconds connection timeout
})
.then(async () => {
  console.log(`${colors.green}Connected to MongoDB successfully!${colors.reset}`);
  
  try {
    // Get the collection name from the model
    const collectionName = UserForm.collection.name;
    console.log(`${colors.blue}Using collection: ${collectionName}${colors.reset}`);
    
    // Clear existing data
    const deleteResult = await UserForm.deleteMany({});
    console.log(`${colors.yellow}Cleared ${deleteResult.deletedCount || 0} existing user forms${colors.reset}`);
    
    // Insert new data
    const result = await UserForm.insertMany(sampleUserForms);
    console.log(`${colors.green}Successfully added ${result.length} sample user forms${colors.reset}`);
    
    // Verify the data was inserted
    const count = await UserForm.countDocuments();
    console.log(`${colors.blue}Total documents in collection: ${count}${colors.reset}`);
    
    // Show a sample document
    if (count > 0) {
      const sample = await UserForm.findOne();
      console.log(`${colors.cyan}Sample document:${colors.reset}`);
      console.log(JSON.stringify(sample.toObject(), null, 2));
    }
    
    console.log(`${colors.green}Database seeding completed successfully!${colors.reset}`);
    console.log(`${colors.magenta}Next steps:${colors.reset}`);
    console.log(`${colors.cyan}1. Start the backend server: ${colors.reset}node app.js`);
    console.log(`${colors.cyan}2. Start the frontend server: ${colors.reset}node server.js`);
    console.log(`${colors.cyan}3. Open dashboard.html in your browser${colors.reset}`);
    
    // Close the connection
    mongoose.connection.close();
    console.log(`${colors.blue}Database connection closed${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error seeding data: ${error.message}${colors.reset}`);
    console.error(error);
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.log(`${colors.yellow}Duplicate key error. Some records may already exist.${colors.reset}`);
    } else if (error.name === 'ValidationError') {
      console.log(`${colors.yellow}Validation error. Check your data schema.${colors.reset}`);
    }
    
    mongoose.connection.close();
  }
})
.catch(error => {
  console.error(`${colors.red}MongoDB connection error: ${error.message}${colors.reset}`);
  
  // Provide helpful troubleshooting information
  if (error.name === 'MongoServerSelectionError') {
    console.log(`\n${colors.yellow}TROUBLESHOOTING:${colors.reset}`);
    console.log(`${colors.cyan}1. Make sure MongoDB is installed and running:${colors.reset}`);
    console.log(`   - Windows: Start MongoDB service or run mongod.exe`);
    console.log(`   - macOS/Linux: sudo service mongod start or mongod`);
    console.log(`${colors.cyan}2. Check if MongoDB is running on the default port (27017)${colors.reset}`);
    console.log(`${colors.cyan}3. If using a different connection string, update it in this script${colors.reset}`);
  }
});