const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  coWorkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoWorkingSpace',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rating', RatingSchema);
