const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
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
      default: 'Administrator',
      trim: true,
    },
    adminRole: {
      type: String,
      default: 'admin',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'UPDATE_STUDENT',
        'CREATE_COUPON',
        'RESOLVE_TICKET',
        'UPDATE_TICKET',
        'REFUND_PAYMENT',
        'SYSTEM_BROADCAST',
        'EXPORT_REPORT',
        'SCHEDULE_SESSION',
        'UPDATE_COURSE',
        'SECURITY_CHANGE',
      ],
      index: true,
    },
    targetEntity: {
      type: String,
      required: true,
      enum: ['Student', 'Payment', 'Course', 'Ticket', 'Lead', 'Mentor', 'System'],
      index: true,
    },
    targetId: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'WARNING'],
      default: 'SUCCESS',
    },
  },
  {
    timestamps: true,
  }
);

adminLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);
