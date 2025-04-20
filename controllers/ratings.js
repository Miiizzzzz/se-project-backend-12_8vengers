const Rating = require('../models/Rating');
const CoWorkingSpace = require('../models/CoWorkingSpace');

exports.addRating = async (req, res, next) => {
  try {
    const { coWorkingSpaceId, score, comment } = req.body;

    const coWorkingSpace = await CoWorkingSpace.findById(coWorkingSpaceId);
    if (!coWorkingSpace) {
      return res.status(404).json({ success: false, message: 'Co-Working Space not found' });
    }

    const existingRating = await Rating.findOne({
      coWorkingSpace: coWorkingSpaceId,
      user: req.user.id
    });
    if (existingRating) {
      return res.status(400).json({ success: false, message: 'You have already rated this Co-Working Space' });
    }

    const rating = await Rating.create({
      coWorkingSpace: coWorkingSpaceId,
      user: req.user.id,
      score,
      comment
    });

    res.status(201).json({
      success: true,
      data: rating
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


exports.getAllRatings = async (req, res, next) => {
  try {
    const { coWorkingSpaceId } = req.params;

    const ratings = await Rating.find({ coWorkingSpace: coWorkingSpaceId }).populate('user', 'name');

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getAverageRating = async (req, res, next) => {
  try {
    const { coWorkingSpaceId } = req.params;

    const result = await Rating.aggregate([
      { $match: { coWorkingSpace: require('mongoose').Types.ObjectId(coWorkingSpaceId) } },
      {
        $group: {
          _id: '$coWorkingSpace',
          averageRating: { $avg: '$score' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ success: true, data: { averageRating: 0, totalRatings: 0 } });
    }

    res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateRating = async (req, res, next) => {
  try {
    const { ratingId } = req.params;
    const { score, comment } = req.body;

    const rating = await Rating.findById(ratingId);

    if (!rating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    if (rating.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this rating' });
    }

    rating.score = score || rating.score;
    rating.comment = comment || rating.comment;
    await rating.save();

    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
