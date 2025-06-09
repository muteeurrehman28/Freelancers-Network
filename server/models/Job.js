const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    budget: {
        type: Number,
        required: true,
        min: 0
    },
    skillsRequired: [{
        type: String,
        trim: true
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'cancelled'],
        default: 'open'
    },
    applicants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }],
    hiredFreelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deadline: {
        type: Date
    },
    attachments: [{
        type: String // URLs to files
    }],
    category: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    isRemote: {
        type: Boolean,
        default: false
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'intermediate', 'expert'],
        required: true
    }
}, {
    timestamps: true
});

// Index for search functionality
jobSchema.index({ 
    title: 'text', 
    description: 'text', 
    skillsRequired: 'text' 
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job; 