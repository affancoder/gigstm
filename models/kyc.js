const mongoose = require("mongoose");

const KycSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		bankName: { type: String, default: "" },
		accountNumber: { type: String, default: "" },
		ifscCode: { type: String, default: "" },

		aadhaarFront: { type: String, default: "" },
		aadhaarBack: { type: String, default: "" },
		panCardUpload: { type: String, default: "" },
		passbookUpload: { type: String, default: "" }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Kyc", KycSchema);
