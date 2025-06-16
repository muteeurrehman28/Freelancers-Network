const express = require('express');
const router = express.Router();
const { 
  createJobPost, 
  getJobPosts, 
  getJobPost, 
  updateJobPost, 
  deleteJobPost, 
  applyToJob, 
  bookmarkJob, 
  addComment,
  getBookmarkedJobs,
  createTestJob
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Create a test job
router.post('/test', createTestJob);

// Get all jobs with filtering
router.get('/', getJobPosts);

// Create a new job post
router.post('/', protect, createJobPost);

// Get bookmarked jobs
router.get('/bookmarked', protect, getBookmarkedJobs);

// Get, update, or delete a specific job post
router.route('/:id')
  .get(getJobPost)
  .put(protect, updateJobPost)
  .delete(protect, deleteJobPost);

// Apply to a job
router.post('/:id/apply', protect, applyToJob);

// Bookmark a job
router.post('/:id/bookmark', protect, bookmarkJob);

// Add comment to a job
router.post('/:id/comments', protect, addComment);

module.exports = router; 