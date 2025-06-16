const mongoose = require('mongoose');

const jobPostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    skillsRequired: {
      type: [String],
      required: [true, 'Please add required skills'],
    },
    budget: {
      type: Number,
      required: [true, 'Please add a budget'],
    },
    duration: {
      type: String,
      required: [true, 'Please add project duration'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      default: 'Remote',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'closed'],
      default: 'open',
    },
    tags: {
      type: [String],
      default: [],
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        coverLetter: {
          type: String,
          required: true,
        },
        proposedBudget: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search
jobPostSchema.index({ title: 'text', description: 'text', tags: 'text' });

const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost; 