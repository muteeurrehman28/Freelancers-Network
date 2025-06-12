const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  hireFreelancer,
} = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getJobs)
  .post(protect, authorizeRoles('client'), createJob);

router
  .route('/:id')
  .get(getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

router.post('/:id/apply', protect, authorizeRoles('freelancer'), applyToJob);
router.post(
  '/:id/hire/:freelancerId',
  protect,
  authorizeRoles('client'),
  hireFreelancer,
);

module.exports = router;