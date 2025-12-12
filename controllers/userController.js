const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { createSendToken } = require("../utils/jwtUtils");
const Profile = require("../models/profile");
const Experience = require("../models/experience");
const Kyc = require("../models/kyc");
const UserExperience = require("../models/experience");

// Profile
// exports.profile = catchAsync(async (req, res, next) => {
// 	const files = req.files;

// 	await Profile.create({
// 		user: req.user.id,

// 		name: req.body.name,
// 		email: req.body.email,
// 		mobile: req.body.mobile,
// 		jobRole: req.body.jobRole,
// 		gender: req.body.gender,
// 		dob: req.body.dob,

// 		profileImage: files["profile-image"]
// 			? files["profile-image"][0].path
// 			: "",
// 		aadhaarFile: files["aadhaar-file"] ? files["aadhaar-file"][0].path : "",
// 		panFile: files["pan-file"] ? files["pan-file"][0].path : "",
// 		resumeFile: files["resume-file"] ? files["resume-file"][0].path : "",

// 		aadhaar: req.body.aadhaar,
// 		pan: req.body.pan,

// 		country: req.body.country,
// 		state: req.body.state,
// 		city: req.body.city,

// 		address1: req.body.address1,
// 		address2: req.body.address2,
// 		pincode: req.body.pincode,

// 		about: req.body.about,
// 	});

// 	res.status(200).json({ message: "Profile submitted successfully!" });
// });


exports.profile = catchAsync(async (req, res, next) => {
	const files = req.files;

	// Check if profile already exists
	const existingProfile = await Profile.findOne({ user: req.user.id });

	// Prepare profile data
	const profileData = {
		user: req.user.id,

		name: req.body.name,
		email: req.body.email,
		mobile: req.body.mobile,
		jobRole: req.body.jobRole,
		gender: req.body.gender,
		dob: req.body.dob,

		profileImage: files["profile-image"]
			? files["profile-image"][0].path
			: existingProfile?.profileImage || "",

		aadhaarFile: files["aadhaar-file"]
			? files["aadhaar-file"][0].path
			: existingProfile?.aadhaarFile || "",

		panFile: files["pan-file"]
			? files["pan-file"][0].path
			: existingProfile?.panFile || "",

		resumeFile: files["resume-file"]
			? files["resume-file"][0].path
			: existingProfile?.resumeFile || "",

		aadhaar: req.body.aadhaar,
		pan: req.body.pan,

		country: req.body.country,
		state: req.body.state,
		city: req.body.city,

		address1: req.body.address1,
		address2: req.body.address2,
		pincode: req.body.pincode,

		about: req.body.about,
	};

	// If profile exists → UPDATE
	if (existingProfile) {
		await Profile.findOneAndUpdate(
			{ user: req.user.id },
			profileData,
			{ new: true }
		);

		return res
			.status(200)
			.json({ message: "Profile updated successfully!" });
	}

	// If no profile → CREATE new one
	await Profile.create(profileData);

	res.status(200).json({ message: "Profile submitted successfully!" });
});

// Experience
exports.experience = catchAsync(async (req, res, next) => {
	const files = req.files;

	// Check if user already has an Experience entry
	const existingExp = await UserExperience.findOne({ user: req.user.id });

	// Prepare data
	const experienceData = {
		user: req.user.id,

		experienceYears: req.body.experienceYears,
		experienceMonths: req.body.experienceMonths,
		employmentType: req.body.employmentType,

		occupation: req.body.occupation,
		jobRequirement: req.body.jobRequirement,

		heardAbout: req.body.heardAbout,
		interestType: req.body.interestType,

		resumeStep2: files["resumeStep2"] ? files["resumeStep2"][0].path : "",
	};

	// If already exists → UPDATE
	if (existingExp) {
		await UserExperience.findOneAndUpdate(
			{ user: req.user.id },
			experienceData,
			{ new: true }
		);

		return res
			.status(200)
			.json({ message: "Experience updated successfully!" });
	}

	// Else → CREATE
	await UserExperience.create(experienceData);

	res.status(200).json({
		message: "Experience submitted successfully!",
	});
});


// KYC
exports.kyc = catchAsync(async (req, res, next) => {
    const files = req.files || {};
    const {
        fullName,
        dateOfBirth,
        gender,
        phoneNumber,
        alternatePhone,
        addressLine1,
        addressLine2,
        city,
        state,
        country = 'India',
        pincode,
        documentType,
        documentNumber,
        notes,
        additionalDocs // JSON string of additional documents
    } = req.body;

    // Prepare KYC data
    const kycData = {
        user: req.user.id,
        fullName,
        dateOfBirth,
        gender,
        phoneNumber,
        addressLine1,
        city,
        state,
        country,
        pincode,
        documentType,
        documentNumber,
    };

    // Add optional fields if they exist
    if (alternatePhone) kycData.alternatePhone = alternatePhone;
    if (addressLine2) kycData.addressLine2 = addressLine2;
    if (notes) kycData.notes = notes;

    // Handle file uploads
    if (files.documentFront && files.documentFront[0]) {
        kycData.documentFront = files.documentFront[0].path;
    }
    
    if (files.documentBack && files.documentBack[0]) {
        kycData.documentBack = files.documentBack[0].path;
    }
    
    if (files.selfieWithDocument && files.selfieWithDocument[0]) {
        kycData.selfieWithDocument = files.selfieWithDocument[0].path;
    }

    // Handle additional documents
    if (files.additionalDocuments && files.additionalDocuments.length > 0) {
        kycData.additionalDocuments = files.additionalDocuments.map(doc => ({
            name: doc.originalname,
            url: doc.path,
            type: doc.mimetype
        }));
    }

    // Parse and add any additional documents from the request body
    try {
        if (additionalDocs && typeof additionalDocs === 'string') {
            const additionalDocsArray = JSON.parse(additionalDocs);
            if (Array.isArray(additionalDocsArray)) {
                kycData.additionalDocuments = [
                    ...(kycData.additionalDocuments || []),
                    ...additionalDocsArray
                ];
            }
        }
    } catch (err) {
        console.error('Error parsing additionalDocs:', err);
        return next(new AppError('Invalid additional documents format', 400));
    }

    // Check if KYC already exists for this user
    const existingKYC = await KYC.findOne({ user: req.user.id });
    
    let kyc;
    if (existingKYC) {
        // Update existing KYC
        kyc = await KYC.findByIdAndUpdate(existingKYC._id, kycData, {
            new: true,
            runValidators: true
        });
    } else {
        // Create new KYC
        kyc = await KYC.create(kycData);
    }

    res.status(201).json({
        status: 'success',
        data: {
            kyc
        }
    });
});

// // Get KYC status
// exports.getKYCStatus = catchAsync(async (req, res, next) => {
//     const kyc = await KYC.findOne({ user: req.user.id });
    
//     if (!kyc) {
//         return next(new AppError('No KYC submission found', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             kyc
//         }
//     });
// });


exports.kyc = catchAsync(async (req, res, next) => {
	const files = req.files;

	// Check if KYC already exists
	const existingKyc = await Kyc.findOne({ user: req.user.id });

	// Prepare data object
	const kycData = {
		user: req.user.id,

		bankName: req.body.bankName,
		accountNumber: req.body.accountNumber,
		ifscCode: req.body.ifscCode,

		aadhaarFront: files["aadhaarFront"]
			? files["aadhaarFront"][0].path
			: existingKyc?.aadhaarFront || "",

		aadhaarBack: files["aadhaarBack"]
			? files["aadhaarBack"][0].path
			: existingKyc?.aadhaarBack || "",

		panCardUpload: files["panCardUpload"]
			? files["panCardUpload"][0].path
			: existingKyc?.panCardUpload || "",

		passbookUpload: files["passbookUpload"]
			? files["passbookUpload"][0].path
			: existingKyc?.passbookUpload || "",
	};

	// If exists → update
	if (existingKyc) {
		await Kyc.findOneAndUpdate(
			{ user: req.user.id },
			kycData,
			{ new: true }
		);

		return res.status(200).json({
			message: "KYC details updated successfully!",
		});
	}

	// Else → create
	await Kyc.create(kycData);

	res.status(200).json({
		message: "KYC details submitted successfully!",
	});
});


// Change Password
exports.changePassword = catchAsync(async (req, res, next) => {
	res.status(200).json({ message: "Password changed successfully!" });
});
