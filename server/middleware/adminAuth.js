const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect admin routes
exports.protect = async (req, res, next) => {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Get token from cookie
    else if (req.cookies && req.cookies.adminToken) {
        token = req.cookies.adminToken;
    }
    console.log(token);

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from the token
        const user = await User.findById(decoded.id).select('-password');
        
        // Check if user exists and is an admin
        if (!user || user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
    console.log("isadmin call")
    if (req.user && req.user.role === 'admin') {
        console.log("isadmin")
        next();
    } else {
        console.log("not admin")
        res.status(403).json({
            success: false,
            message: 'Not authorized as an admin'
        });
    }
};
