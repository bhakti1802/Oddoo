const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePhoto: { type: String, default: '' },
  location: String,
  availability: String,
  isPublic: { type: Boolean, default: true },
  skillsOffered: [String],
  skillsWanted: [String],
  ratings: [
    {
      fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
