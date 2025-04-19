const Review = require('../models/Review');
const mongoose = require('mongoose'); // เพิ่มถ้ายังไม่มี

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
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Get Review by Reservation ID
// @route   GET /api/v1/reviews/rid
// @access  Private
exports.getReview = async (req, res) => {
  try {
    const { reservationId } = req.params;

    if (!reservationId) {
      return res.status(400).json({ success: false, message: "reservationId is required" });
    }

    const review = await Review.find({
      reservationId: new mongoose.Types.ObjectId(reservationId),
    });

    if (review.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// @desc     Edit Review
// @route    PUT /api/v1/reviews/:reservationId
// @access   Private
exports.editReview = async (req, res) => {
  const { comment } = req.body;
  const { reviewId } = req.params;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please provide a comment.' });
  }

  try {
    const review = await Review.findOne({
      _id: new mongoose.Types.ObjectId(reviewId),
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    review.comment = comment;
    await review.save();

    return res.status(200).json({ success: true, data: review });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

