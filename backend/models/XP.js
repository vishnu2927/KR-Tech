const mongoose = require('mongoose');

const XpHistoryItemSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    xpEarned: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const XPSchema = new mongoose.Schema(
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
    studentName: {
      type: String,
      default: 'Student',
    },
    totalXp: {
      type: Number,
      default: 0,
      index: true,
    },
    currentLevel: {
      type: Number,
      default: 1,
    },
    levelTitle: {
      type: String,
      default: 'Apprentice Coder',
    },
    dailyStreak: {
      type: Number,
      default: 1,
    },
    longestStreak: {
      type: Number,
      default: 1,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
    history: [XpHistoryItemSchema],
  },
  {
    timestamps: true,
    collection: 'xp',
  }
);

XPSchema.index({ totalXp: -1 });

module.exports = mongoose.model('XP', XPSchema);
