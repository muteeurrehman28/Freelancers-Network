const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, skills, bio } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400);
    throw new Error('Username or email already taken');
  }

  const user = await User.create({
    username,
    email,
    password,
    role,
    skills,
    bio,
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
exports.authUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get logged in user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update logged in user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res) => {
  const updates = (({ username, email, password, skills, bio, profileImage }) => ({
    username,
    email,
    password,
    skills,
    bio,
    profileImage,
  }))(req.body);

  // Remove undefined fields
  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  Object.assign(user, updates);
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
    skills: updatedUser.skills,
    bio: updatedUser.bio,
    profileImage: updatedUser.profileImage,
    token: generateToken(updatedUser._id),
  });
});

// @desc    Delete a user (self‑delete or admin)
// @route   DELETE /api/users/:id
// @access  Private (owner or admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not allowed to delete this user');
  }

  await User.findByIdAndDelete(id);
  res.json({ message: 'User removed' });
});