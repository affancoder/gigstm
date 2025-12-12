const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { createSendToken } = require('../utils/jwtUtils');

// Signup a new user
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // 1) Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already in use', 400));
  }

   if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // 2) Create new user
  const newUser = await User.create({
    name,
    email,
    password
  });

  // 3) Remove password from output
  newUser.password = undefined;

  // 4) Generate token and send response
  createSendToken(newUser, 201, res);
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// Check if user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.status(200).json({
      status: 'success',
      isLoggedIn: true,
      user: req.session.user
    });
  }
  return res.status(200).json({
    status: 'success',
    isLoggedIn: false
  });
};

// Logout user
exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: 'Logout failed'
        });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully!'
      });
    });
  } else {
    res.end();
  }
};


// Change user password
exports.changePassword = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Assuming user is authenticated and req.user is set
  console.log("req : ", req.body)
  const { newPassword, confirmPassword } = req.body;

  // 1) Validate input
  if (!newPassword || !confirmPassword) {
    return next(new AppError('Please provide both new password and confirmation', 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }

  // 2) Fetch user from DB
  const user = await User.findById(userId).select('+password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // 3) Update password
  user.password = newPassword; // assume User model hashes password in pre-save hook
  await user.save();

  // 4) Optionally, invalidate old JWTs (e.g., by changing passwordChangedAt)

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully',
  });
});
