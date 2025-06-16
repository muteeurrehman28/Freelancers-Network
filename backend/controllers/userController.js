const User = require('../models/User');
const JobPost = require('../models/JobPost');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -bookmarkedJobs');
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    // Get user's job posts
    const jobPosts = await JobPost.find({ postedBy: req.params.id })
      .sort('-createdAt')
      .select('title description budget skillsRequired createdAt status');
    
    res.status(200).json({
      ...user._doc,
      jobPosts,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    
    // If password is included, update it
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get all freelancers with filtering
// @route   GET /api/users/freelancers
// @access  Public
const getFreelancers = async (req, res) => {
  try {
    const { skills, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { role: 'freelancer' };
    
    // Filter by skills
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    
    const freelancers = await User.find(query)
      .select('-password -bookmarkedJobs')
      .sort('-createdAt')
      .limit(limitNum)
      .skip(startIndex);
      
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      freelancers,
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

// @desc    Get all common skills from the database
// @route   GET /api/users/skills
// @access  Public
const getAllSkills = async (req, res) => {
  try {
    // Aggregate to find the most common skills across all users
    const skills = await User.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 }, // Get top 50 skills
    ]);
    
    res.status(200).json(skills.map(skill => skill._id));
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get user's applied jobs
// @route   GET /api/users/applications
// @access  Private
const getUserApplications = async (req, res) => {
  try {
    const applications = await JobPost.find({
      'applicants.user': req.user._id,
    })
      .select('title description budget status applicants createdAt')
      .populate('postedBy', 'name email')
      .sort('-createdAt');
    
    // Extract only the relevant application data for the user
    const userApplications = applications.map(job => {
      const application = job.applicants.find(app => 
        app.user.toString() === req.user._id.toString()
      );
      
      return {
        job: {
          _id: job._id,
          title: job.title,
          description: job.description,
          budget: job.budget,
          status: job.status,
          postedBy: job.postedBy,
          createdAt: job.createdAt,
        },
        application: {
          coverLetter: application.coverLetter,
          proposedBudget: application.proposedBudget,
          status: application.status,
          submittedAt: application.submittedAt,
        },
      };
    });
    
    res.status(200).json(userApplications);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get user's job posts with applications
// @route   GET /api/users/my-jobs
// @access  Private
const getUserJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find({ postedBy: req.user._id })
      .populate('applicants.user', 'name email bio profilePicture')
      .sort('-createdAt');
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Update application status
// @route   PUT /api/users/applications/:jobId/:userId
// @access  Private
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Please provide a valid status');
    }
    
    const job = await JobPost.findById(req.params.jobId);
    
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    
    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this job');
    }
    
    // Find the application
    const applicationIndex = job.applicants.findIndex(
      app => app.user.toString() === req.params.userId
    );
    
    if (applicationIndex === -1) {
      res.status(404);
      throw new Error('Application not found');
    }
    
    // Update application status
    job.applicants[applicationIndex].status = status;
    
    // If accepted, update job status to in-progress
    if (status === 'accepted') {
      job.status = 'in-progress';
    }
    
    await job.save();
    
    res.status(200).json({ message: 'Application status updated' });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getFreelancers,
  getAllSkills,
  getUserApplications,
  getUserJobs,
  updateApplicationStatus,
}; 