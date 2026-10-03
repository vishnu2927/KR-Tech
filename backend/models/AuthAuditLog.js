const mongoose = require('mongoose');

const authAuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'LOGOUT',
        'LOGOUT_ALL',
        'SESSION_REVOKED',
        'PASSWORD_RESET_REQUEST',
        'PASSWORD_RESET_SUCCESS',
        'GOOGLE_OAUTH_SUCCESS',
        'GOOGLE_OAUTH_LINKED',
        'GOOGLE_OAUTH_FAILED',
        'SUSPICIOUS_ATTEMPT',
        'ADMIN_ACCESS_DENIED',
      ],
      index: true,
    },
    role: {
      type: String,
      default: 'student',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    deviceInfo: {
      type: String,
      default: 'Unknown Device',
    },
    browser: String,
    os: String,
    success: {
      type: Boolean,
      default: true,
    },
    details: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'auth_audit_logs',
  }
);

authAuditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuthAuditLog', authAuditLogSchema);
