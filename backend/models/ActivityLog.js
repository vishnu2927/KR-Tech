const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    adminName: {
      type: String,
      default: 'Super Admin',
      trim: true,
    },
    adminRole: {
      type: String,
      enum: ['Super Admin', 'Admin', 'Mentor', 'Student Support', 'admin'],
      default: 'Super Admin',
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: [
        'Auth',
        'Student',
        'Course',
        'Lesson',
        'LiveClass',
        'Assignment',
        'Certificate',
        'Payment',
        'Coupon',
        'Email',
        'SupportTicket',
        'Role',
        'Settings',
        'Content',
        'System',
      ],
      index: true,
    },
    entityId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'WARNING'],
      default: 'SUCCESS',
    },
  },
  {
    timestamps: true,
    collection: 'activityLogs',
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ adminEmail: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema, 'activityLogs');
