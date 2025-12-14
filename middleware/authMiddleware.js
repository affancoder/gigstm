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

module.exports.restrictTo = function (...roles) {
	return (req, res, next) => {
		const adminEmails = (process.env.ADMIN_EMAILS || "")
			.split(",")
			.map((e) => e.trim().toLowerCase())
			.filter(Boolean);
		const isAdminEmail =
			req.user?.email && adminEmails.includes(req.user.email.toLowerCase());
		const hasRole = roles.includes(req.user?.role);
		if (!(hasRole || isAdminEmail)) {
			return next(new AppError("Forbidden", 403));
		}
		next();
	};
};
