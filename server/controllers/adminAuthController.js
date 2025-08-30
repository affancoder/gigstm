const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');

// @desc    Register admin
// @route   POST /api/v1/auth/admin/register
// @access  Public
exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return next(new ErrorResponse('User already exists', 400));
        }

        // Create user with admin role
        user = await User.create({
            fullName: name,  // Changed from name to fullName to match the model
            email,
            password,
            phoneNumber: '0000000000',  // Default phone number for admin accounts
            role: 'admin',
            isActive: true
        });

        // Generate token
        const token = user.getSignedJwtToken();

        // Remove password from output
        user.password = undefined;

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.fullName || user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login admin
// @route   POST /api/v1/auth/admin/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    try {
        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to access this route', 401));
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Create token
        const token = user.getSignedJwtToken();
        
        // Set cookie options
        const cookieOptions = {
            expires: new Date(
                Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost'
        };

        // Set cookie
        res.cookie('token', token, cookieOptions);

        // Remove password from output
        user.password = undefined;
        
        // Send response
        res.status(200).json({
            success: true,
            token,
                user: {
                    id: user._id,
                    name: user.fullName || user.name,
                    email: user.email,
                    role: user.role
                }
            });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in admin
// @route   GET /api/v1/auth/admin/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Logout admin / clear cookie
// @route   GET /api/v1/auth/admin/logout
// @access  Private
exports.logout = (req, res) => {
    res.cookie('adminToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};
