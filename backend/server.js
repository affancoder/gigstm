const express = require('express');
const app = express();

// Import and mount the admin routes
const adminRoutes = require('./routes/admin');
app.use(adminRoutes);

// ...existing code for your server (e.g., middleware, other routes, error handling, etc.)

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});