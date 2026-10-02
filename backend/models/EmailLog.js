const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      required: true,
      enum: [
        'welcome',
        'demo_booking',
        'payment_success',
        'certificate_delivery',
        'otp_reset',
        'general',
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ['sent', 'simulated', 'failed'],
      default: 'sent',
    },
    messageId: {
      type: String,
    },
    previewUrl: {
      type: String,
    },
    error: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'emailLogs',
  }
);

module.exports = mongoose.model('EmailLog', EmailLogSchema);
