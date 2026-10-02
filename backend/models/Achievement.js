const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    badgeKey: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '🏆',
    },
    category: {
      type: String,
      enum: ['study_streak', 'quiz_master', 'assignment_hero', 'code_ninja', 'live_attendee', 'notes_scholar'],
      default: 'study_streak',
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    xpReward: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
    collection: 'achievements',
  }
);

AchievementSchema.index({ userId: 1, badgeKey: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', AchievementSchema);
