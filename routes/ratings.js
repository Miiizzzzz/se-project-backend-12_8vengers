const express = require('express');
const {
  addRating, getAllRatings, getAverageRating, updateRating,
} = require('../controllers/ratings');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, addRating);
router.get('/:coWorkingSpaceId', getAllRatings);
router.get('/average/:coWorkingSpaceId', getAverageRating);
router.put('/:ratingId', protect, updateRating);

module.exports = router;
