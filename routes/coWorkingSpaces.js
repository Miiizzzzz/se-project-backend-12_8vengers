const express = require('express');
const {getCoWorkingSpaces, 
    getCoWorkingSpace, 
    createCoWorkingSpace, 
    updateCoWorkingSpace, 
    deleteCoWorkingSpace} = require('../controllers/coWorkingSpaces');

//Include others resource routers
const reservationRouter = require('./reservations');

const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:coWorkingSpaceId/reservations/', reservationRouter);

router.route('/').get(protect, getCoWorkingSpaces).post(protect, authorize('admin'), createCoWorkingSpace);
router.route('/:id').get(protect, getCoWorkingSpace).put(protect, authorize('admin'), updateCoWorkingSpace).delete(protect, authorize('admin'), deleteCoWorkingSpace);

module.exports = router; 

