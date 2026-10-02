const mongoose = require('mongoose');

const deviceTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    userEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    endpoint: {
      type: String,
      required: [true, 'Device endpoint or token is required'],
      unique: true,
      trim: true,
    },
    keys: {
      p256dh: { type: String, default: '' },
      auth: { type: String, default: '' },
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'browser'],
      default: 'browser',
    },
    browser: {
      type: String,
      default: 'Chrome',
    },
    os: {
      type: String,
      default: 'Android',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

deviceTokenSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('DeviceToken', deviceTokenSchema);
