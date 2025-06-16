const JobPost = require('../models/JobPost');
const User = require('../models/User');

// @desc    Create a new job post
// @route   POST /api/jobs
// @access  Private
const createJobPost = async (req, res) => {
  try {
    const { title, description, skillsRequired, budget, duration, location, tags } = req.body;

    // Validation
    if (!title || !description || !skillsRequired || !budget || !duration) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const jobPost = await JobPost.create({
      title,
      description,
      skillsRequired,
      budget,
      duration,
      location: location || 'Remote',
      tags: tags || [],
      postedBy: req.user._id,
    });

    res.status(201).json(jobPost);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get all job posts with filtering
// @route   GET /api/jobs
// @access  Public
const getJobPosts = async (req, res) => {
  try {
    const { 
      skillsRequired, 
      minBudget, 
      maxBudget, 
      search, 
      status, 
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    // Filter by skills
    if (skillsRequired) {
      query.skillsRequired = { $in: skillsRequired.split(',') };
    }

    // Filter by budget range
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    // Filter by status
    if (status) {
      query.status = status;
    } else {
      // By default, only show open jobs
      query.status = 'open';
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    
    // Find jobs and populate user info
    const jobs = await JobPost.find(query)
      .populate('postedBy', 'name email')
      .sort(sort)
      .limit(limitNum)
      .skip(startIndex);

    // Get total count for pagination
    const total = await JobPost.countDocuments(query);

    res.status(200).json({
      jobs,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get single job post
// @route   GET /api/jobs/:id
// @access  Public
const getJobPost = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id)
      .populate('postedBy', 'name email bio profilePicture')
      .populate('applicants.user', 'name email bio profilePicture');
    
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    
    res.status(200).json(job);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Update job post
// @route   PUT /api/jobs/:id
// @access  Private
const updateJobPost = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    
    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this job');
    }
    
    const updatedJob = await JobPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');
    
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Delete job post
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJobPost = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    
    // Check if user is job poster or admin
    if (job.postedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('User not authorized to delete this job');
    }
    
    await job.deleteOne();
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyToJob = async (req, res) => {
  try {
    const { coverLetter, proposedBudget } = req.body;
    
    if (!coverLetter || !proposedBudget) {
      res.status(400);
      throw new Error('Please provide cover letter and proposed budget');
    }
    
    const job = await JobPost.findById(req.params.id);
    
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    
    // Check if job is still open
    if (job.status !== 'open') {
      res.status(400);
      throw new Error('This job is no longer accepting applications');
    }
    
    // Check if user already applied
    const alreadyApplied = job.applicants.find(
      (applicant) => applicant.user.toString() === req.user._id.toString()
    );
    
    if (alreadyApplied) {
      res.status(400);
      throw new Error('You have already applied to this job');
    }
    
    // Check if user is the job poster
    if (job.postedBy.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot apply to your own job posting');
    }
    
    const application = {
      user: req.user._id,
      coverLetter,
      proposedBudget,
    };
    
    job.applicants.push(application);
    await job.save();
    
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Bookmark a job
// @route   POST /api/jobs/:id/bookmark
// @access  Private
const bookmarkJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if job is already bookmarked
    const isBookmarked = user.bookmarkedJobs.includes(req.params.id);
    
    if (isBookmarked) {
      // Remove from bookmarks
      user.bookmarkedJobs = user.bookmarkedJobs.filter(
        (id) => id.toString() !== req.params.id
      );
      await user.save();
      
      res.status(200).json({ 
        message: 'Job removed from bookmarks',
        isBookmarked: false 
      });
    } else {
      // Add to bookmarks
      user.bookmarkedJobs.push(req.params.id);
      await user.save();
      
      res.status(200).json({ 
        message: 'Job added to bookmarks',
        isBookmarked: true 
      });
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Add comment to job post
// @route   POST /api/jobs/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      res.status(400);
      throw new Error('Please provide comment text');
    }
    
    const job = await JobPost.findById(req.params.id);
    
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    
    const comment = {
      user: req.user._id,
      text,
    };
    
    job.comments.push(comment);
    await job.save();
    
    const updatedJob = await JobPost.findById(req.params.id)
      .populate('comments.user', 'name profilePicture');
    
    res.status(201).json(updatedJob.comments);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get user's bookmarked jobs
// @route   GET /api/jobs/bookmarked
// @access  Private
const getBookmarkedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'bookmarkedJobs',
      populate: {
        path: 'postedBy',
        select: 'name',
      },
    });
    
    res.status(200).json(user.bookmarkedJobs);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Create test job posts
// @route   POST /api/jobs/test
// @access  Public
const createTestJob = async (req, res) => {
  try {
    // First, find or create a test user
    const User = require('../models/User');
    let testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'client',
        skills: ['JavaScript', 'React', 'Node.js'],
        bio: 'This is a test user account.',
      });
    }

    // Create multiple test jobs
    const testJobs = await JobPost.create([
      {
        title: 'Senior React Developer Needed',
        description: 'Looking for an experienced React developer to join our team. Must have 3+ years of experience with React, Redux, and modern JavaScript.',
        skillsRequired: ['React', 'JavaScript', 'Redux', 'HTML', 'CSS'],
        budget: 5000,
        duration: '3 months',
        location: 'Remote',
        status: 'open',
        tags: ['react', 'frontend', 'javascript'],
        postedBy: testUser._id,
      },
      {
        title: 'Full Stack Developer for E-commerce Project',
        description: 'We need a full stack developer to help build our e-commerce platform. Experience with Node.js, React, and MongoDB required.',
        skillsRequired: ['Node.js', 'React', 'MongoDB', 'Express', 'JavaScript'],
        budget: 8000,
        duration: '6 months',
        location: 'Remote',
        status: 'open',
        tags: ['fullstack', 'ecommerce', 'nodejs'],
        postedBy: testUser._id,
      },
      {
        title: 'UI/UX Designer for Mobile App',
        description: 'Looking for a talented UI/UX designer to create beautiful and intuitive interfaces for our mobile application.',
        skillsRequired: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Mobile Design'],
        budget: 3000,
        duration: '2 months',
        location: 'Remote',
        status: 'open',
        tags: ['design', 'ui/ux', 'mobile'],
        postedBy: testUser._id,
      }
    ]);

    res.status(201).json(testJobs);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJobPost,
  getJobPosts,
  getJobPost,
  updateJobPost,
  deleteJobPost,
  applyToJob,
  bookmarkJob,
  addComment,
  getBookmarkedJobs,
  createTestJob,
}; 