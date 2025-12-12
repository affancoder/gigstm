const mongoose = require("mongoose");

const UserExperienceSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		experienceYears: { type: String, default: "" },
		experienceMonths: { type: String, default: "" },
		employmentType: { type: String, default: "" },

		occupation: { type: String, default: "" },
		jobRequirement: { type: String, default: "" },

		heardAbout: { type: String, default: "" },
		interestType: { type: String, default: "" },

		// Uploaded file name (resume)
		resumeStep2: { type: String, default: "" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("UserExperience", UserExperienceSchema);
