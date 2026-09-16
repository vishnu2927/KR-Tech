const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide lead name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide lead email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Please specify the interested course'],
    },
    preferredTime: {
      type: String,
      default: 'Evening (6:00 PM - 9:00 PM)',
    },
    timeZone: {
      type: String,
      default: 'IST (UTC+5:30)',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Scheduled', 'Completed'],
      default: 'New',
    },
    notes: {
      type: String,
      default: '',
    },
    bookingId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
