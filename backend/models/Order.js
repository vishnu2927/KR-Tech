const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true,
      trim: true,
    },
    userName: {
      type: String,
      default: 'Student',
      trim: true,
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
    },
    courseTitle: {
      type: String,
      required: [true, 'Course title is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    receipt: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['created', 'attempted', 'paid', 'failed'],
      default: 'created',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
