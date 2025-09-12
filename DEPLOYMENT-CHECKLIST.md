# GigsTm Deployment Checklist

## Pre-Deployment

- [ ] Update CORS configuration in server.js to include production domain
- [ ] Create .env file with production values (based on .env.example)
- [ ] Test application locally with production settings
- [ ] Optimize frontend assets (minify CSS/JS if not already done)
- [ ] Ensure all dependencies are correctly listed in package.json
- [ ] Check MongoDB connection string is valid and accessible
- [ ] Verify JWT secret is secure and set in environment variables

## Hostinger Setup

- [ ] Purchase appropriate Hostinger plan with Node.js support
- [ ] Set up domain and DNS settings
- [ ] Enable SSL certificate
- [ ] Set up FTP access for file uploads

## Deployment Process

- [ ] Upload all project files to Hostinger via FTP
- [ ] Install dependencies using npm install --production
- [ ] Configure Node.js application in Hostinger control panel
- [ ] Set environment variables in Hostinger control panel
- [ ] Start the Node.js application

## Post-Deployment Verification

- [ ] Verify frontend loads correctly
- [ ] Test user registration and login
- [ ] Test profile creation and management
- [ ] Test admin dashboard functionality
- [ ] Check for any CORS issues in browser console
- [ ] Verify database connections are working
- [ ] Test all API endpoints

## Performance and Security

- [ ] Enable HTTPS redirection
- [ ] Set up proper caching headers
- [ ] Configure rate limiting if needed
- [ ] Set up monitoring for the application
- [ ] Create database backups

## Documentation

- [ ] Update README with production URL and any special instructions
- [ ] Document any environment-specific configurations
- [ ] Create maintenance procedures document