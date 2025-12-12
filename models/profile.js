const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
	// Link to the User
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},

	// BASIC INFO
	name: { type: String },
	email: { type: String },
	mobile: { type: String },
	jobRole: { type: String },
	gender: { type: String },
	dob: { type: Date },

	// FILES (Cloudinary URLs)
	profileImage: { type: String }, // profile-image
	aadhaarFile: { type: String }, // aadhaar-file
	panFile: { type: String }, // pan-file
	resumeFile: { type: String }, // resume-file

	// CARD NUMBERS
	aadhaar: { type: String },
	pan: { type: String },

	// LOCATION
	country: { type: String, default: "in" },
	state: { type: String },
	city: { type: String },

	// ADDRESS
	address1: { type: String },
	address2: { type: String },
	pincode: { type: String },

	// ABOUT
	about: { type: String },

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Profile", profileSchema);
