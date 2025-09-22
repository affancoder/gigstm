const UserProfile = require('../models/UserProfile');
const User = require('../models/User');
const ProfileDraft = require('../models/ProfileDraft');
const cloudinary = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'gigstm/user_uploads' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

exports.saveProfileWithUploads = async (req, res) => {
    try {
        // Process file uploads if any
        const files = req.files || {};
        if (files && Object.keys(files).length > 0) {
            req.body.files = req.body.files && typeof req.body.files === 'object' ? req.body.files : {};

            const entries = Object.entries(files);
            for (const [fieldName, fileArr] of entries) {
                const fileObj = fileArr?.[0];
                if (!fileObj || !fileObj.buffer) continue;
                const uploaded = await uploadBufferToCloudinary(fileObj.buffer, fileObj.originalname);
                // Map known fields to canonical keys
                const mapping = {
                    profileImage: 'profileImage',
                    'profile-image': 'profileImage',
                    aadhaarFile: 'aadhaarFile',
                    'aadhaar-file': 'aadhaarFile',
                    panFile: 'panFile',
                    'pan-file': 'panFile',
                    resume: 'resume',
                    'resume-file': 'resume',
                    resumeStep2: 'resumeStep2',
                    aadhaarFront: 'aadhaarFront',
                    aadhaarBack: 'aadhaarBack',
                    panCardUpload: 'panCardUpload',
                    passbookUpload: 'passbookUpload'
                };
                const key = mapping[fieldName] || fieldName;
                req.body.files[key] = uploaded.secure_url || uploaded.url;
            }
        }

        // Delegate to existing saveProfile logic (expects JSON fields in req.body)
        return exports.saveProfile(req, res);
    } catch (error) {
        console.error('Error processing uploads:', error);
        return res.status(500).json({ success: false, message: 'Error processing uploads', error: error.message });
    }
};

// Save or update user profile
exports.saveProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body;

        // Validate required fields
        if (!profileData.personalInfo || !profileData.personalInfo.name || !profileData.personalInfo.email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required fields'
            });
        }

        // Check if profile exists
        let profile = await UserProfile.findOne({ userId });

        if (profile) {
            // Update existing profile
            profile = await UserProfile.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        ...profileData,
                        updatedAt: Date.now()
                    }
                },
                { new: true, runValidators: true }
            );
        } else {
            // Create new profile
            profile = new UserProfile({
                userId,
                ...profileData
            });
            await profile.save();
        }

        // Update user's core fields if changed
        await User.findByIdAndUpdate(userId, {
            fullName: profileData.personalInfo.name,
            email: profileData.personalInfo.email,
            phoneNumber: profileData.personalInfo.mobile
        });

        res.status(200).json({
            success: true,
            message: 'Profile saved successfully',
            data: profile
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await UserProfile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Get all users' profiles
exports.getAllProfiles = async (req, res) => {
    try {
        // Get all users with their profiles (removed admin restriction)
        const users = await User.find({})
            .select('fullName email phoneNumber role createdAt')
            .lean();

        // Format the data for the frontend
        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.fullName,
            email: user.email,
            phone: user.phoneNumber,
            role: user.role,
            status: 'active',
            createdAt: user.createdAt,
            lastLogin: new Date()
        }));

        res.status(200).json({
            success: true,
            data: formattedUsers
        });
    } catch (error) {
        console.error('Error fetching all profiles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profiles',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Save or update profile draft (partial data allowed)
exports.saveDraft = async (req, res) => {
    try {
        const userId = req.user.id;
        const draftData = req.body || {};

        let draft = await ProfileDraft.findOne({ userId });
        if (draft) {
            draft.data = { ...draft.data, ...draftData };
            await draft.save();
        } else {
            draft = await ProfileDraft.create({ userId, data: draftData });
        }

        res.status(200).json({ success: true, message: 'Draft saved', data: draft });
    } catch (error) {
        console.error('Error saving draft:', error);
        res.status(500).json({ success: false, message: 'Error saving draft' });
    }
};

// Get profile draft
exports.getDraft = async (req, res) => {
    try {
        const userId = req.user.id;
        const draft = await ProfileDraft.findOne({ userId });
        if (!draft) {
            return res.status(404).json({ success: false, message: 'No draft found' });
        }
        res.status(200).json({ success: true, data: draft });
    } catch (error) {
        console.error('Error fetching draft:', error);
        res.status(500).json({ success: false, message: 'Error fetching draft' });
    }
};
