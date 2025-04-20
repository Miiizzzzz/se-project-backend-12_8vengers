const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    // อ้างอิงถึงผู้ใช้ที่เขียนรีวิว (เชื่อมกับ User model)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // อ้างอิงถึงการจอง (เชื่อมกับ Reservation model)
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true
    },
    coWorkingSpaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CoWorkingSpace',
      required: true
    },
    // ข้อความรีวิว
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500 // จำกัดความยาวของรีวิว
    }, 
  },
  {
    timestamps: true, // สร้างฟิลด์ createdAt และ updatedAt อัตโนมัติ
  }
);

// สร้างและ export โมเดล Review
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
