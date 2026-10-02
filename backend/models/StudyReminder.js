const mongoose = require('mongoose');

const studyReminderSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    studentPhone: {
      type: String,
      default: '',
    },
    reminderType: {
      type: String,
      enum: ['daily_study', 'live_class', 'assignment', 'revision', 'streak_saver'],
      default: 'daily_study',
      index: true,
    },
    time: {
      type: String, // e.g. "20:00"
      default: '20:00',
    },
    days: [
      {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
    ],
    channel: {
      type: String,
      enum: ['push', 'email', 'whatsapp', 'all'],
      default: 'push',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    customMessage: {
      type: String,
      default: "Time for your KR Tech 1:1 coding session! Keep your learning streak burning 🔥",
    },
    lastSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

studyReminderSchema.index({ student: 1, isActive: 1 });

module.exports = mongoose.model('StudyReminder', studyReminderSchema);
