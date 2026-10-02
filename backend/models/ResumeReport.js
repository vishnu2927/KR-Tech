const mongoose = require('mongoose');

const ResumeReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
      default: 'Senior Software Engineer',
    },
    targetCompany: {
      type: String,
      trim: true,
      default: 'Tier-1 Tech Product Companies',
    },
    resumeText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    matchRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },
    keywordAnalysis: {
      presentKeywords: [{ type: String }],
      missingKeywords: [{ type: String }],
      densityRating: { type: String, default: 'Optimal' },
    },
    formattingRating: {
      type: String,
      enum: ['Excellent', 'Good', 'Needs Improvement'],
      default: 'Good',
    },
    sectionScores: {
      summary: { type: Number, default: 80 },
      experience: { type: Number, default: 85 },
      skills: { type: Number, default: 90 },
      projects: { type: Number, default: 75 },
      education: { type: Number, default: 95 },
    },
    strengths: [{ type: String }],
    criticalFixes: [{ type: String }],
    suggestedSummary: {
      type: String,
      default: '',
    },
    actionableSuggestions: [{ type: String }],
  },
  {
    timestamps: true,
    collection: 'resume_reports',
  }
);

ResumeReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeReport', ResumeReportSchema);
