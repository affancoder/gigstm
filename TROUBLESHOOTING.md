# GigsTm Troubleshooting Guide

## Common Issues and Solutions

### "Failed to fetch" Error in Dashboard

If you're seeing a "Failed to fetch" error when trying to load the dashboard, follow these troubleshooting steps:

#### 1. Verify MongoDB is Running

**Windows:**
- Check if MongoDB service is running:
  - Open Services (services.msc)
  - Look for "MongoDB" service and ensure it's running
  - If not, start it manually
- Alternatively, run MongoDB manually:
  ```
  mongod --dbpath="C:\data\db"
  ```

**macOS/Linux:**
- Check MongoDB status:
  ```
  sudo service mongod status
  ```
- Start MongoDB if not running:
  ```
  sudo service mongod start
  ```

#### 2. Run the MongoDB Diagnostics Script

We've created a diagnostic script to help identify MongoDB connection issues:

```
node check-mongodb.js
```

This script will:
- Test the MongoDB connection
- Check if the userforms collection exists
- Verify if there's data in the collection
- Test API endpoints

#### 3. Seed the Database

If the database is empty or the userforms collection doesn't exist, run the seed script:

```
node seed-data.js
```

This will create sample user form data in the database.

#### 4. Verify Both Servers are Running

The application requires two servers to be running:

1. **Backend API Server (Port 5000)**
   ```
   node app.js
   ```

2. **Frontend Server (Port 3001)**
   ```
   node server.js
   ```

Make sure both servers are running in separate terminal windows.

#### 5. Check CORS Configuration

If you're still experiencing CORS issues:

1. Verify that `app.js` has the correct CORS configuration:
   - Allowed origins should include `http://localhost:3001`
   - Proper headers should be set
   - Preflight requests (OPTIONS) should be handled

2. Verify that the fetch request in `dashboard.html` has the correct configuration:
   - `mode: 'cors'`
   - `credentials: 'same-origin'`
   - Proper headers

#### 6. Check Browser Console for Specific Errors

Open your browser's developer tools (F12) and check the console for specific error messages:

- **CORS errors**: Indicate issues with cross-origin resource sharing
- **Network errors**: Could indicate server connectivity issues
- **MongoDB errors**: May appear in the server console

#### 7. Verify API Endpoints

Test the API endpoints directly in your browser or using a tool like Postman:

- `http://localhost:5000/api/v1/userforms`
- `http://localhost:5000/api/v1/user-forms`
- `http://localhost:5000/api/v1/user-forms-all`

#### 8. Check Server Logs

Examine the console output from both servers for error messages:

- MongoDB connection errors
- API route errors
- CORS configuration issues

## Advanced Troubleshooting

### MongoDB Connection Issues

If you're having trouble connecting to MongoDB:

1. **Check Connection String**
   - Default: `mongodb://localhost:27017/gigstm`
   - Verify the database name is correct

2. **MongoDB Authentication**
   - If your MongoDB requires authentication, update the connection string:
   ```
   mongodb://username:password@localhost:27017/gigstm
   ```

3. **MongoDB Port**
   - Verify MongoDB is running on the default port (27017)
   - If using a different port, update the connection string

### API Endpoint Issues

If the API endpoints aren't working:

1. **Check Route Definitions**
   - Verify routes are correctly defined in `userforms.js`
   - Ensure the route paths match what the frontend is requesting

2. **Model Issues**
   - Verify the `UserForm` model is correctly defined
   - Check for any validation errors

3. **Database Collection Name**
   - The collection name might be different from what's expected
   - Check the actual collection name in MongoDB

### Frontend Issues

If the frontend isn't displaying data correctly:

1. **Fetch Request Configuration**
   - Verify the API URL is correct
   - Check headers and credentials settings

2. **Data Rendering**
   - Verify the data structure matches what the frontend expects
   - Check for any JavaScript errors in the console

## Need More Help?

If you're still experiencing issues after following these steps, please:

1. Gather all error messages from the browser console and server logs
2. Take screenshots of any error messages
3. Document the steps you've taken to troubleshoot
4. Contact the development team with this information