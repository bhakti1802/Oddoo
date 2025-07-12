const express = require('express');
const router = express.Router();
const Swap = require('../models/Swap');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Send request
router.post('/', auth, async (req, res) => {
  const { toUserId } = req.body;
  const exists = await Swap.findOne({ fromUserId: req.user.id, toUserId, status: 'pending' });
  if (exists) return res.status(400).json({ message: 'Already sent' });

  const swap = new Swap({ fromUserId: req.user.id, toUserId });
  await swap.save();
  res.status(201).json(swap);
});

// Accept
router.post('/:id/accept', auth, async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  if (!swap || swap.toUserId.toString() !== req.user.id)
    return res.status(403).json({ message: 'Unauthorized' });

  swap.status = 'accepted';
  await swap.save();
  res.json({ message: 'Accepted' });
});

// Reject
router.post('/:id/reject', auth, async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  if (!swap || swap.toUserId.toString() !== req.user.id)
    return res.status(403).json({ message: 'Unauthorized' });

  swap.status = 'rejected';
  await swap.save();
  res.json({ message: 'Rejected' });
});

// Delete (cancel)
router.delete('/:id/delete', auth, async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  if (!swap || swap.fromUserId.toString() !== req.user.id || swap.status !== 'pending')
    return res.status(403).json({ message: 'Unauthorized' });

  await swap.remove();
  res.json({ message: 'Deleted' });
});

// View swaps
router.get('/me', auth, async (req, res) => {
  const swaps = await Swap.find({
    $or: [{ fromUserId: req.user.id }, { toUserId: req.user.id }]
  }).populate('fromUserId', 'name email')
    .populate('toUserId', 'name email');

  res.json(swaps);
});

// Rate after swap
router.post('/:id/rate', auth, async (req, res) => {
  const { rating, comment } = req.body;
  const swap = await Swap.findById(req.params.id);
  if (!swap || swap.status !== 'accepted')
    return res.status(400).json({ message: 'Invalid swap' });

  const targetUserId = swap.fromUserId.toString() === req.user.id
    ? swap.toUserId
    : swap.fromUserId;

  const user = await User.findById(targetUserId);
  user.ratings.push({ fromUserId: req.user.id, rating, comment });
  await user.save();

  res.json({ message: 'Rating submitted!' });
});

module.exports = router;
