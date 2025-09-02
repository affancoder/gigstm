const mongoose = require('mongoose');

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function for colored console output
function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if UserForm model exists, if not create it
let UserForm;
try {
  // Try to get the existing model first
  UserForm = mongoose.model('UserForm');
  colorLog('yellow', '✓ Using existing UserForm model');
} catch (error) {
  // If model doesn't exist, create it
  colorLog('yellow', '⚠ UserForm model not found, creating it now...');
  
  // Define the schema
  const userFormSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: String,
    location: String,
    createdAt: { type: Date, default: Date.now }
  }, { 
    collection: 'userforms',  // specify exact collection name
    strict: false 
  });

  // Create the model
  UserForm = mongoose.model('UserForm', userFormSchema);
  colorLog('green', '✓ UserForm model created successfully');
}

// Sample user form data
const sampleUserForms = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 'Expert',
    location: 'New York, USA'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    skills: ['Python', 'Django', 'SQL'],
    experience: 'Intermediate',
    location: 'San Francisco, USA'
  },
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1122334455',
    skills: ['Java', 'Spring', 'Hibernate'],
    experience: 'Expert',
    location: 'Chicago, USA'
  },
  {
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '+1555666777',
    skills: ['PHP', 'Laravel', 'MySQL'],
    experience: 'Beginner',
    location: 'Austin, USA'
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1777888999',
    skills: ['C#', '.NET', 'Azure'],
    experience: 'Intermediate',
    location: 'Seattle, USA'
  }
];

// Connect to MongoDB
colorLog('cyan', '🔄 Connecting to MongoDB...');
mongoose.connect('mongodb://localhost:27017/gigstm', {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
})
.then(async () => {
  colorLog('green', '✅ Connected to MongoDB successfully!');
  
  try {
    // Clear existing data
    colorLog('yellow', '🗑️  Clearing existing user forms...');
    await UserForm.deleteMany({});
    colorLog('green', '✅ Existing user forms cleared successfully!');
    
    // Insert sample data
    colorLog('yellow', '📝 Inserting sample user forms...');
    const result = await UserForm.insertMany(sampleUserForms);
    colorLog('green', `✅ Added ${result.length} sample user forms successfully!`);
    
    // Verify data was inserted
    const count = await UserForm.countDocuments();
    colorLog('cyan', `ℹ️  Total user forms in database: ${count}`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    colorLog('cyan', `ℹ️  Available collections: ${collections.map(c => c.name).join(', ')}`);
    
    colorLog('green', '\n🎉 Database seeding completed successfully!\n');
    colorLog('cyan', 'You can now run the app.js server and access the API endpoints:');
    colorLog('yellow', '- http://localhost:5000/api/v1/userforms');
    colorLog('yellow', '- http://localhost:5000/api/v1/user-forms-all');
    
    // Close the connection
    await mongoose.connection.close();
    colorLog('cyan', '👋 MongoDB connection closed.');
    
    process.exit(0);
  } catch (error) {
    colorLog('red', `❌ Error seeding database: ${error.message}`);
    console.error(error);
    
    // Close the connection
    await mongoose.connection.close();
    colorLog('cyan', '👋 MongoDB connection closed due to error.');
    
    process.exit(1);
  }
})
.catch(error => {
  colorLog('red', `❌ MongoDB connection error: ${error.message}`);
  console.error(error);
  
  colorLog('yellow', '\n⚠️  Troubleshooting tips:');
  colorLog('cyan', '1. Make sure MongoDB is installed on your system');
  colorLog('cyan', '2. Ensure MongoDB service is running');
  colorLog('cyan', '3. Check if MongoDB is running on the default port (27017)');
  colorLog('cyan', '4. Verify there are no firewall issues blocking the connection');
  colorLog('cyan', '5. Check if the database name is correct');
  
  process.exit(1);
});