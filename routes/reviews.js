const express = require('express');
const router = express.Router();
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

router.get('/reservation/:reservationId', protect, getReviews);

router.get('/:reviewId', protect, getReview);

router.post('/:reservationId', protect, createReview);

router.put('/:reviewId', protect, updateReview);

router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
