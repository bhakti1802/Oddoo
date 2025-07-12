const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get own profile
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Update profile
router.put('/me', auth, async (req, res) => {
  const updates = req.body;
  const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  res.json(updated);
});

// Search by skill
router.get('/search', async (req, res) => {
  const { skill } = req.query;
  const users = await User.find({
    isPublic: true,
    $or: [
      { skillsOffered: { $regex: skill, $options: 'i' } },
      { skillsWanted: { $regex: skill, $options: 'i' } }
    ]
  }).select('-password');
  res.json(users);
});

module.exports = router;
