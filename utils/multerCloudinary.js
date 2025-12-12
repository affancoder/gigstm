const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Storage settings
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "users", // folder in cloudinary
		allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
	},
});

const upload = multer({ storage });

module.exports = upload;
