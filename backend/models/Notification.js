const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['announcement', 'course_reminder', 'demo_reminder', 'system'],
      default: 'announcement',
      index: true,
    },
    recipient: {
      type: String,
      default: 'all', // 'all' or specific user email / ID
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ['all', 'student', 'admin'],
      default: 'all',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readBy: [
      {
        type: String, // User ID or email for broadcast notifications
      },
    ],
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    actionUrl: {
      type: String,
      default: '',
    },
    metadata: {
      courseId: { type: String },
      courseTitle: { type: String },
      batch: { type: String },
      scheduledTime: { type: String },
      mentorName: { type: String },
    },
    createdBy: {
      name: { type: String, default: 'KR Tech Administration' },
      role: { type: String, default: 'Admin' },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying recent notifications by recipient and status
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
