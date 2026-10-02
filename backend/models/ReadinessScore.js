const mongoose = require('mongoose');

const readinessScoreSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    overallReadinessPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 72,
    },
    dsaScore: {
      type: Number,
      default: 75,
    },
    systemDesignScore: {
      type: Number,
      default: 68,
    },
    resumeScore: {
      type: Number,
      default: 85,
    },
    mockInterviewScore: {
      type: Number,
      default: 78,
    },
    targetTier: {
      type: String,
      enum: ['Tier-1 MAANG', 'Product Unicorn', 'Enterprise IT', 'High-Growth Startup'],
      default: 'Tier-1 MAANG',
    },
    verdict: {
      type: String,
      default: 'Interview Ready for Top 10% Tech Companies',
    },
    recommendedActions: [
      {
        area: { type: String },
        action: { type: String },
        impact: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ReadinessScore', readinessScoreSchema);
