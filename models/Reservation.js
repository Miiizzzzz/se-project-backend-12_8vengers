const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    reserveDate :{
        type: Date,
        required:true,
    },
    user :{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require:true
    },
    coWorkingSpace :{
        type: mongoose.Schema.ObjectId,
        ref: 'CoWorkingSpace',
        required:true
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
      }
});

module.exports = mongoose.model('Reservation',ReservationSchema);