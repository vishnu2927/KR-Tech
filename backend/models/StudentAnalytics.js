const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Engineering' },
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: Date, default: null },
    progressPercent: { type: Number, default: 0 },
    criteria: { type: String, default: '' },
  },
  { _id: false }
);

const attendanceHistorySchema = new mongoose.Schema(
  {
    sessionId: { type: String },
    topic: { type: String, required: true },
    mentorName: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Excused'], default: 'Present' },
    sessionType: { type: String, default: '1:1 Live Coding' },
  },
  { _id: false }
);

const xpActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    xp: { type: Number, required: true },
    type: { type: String, enum: ['lecture', 'assignment', 'streak', 'attendance', 'badge', 'bonus'], default: 'lecture' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const studentAnalyticsSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    userName: {
      type: String,
      default: 'Aditya Sharma',
      trim: true,
    },
    xp: {
      type: Number,
      default: 3850,
      min: 0,
    },
    level: {
      type: Number,
      default: 8,
      min: 1,
    },
    levelTitle: {
      type: String,
      default: 'Senior Systems Builder',
    },
    streak: {
      current: { type: Number, default: 5 },
      longest: { type: Number, default: 18 },
      lastActiveDate: { type: Date, default: Date.now },
      weeklyDays: {
        type: [String],
        default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      },
    },
    attendance: {
      attendedSessions: { type: Number, default: 16 },
      totalSessions: { type: Number, default: 17 },
      attendanceRate: { type: Number, default: 94.1 },
      history: [attendanceHistorySchema],
    },
    badges: [badgeSchema],
    xpActivities: [xpActivitySchema],
  },
  {
    timestamps: true,
    collection: 'student_analytics',
  }
);

module.exports = mongoose.model('StudentAnalytics', studentAnalyticsSchema);
