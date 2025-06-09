const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { auth, checkRole } = require('../middleware/auth');

// Get all jobs with filters
router.get('/', async (req, res) => {
    try {
        const {
            search,
            skills,
            minBudget,
            maxBudget,
            category,
            experienceLevel,
            isRemote,
            status
        } = req.query;

        const query = {};

        // Search in title and description
        if (search) {
            query.$text = { $search: search };
        }

        // Filter by skills
        if (skills) {
            query.skillsRequired = {
                $in: skills.split(',').map(skill => skill.trim())
            };
        }

        // Filter by budget range
        if (minBudget || maxBudget) {
            query.budget = {};
            if (minBudget) query.budget.$gte = Number(minBudget);
            if (maxBudget) query.budget.$lte = Number(maxBudget);
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by experience level
        if (experienceLevel) {
            query.experienceLevel = experienceLevel;
        }

        // Filter by remote status
        if (isRemote !== undefined) {
            query.isRemote = isRemote === 'true';
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'username email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
});

// Create new job
router.post('/', auth, checkRole(['client', 'admin']), async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            postedBy: req.user._id
        });

        await job.save();

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
});

// Get single job
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'username email')
            .populate('applicants.user', 'username email skills');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
});

// Update job
router.put('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if user is the job poster or admin
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('postedBy', 'username email');

        res.json({
            success: true,
            message: 'Job updated successfully',
            data: updatedJob
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if user is the job poster or admin
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        await job.remove();

        res.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
});

// Apply for job
router.post('/:id/apply', auth, checkRole(['freelancer']), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if job is open
        if (job.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer accepting applications'
            });
        }

        // Check if already applied
        const alreadyApplied = job.applicants.some(
            applicant => applicant.user.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        job.applicants.push({
            user: req.user._id,
            status: 'pending'
        });

        await job.save();

        res.json({
            success: true,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error applying for job',
            error: error.message
        });
    }
});

module.exports = router; 