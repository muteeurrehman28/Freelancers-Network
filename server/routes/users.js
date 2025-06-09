const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { auth } = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('bookmarks');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['username', 'email', 'bio', 'skills', 'profileImage'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: 'Invalid updates'
            });
        }

        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

// Get user's bookmarked jobs
router.get('/bookmarks', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'bookmarks',
                populate: {
                    path: 'postedBy',
                    select: 'username email'
                }
            });

        res.json({
            success: true,
            data: user.bookmarks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookmarks',
            error: error.message
        });
    }
});

// Bookmark a job
router.post('/bookmarks/:jobId', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if already bookmarked
        const alreadyBookmarked = req.user.bookmarks.includes(req.params.jobId);
        if (alreadyBookmarked) {
            return res.status(400).json({
                success: false,
                message: 'Job already bookmarked'
            });
        }

        req.user.bookmarks.push(req.params.jobId);
        await req.user.save();

        res.json({
            success: true,
            message: 'Job bookmarked successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error bookmarking job',
            error: error.message
        });
    }
});

// Remove bookmark
router.delete('/bookmarks/:jobId', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if job is bookmarked
        const isBookmarked = req.user.bookmarks.includes(req.params.jobId);
        if (!isBookmarked) {
            return res.status(400).json({
                success: false,
                message: 'Job is not bookmarked'
            });
        }

        req.user.bookmarks = req.user.bookmarks.filter(
            bookmark => bookmark.toString() !== req.params.jobId
        );
        await req.user.save();

        res.json({
            success: true,
            message: 'Bookmark removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing bookmark',
            error: error.message
        });
    }
});

// Get user's applied jobs
router.get('/applications', auth, async (req, res) => {
    try {
        const jobs = await Job.find({
            'applicants.user': req.user._id
        }).populate('postedBy', 'username email');

        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

// Get user's posted jobs
router.get('/posted-jobs', auth, async (req, res) => {
    try {
        const jobs = await Job.find({
            postedBy: req.user._id
        }).populate('applicants.user', 'username email');

        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching posted jobs',
            error: error.message
        });
    }
});

module.exports = router; 