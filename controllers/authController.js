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
  res.cookie("jwt", "loggedout", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 1000) // expires immediately
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully!"
  });
};



// Change user password
exports.changePassword = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // User is authenticated and req.user is set by the protect middleware
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // 1) Validate input
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError('Please provide all required fields', 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError('New passwords do not match', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  // 2) Fetch user from DB with password
  const user = await User.findById(userId).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // 3) Verify current password
  const isPasswordCorrect = await user.correctPassword(currentPassword, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  // 4) Check if new password is different from current
  if (currentPassword === newPassword) {
    return next(new AppError('New password must be different from current password', 400));
  }

  // 5) Update password (password is hashed in the User model pre-save hook)
  user.password = newPassword;
  user.passwordChangedAt = Date.now() - 1000; // Ensure token is still valid
  await user.save();

  // 6) Log out all sessions by sending a cookie that expires immediately
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully. Please login again with your new password.'
  });
});
