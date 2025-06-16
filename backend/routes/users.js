const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  getFreelancers, 
  getAllSkills,
  getUserApplications,
  getUserJobs,
  updateApplicationStatus
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Get all freelancers with filtering
router.get('/freelancers', getFreelancers);

// Get all skills
router.get('/skills', getAllSkills);

// Update user profile
router.put('/profile', protect, updateUserProfile);

// Get user's applications
router.get('/applications', protect, getUserApplications);

// Get user's job posts
router.get('/my-jobs', protect, getUserJobs);

// Update application status
router.put('/applications/:jobId/:userId', protect, updateApplicationStatus);

// Get user profile by ID
router.get('/:id', getUserProfile);

module.exports = router; 