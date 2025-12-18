const jwt = require('jsonwebtoken');
const AppError = require('./appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // 🍪 Cookie options
  const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",        // ← allow navigation
  path: "/",              // ← REQUIRED
  maxAge: 7 * 24 * 60 * 60 * 1000
}

  // ✅ Set cookie
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user
    }
  });
};


module.exports = {
  signToken,
  verifyToken,
  createSendToken
};
