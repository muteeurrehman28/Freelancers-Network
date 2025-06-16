const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Create a test user
router.post('/test-user', async (req, res) => {
  try {
    const User = require('../models/User');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'client',
      skills: ['JavaScript', 'React', 'Node.js'],
      bio: 'This is a test user account.',
    });
    res.status(201).json(testUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get current user profile
router.get('/me', protect, getCurrentUser);

module.exports = router; 