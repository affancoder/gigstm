# MongoDB Setup Guide

## Installing MongoDB on Windows

### Method 1: Using the MongoDB Installer

1. **Download the MongoDB Community Server**
   - Visit the [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select the latest version
   - Choose "Windows" as the platform
   - Select "msi" as the package
   - Click Download

2. **Run the Installer**
   - Double-click the downloaded .msi file
   - Follow the installation wizard
   - Choose "Complete" setup type
   - Install MongoDB as a service (recommended)
   - Install MongoDB Compass if you want a GUI tool (optional)

3. **Verify Installation**
   - Open Command Prompt
   - Run `mongod --version` to verify MongoDB is installed
   - Check that the MongoDB service is running in Windows Services

### Method 2: Using MongoDB Atlas (Cloud Option)

If you prefer not to install MongoDB locally, you can use MongoDB Atlas, a cloud-based MongoDB service:

1. **Create a MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a Cluster**
   - Create a new cluster (the free tier is sufficient for development)
   - Choose a cloud provider and region

3. **Configure Network Access**
   - Add your IP address to the IP Access List
   - Or set it to allow access from anywhere (for development only)

4. **Create a Database User**
   - Create a username and password for database access

5. **Get Your Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password

6. **Update Your Application**
   - Replace the local MongoDB connection string in your application with the Atlas connection string

## Starting MongoDB

### Windows

**If installed as a service:**
- MongoDB should start automatically when your computer starts
- You can manually start/stop it from Windows Services

**If not installed as a service:**
- Create a data directory: `md C:\data\db`
- Start MongoDB server: `mongod --dbpath="C:\data\db"`

### Verifying MongoDB is Running

1. **Check the Service**
   - Open Services (services.msc)
   - Look for "MongoDB" and check if it's running

2. **Check via Command Line**
   - Open Command Prompt
   - Run `mongo` to connect to the MongoDB shell
   - If it connects, MongoDB is running

3. **Check the Default Port**
   - Run `netstat -ano | findstr 27017`
   - If MongoDB is running, you should see a process listening on port 27017

## Troubleshooting MongoDB Connection Issues

### Common Issues

1. **Service Not Running**
   - Start the MongoDB service from Windows Services
   - Or run `mongod` manually

2. **Data Directory Issues**
   - Ensure the data directory exists (`C:\data\db` by default)
   - Check permissions on the data directory

3. **Port Conflicts**
   - Check if another process is using port 27017
   - Use `netstat -ano | findstr 27017` to check

4. **Firewall Blocking**
   - Add MongoDB to your firewall exceptions
   - Allow inbound connections on port 27017

### Using the MongoDB Diagnostic Script

Run the provided diagnostic script to check your MongoDB connection:

```
node check-mongodb.js
```

This script will help identify any connection issues and provide troubleshooting guidance.

## Populating the Database

After ensuring MongoDB is running, populate it with sample data:

```
node seed-data.js
```

This will create the necessary collections and add sample user form data.

## MongoDB Compass (GUI Tool)

MongoDB Compass is a graphical user interface for MongoDB that makes it easy to explore and manipulate your data:

1. **Download MongoDB Compass**
   - Visit [MongoDB Compass Download](https://www.mongodb.com/try/download/compass)
   - Download the appropriate version for your system

2. **Connect to Your Database**
   - Open MongoDB Compass
   - Enter the connection string: `mongodb://localhost:27017`
   - Click Connect

3. **Explore Your Data**
   - Browse databases and collections
   - View, edit, and query documents
   - Analyze data with visual tools

## Next Steps

After setting up MongoDB:

1. Start the backend server: `node app.js`
2. Start the frontend server: `node server.js`
3. Open dashboard.html in your browser
4. Check the browser console for any errors