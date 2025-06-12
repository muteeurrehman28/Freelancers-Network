const Job = require('../models/Job');
const asyncHandler = require('express-async-handler');


// @desc    Create a new job (client only)
// @route   POST /api/jobs
// @access  Private
exports.createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    budget,
    skillsRequired,
    deadline,
    attachments,
    category,
    location,
    isRemote,
    experienceLevel,
  } = req.body;

  const job = await Job.create({
    title,
    description,
    budget,
    skillsRequired,
    deadline,
    attachments,
    category,
    location,
    isRemote,
    experienceLevel,
    postedBy: req.user._id,
  });

  res.status(201).json(job);
});

// @desc    Get all jobs (public with filters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res) => {
  const filters = { status: 'open' };

  // Search & filter helpers
  const { keyword, category, minBudget, maxBudget, experienceLevel } = req.query;
  if (keyword) {
    filters.$text = { $search: keyword };
  }
  if (category) filters.category = category;
  if (experienceLevel) filters.experienceLevel = experienceLevel;
  if (minBudget || maxBudget) {
    filters.budget = {
      ...(minBudget && { $gte: Number(minBudget) }),
      ...(maxBudget && { $lte: Number(maxBudget) }),
    };
  }

  const jobs = await Job.find(filters).populate('postedBy', 'username role');
  res.json(jobs);
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'username role');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  res.json(job);
});

// @desc    Update job (owner)
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  Object.assign(job, req.body);
  const updatedJob = await job.save();
  res.json(updatedJob);
});

// @desc    Delete job (owner)
// @route   DELETE /api/jobs/:id
// @access  Private
// @desc    Delete job (owner)
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await job.deleteOne(); // ✅ FIXED HERE

  res.json({ message: 'Job removed' });
});

// @desc    Apply to a job (freelancer)
// @route   POST /api/jobs/:id/apply
// @access  Private
exports.applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.applicants.some((a) => a.user.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error('Already applied');
  }
  job.applicants.push({ user: req.user._id });
  await job.save();
  res.json({ message: 'Application submitted' });
});

// @desc    Hire freelancer (client selects)
// @route   POST /api/jobs/:id/hire/:freelancerId
// @access  Private (client)
exports.hireFreelancer = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the job owner can hire freelancers');
  }

  const applicant = job.applicants.find(
    (a) => a.user.toString() === req.params.freelancerId
  );
  if (!applicant) {
    res.status(404);
    throw new Error('Freelancer did not apply for this job');
  }

  applicant.status = 'accepted';
  job.hiredFreelancer = applicant.user;
  job.status = 'in-progress';
  await job.save();

  res.json({ message: 'Freelancer hired', job });
});