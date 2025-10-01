const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    // Personal Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    jobRole: String,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    dob: Date,

    // Documents
    aadhaar: { type: String, unique: true, sparse: true },
    pan: { type: String, unique: true, sparse: true },

    // Document Files
    profileImage: { type: String }, // URL to stored image
    aadhaarFile: { type: String },  // URL to stored file
    panFile: { type: String },      // URL to stored file
    resume: { type: String },       // URL to stored file

    // Address Information
    address: {
        address1: String,
        address2: String,
        city: String,
        state: String,
        country: { type: String, default: 'in' },
        pincode: String
    },

    // Professional Information
    about: String,
    experience: {
        years: { type: Number, min: 0 },
        months: { type: Number, min: 0, max: 11 }
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'freelance']
    },
    occupation: String,
    jobRequirement: String,
    heardAbout: String,
    interestType: String,

    // Bank Details
    bankDetails: {
        bankName: String,
        accountNumber: String,
        ifscCode: String
    },

    // Status and Metadata
    status: {
        type: String,
        enum: ['draft', 'complete', 'pending', 'verified'],
        default: 'draft'
    },
    isVerified: { type: Boolean, default: false },
    completionPercentage: { type: Number, default: 0 },

    // Draft System
    isDraft: { type: Boolean, default: true },
    lastDraftSaved: Date,

    // System Fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'userProfiles'
});

// Indexes for performance
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ mobile: 1 });
userProfileSchema.index({ aadhaar: 1 });
userProfileSchema.index({ pan: 1 });
userProfileSchema.index({ isDraft: 1 });
userProfileSchema.index({ status: 1 });

// Pre-save middleware to update completion percentage
userProfileSchema.pre('save', function(next) {
    const requiredFields = ['name', 'email', 'mobile', 'aadhaar', 'pan'];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(field => this[field]).length;
    this.completionPercentage = Math.round((completedFields / totalFields) * 100);
    next();
});

// Method to convert draft to complete profile
userProfileSchema.methods.finalizeDraft = function() {
    this.isDraft = false;
    this.status = 'pending';
    this.lastDraftSaved = null;
    return this.save();
};

// Static method to find profile by email or mobile
userProfileSchema.statics.findByEmailOrMobile = function(identifier) {
    return this.findOne({
        $or: [
            { email: identifier },
            { mobile: identifier }
        ]
    });
};

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
