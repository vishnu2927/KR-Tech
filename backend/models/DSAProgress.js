const mongoose = require('mongoose');

const dsaProgressSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    totalSolved: {
      type: Number,
      default: 0,
    },
    easyCount: {
      type: Number,
      default: 0,
    },
    mediumCount: {
      type: Number,
      default: 0,
    },
    hardCount: {
      type: Number,
      default: 0,
    },
    topicsMastered: [
      {
        topic: { type: String },
        solved: { type: Number, default: 0 },
        totalAvailable: { type: Number, default: 20 },
      },
    ],
    streakDays: {
      type: Number,
      default: 0,
    },
    lastSolvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DSAProgress', dsaProgressSchema);
