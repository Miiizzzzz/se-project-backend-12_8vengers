const Review = require('../models/Review');
const mongoose = require('mongoose');

// @desc     Create or Update Review
// @route    POST /api/v1/reviews/
// @access   Private
exports.createReview = async (req, res, next) => {
  const { comment } = req.body;  // รับข้อมูลจาก body
  const { reservationId } = req.params;  // รับ reservationId จาก URL

  // ตรวจสอบให้แน่ใจว่า comment ไม่ว่าง
  if (!comment || comment.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a comment.',
    });
  }

  try {
    // สร้างรีวิวใหม่
    const newReview = await Review.create({
      reservationId,
      user: req.user.id, // สมมุติว่า req.user.id มีข้อมูลผู้ใช้จาก authentication
      comment,
      // คุณสามารถเพิ่มข้อมูลอื่น ๆ เช่น rating หากต้องการ
    });

    return res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// @desc    Get all reviews for a reservation
// @route   GET /api/v1/reviews/reservation/:reservationId
// @access  Private
exports.getReviews = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reviews = await Review.find({
      reservationId: new mongoose.Types.ObjectId(reservationId),
    });

    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a review
// @route   POST /api/v1/reviews/:reservationId
// @access  Private
exports.createReview = async (req, res) => {
  const { comment } = req.body;
  const { reservationId } = req.params;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please provide a comment.' });
  }

  try {
    const existing = await Review.findOne({
      reservationId,
      user: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already reviewed this reservation.' });
    }

    const review = await Review.create({
      reservationId,
      user: req.user.id,
      comment,
    });

    return res.status(201).json({ success: true, data: review });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Edit a review
// @route   PUT /api/v1/reviews/:reviewId
// @access  Private
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { comment } = req.body;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please provide a comment.' });
  }

  try {
    const review = await Review.findOne({
      _id: reviewId,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized.' });
    }

    review.comment = comment;
    await review.save();

    return res.status(200).json({ success: true, data: review });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findOne({
      _id: reviewId,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized.' });
    }

    await review.deleteOne();

    return res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
