const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        // Build query
        const query = { role: 'user' };
        
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Get users with pagination and populate profile data
        const users = await User.find(query)
            .select('fullName email phoneNumber isActive lastLogin createdAt')
            .populate('profile', 'personalInfo documents address about')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total users count (excluding admins)
        const totalUsers = await User.countDocuments({ role: 'user' });
        
        // Get active users (logged in within last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activeUsers = await User.countDocuments({
            role: 'user',
            lastLogin: { $gte: thirtyDaysAgo }
        });
        
        // Get new users (registered in last 30 days)
        const newUsers = await User.countDocuments({
            role: 'user',
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        // Get users by month for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const usersByMonth = await User.aggregate([
            {
                $match: {
                    role: 'user',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    activeUsers,
                    newUsers
                },
                charts: {
                    usersByMonth
                }
            }
        });
        
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
