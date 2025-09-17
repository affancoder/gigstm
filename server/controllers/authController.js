const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide full name, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            phoneNumber,
            password,
            role: role || 'user'
        });

        // Create user profile
        try {
            await UserProfile.create({
                userId: user._id,
                personalInfo: {
                    name: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                }
            });
        } catch (profileError) {
            console.log('Profile creation failed, but user created:', profileError.message);
        }

        // Create token
        const token = user.getSignedJwtToken();

        // Set cookie options
        const options = {
            expires: new Date(
                Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // Set cookie and return response
        res.status(201).cookie('token', token, options).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.fullName,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide both email and password' 
            });
        }

        // Check for user (case-insensitive email)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create token
        const token = user.getSignedJwtToken();

        // Set cookie options
        const options = {
            expires: new Date(
                Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // Set cookie and return response
        res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.fullName,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.fullName,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error'
        });
    }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
exports.verify = async (req, res) => {
    try {
        // Get token from header or cookie
        let token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        // Verify token
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.fullName,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or expired token' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout',
      error: error.message 
    });
  }
};
