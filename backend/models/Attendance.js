const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['present', 'late', 'absent', 'excused'],
      default: 'present',
    },
    deviceInfo: {
      type: String,
      default: 'Unknown',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'attendance',
  }
);

// Compound index to prevent duplicate attendance records
AttendanceSchema.index({ session: 1, student: 1 }, { unique: true });
AttendanceSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
