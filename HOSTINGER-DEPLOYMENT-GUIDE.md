# GigsTm Hostinger Deployment Guide

This guide provides step-by-step instructions for deploying the GigsTm application to Hostinger.

## Prerequisites

- A Hostinger account with a hosting plan
- Domain name configured with Hostinger
- Node.js hosting support (Hostinger Premium or Business plan)
- MongoDB Atlas account (for database hosting)

## Step 1: Prepare Your Project

### 1.1 Create a Production .env File

Create a `.env` file in the root of your project with the following variables:

```
NODE_ENV=production
PORT=3001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

Replace the placeholder values with your actual production values.

### 1.2 Update CORS Configuration

Modify the `server/server.js` file to include your Hostinger domain in the allowed origins:

```javascript
const allowedOrigins = [
  // ... existing origins
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];
```

### 1.3 Prepare Package.json

Ensure your main package.json has the correct start script:

```json
{
  "scripts": {
    "start": "node server/server.js"
  }
}
```

## Step 2: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account if you don't have one
2. Create a new cluster
3. Set up database access (create a user with password)
4. Set up network access (allow access from anywhere for now)
5. Get your connection string and add it to your .env file

## Step 3: Deploy to Hostinger

### 3.1 Upload Your Files

1. Log in to your Hostinger account
2. Go to File Manager or use FTP (FileZilla) to upload files
3. Upload all project files to the public_html directory

### 3.2 Install Dependencies

1. Connect to your hosting via SSH (if available on your plan)
2. Navigate to your project directory
3. Run `npm install --production` to install dependencies

### 3.3 Configure Node.js Application

1. In Hostinger control panel, go to the "Website" section
2. Find and click on "Node.js" or "Node.js App" option
3. Set up a new Node.js application with the following settings:
   - Application URL: your domain name
   - Application root directory: public_html (or where you uploaded files)
   - Application startup file: server/server.js
   - Node.js version: Select the latest stable version
   - NPM dependencies: Leave as is (you've already installed them)

### 3.4 Set Environment Variables

In the Hostinger Node.js application settings:

1. Find the "Environment Variables" section
2. Add all the variables from your .env file

## Step 4: Configure Domain and SSL

1. Make sure your domain is pointing to Hostinger nameservers
2. Enable SSL certificate for your domain through Hostinger control panel
3. Force HTTPS redirection for security

## Step 5: Test Your Deployment

1. Visit your domain in a web browser
2. Test all functionality including:
   - User registration/login
   - Profile creation and management
   - Admin dashboard access

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Check the Network tab in browser DevTools to identify the specific CORS error
2. Verify that your domain is correctly added to the allowedOrigins array
3. Ensure your frontend is making requests to the correct backend URL

### Database Connection Issues

If the application can't connect to MongoDB:

1. Verify your MongoDB Atlas connection string in the environment variables
2. Check that your IP whitelist in MongoDB Atlas includes your Hostinger server IP
3. Ensure your MongoDB user has the correct permissions

### Node.js Application Not Starting

If your application fails to start:

1. Check Hostinger error logs in the control panel
2. Verify that all dependencies are correctly installed
3. Ensure your start script is correctly configured

## Additional Resources

- [Hostinger Node.js Hosting Documentation](https://www.hostinger.com/tutorials/how-to-host-node-js-application)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Deployment Guide](https://expressjs.com/en/advanced/best-practice-performance.html)