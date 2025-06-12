const express = require('express');
const {
  registerUser,
  authUser,
  getMe,
  updateMe,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.delete('/:id', protect, deleteUser);

module.exports = router;