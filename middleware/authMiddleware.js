const User = require("../models/user");
const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jwtUtils");

module.exports.protect = async function (req, res, next) {
	try {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}
		if (!token) {
			return next(new AppError("You are not logged in!", 401));
		}

		const decoded = verifyToken(token);

		const currentUser = await User.findById(decoded.id);
		if (!currentUser) {
			return next(new AppError("User no longer exists!", 401));
		}

		req.user = currentUser;

		next();
	} catch (err) {
		return next(new AppError("Invalid or expired token!", 401));
	}
};
