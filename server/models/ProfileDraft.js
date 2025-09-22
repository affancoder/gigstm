const mongoose = require('mongoose');

const profileDraftSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    data: {
        type: Object,
        default: {}
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

profileDraftSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('ProfileDraft', profileDraftSchema);


