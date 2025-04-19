const express = require('express');
const {
  getReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation,
  rateReservation,
  getAverageRating // เพิ่มฟังก์ชันนี้เข้ามา
} = require('../controllers/reservations');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

// Routes
router.route('/')
    .get(protect, getReservations)
    .post(protect, authorize('admin','user'), addReservation);
router.route('/:id')
    .get(protect, getReservation)
    .put(protect, authorize('admin','user'), updateReservation)
    .delete(protect, authorize('admin','user'), deleteReservation);

router.route('/:id')
  .get(protect, getReservation)
  .put(protect, authorize('admin', 'user'), updateReservation)
  .delete(protect, authorize('admin', 'user'), deleteReservation);

router.route('/:id/rate')
  .patch(protect, authorize('admin', 'user'), rateReservation);


router.route('/average/:id').get(protect,authorize('admin', 'user'), getAverageRating); 
 

module.exports = router;
