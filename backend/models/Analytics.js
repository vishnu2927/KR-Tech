const mongoose = require('mongoose');

const DailyStudyDataSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    hoursStudied: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    quizzesAttempted: { type: Number, default: 0 },
    quizAccuracy: { type: Number, default: 0 },
  },
  { _id: false }
);

const AnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    totalHoursStudied: {
      type: Number,
      default: 0,
    },
    totalLessonsCompleted: {
      type: Number,
      default: 0,
    },
    totalQuizzesAttempted: {
      type: Number,
      default: 0,
    },
    overallQuizAccuracy: {
      type: Number,
      default: 0,
    },
    totalAssignmentsSubmitted: {
      type: Number,
      default: 0,
    },
    averageAssignmentScore: {
      type: Number,
      default: 0,
    },
    courseCompletionPercent: {
      type: Number,
      default: 0,
    },
    weeklyProgress: [
      {
        week: { type: String },
        hours: { type: Number },
        targetHours: { type: Number },
        completionRate: { type: Number },
      },
    ],
    monthlyProgress: [
      {
        month: { type: String },
        lessonsCount: { type: Number },
        quizAvg: { type: Number },
        hours: { type: Number },
      },
    ],
    dailyTelemetry: [DailyStudyDataSchema],
    aiRecommendations: [
      {
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        recommendation: { type: String, required: true },
        actionUrl: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'analytics',
  }
);

module.exports = mongoose.model('Analytics', AnalyticsSchema);
