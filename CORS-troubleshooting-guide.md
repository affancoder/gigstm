# CORS Troubleshooting Guide for GigsTm

## Understanding the CORS Error

You're experiencing a CORS (Cross-Origin Resource Sharing) error when your frontend at `http://localhost:3001` tries to access your backend API at `http://localhost:5000`. This is a security feature implemented by browsers to prevent unauthorized cross-origin requests.

## Current Issues

1. The preflight request from `localhost:3001` to `localhost:5000` is being blocked
2. No `Access-Control-Allow-Origin` header is present on the requested resource
3. MongoDB connection issues may be preventing the server from starting properly

## Step-by-Step Troubleshooting

### 1. Ensure MongoDB is Running

Before addressing CORS, make sure MongoDB is running:

```bash
# Check if MongoDB is installed
mongod --version

# Start MongoDB if it's not running
# On Windows, you may need to start it as a service or run it directly
```

If MongoDB is not installed, you'll need to [download and install MongoDB](https://www.mongodb.com/try/download/community).

### 2. Verify Backend Server Configuration

Ensure your backend server (app.js) has proper CORS configuration:

```javascript
// In app.js
app.use((req, res, next) => {
  // Log the request origin for debugging
  console.log('Request origin:', req.headers.origin);
  
  // Allow all origins for development
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  next();
});
```

### 3. Check Frontend Fetch Configuration

Ensure your frontend fetch requests include the correct CORS settings:

```javascript
const response = await fetch(apiUrl, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'cors',
  credentials: 'include'  // Important for cross-origin requests with credentials
});
```

### 4. Start Servers in the Correct Order

1. Start MongoDB first
2. Start the backend server (port 5000)
3. Start the frontend server (port 3001)

### 5. Test with Browser Developer Tools

1. Open your browser's developer tools (F12)
2. Go to the Network tab
3. Look for the request to `http://localhost:5000/api/v1/userforms`
4. Check the request headers and response headers
5. Look for CORS-related errors in the console

### 6. Use the Check-MongoDB Script

Run the provided `check-mongodb.js` script to verify your MongoDB connection:

```bash
node check-mongodb.js
```

### 7. Common CORS Solutions

- **For development only**: Install and use the [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino) browser extension
- Use a CORS proxy service for testing
- Ensure both servers are running on the same domain (but different ports) during development

## Additional Resources

- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [MongoDB Connection Troubleshooting](https://www.mongodb.com/docs/manual/reference/connection-string/)

## Next Steps

If you continue to experience issues after following these steps, please check the server logs for more detailed error messages and ensure all dependencies are correctly installed.

## Schema Validation Issues

If you're experiencing validation errors with the UserForm data, ensure your data matches the required schema:

```javascript
// UserForm Schema
{
  name: String,          // Required
  email: String,         // Required, valid email format
  phone: String,         // Required
  skills: [String],      // Required, array of strings
  experience: String,    // Required, one of: 'Beginner', 'Intermediate', 'Expert'
  location: String,      // Required
  createdAt: Date        // Default: current date
}
```

Common validation issues:
1. Sending `skills` as a string instead of an array
2. Using an invalid `experience` value (must be one of the enum values)
3. Missing required fields