const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces&auto=format',
    },
    college: {
      type: String,
      default: 'Indian Institute of Technology (IIT) / NIT',
    },
    domain: {
      type: String,
      enum: ['Full Stack Java', 'Cloud & DevOps', 'Cyber Security', 'Data Engineering', 'Algorithms / Competitive Programming'],
      default: 'Full Stack Java',
      index: true,
    },
    weeklyRank: {
      type: Number,
      default: 1,
    },
    allTimeRank: {
      type: Number,
      default: 1,
    },
    totalPoints: {
      type: Number,
      default: 2450,
      index: true,
    },
    problemsSolved: {
      type: Number,
      default: 342,
    },
    contestsAttended: {
      type: Number,
      default: 18,
    },
    streakDays: {
      type: Number,
      default: 48,
    },
    badgesCount: {
      type: Number,
      default: 14,
    },
    recentBadges: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
    collection: 'leaderboards',
  }
);

LeaderboardSchema.index({ totalPoints: -1 });
LeaderboardSchema.index({ weeklyRank: 1 });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
