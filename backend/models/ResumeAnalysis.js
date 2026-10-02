const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      index: true,
      lowercase: true,
      trim: true,
    },
    targetRole: {
      type: String,
      default: 'Full Stack Engineer',
    },
    targetCompany: {
      type: String,
      default: 'Top Tech Product Companies',
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    formatScore: {
      type: Number,
      default: 85,
    },
    keywordScore: {
      type: Number,
      default: 80,
    },
    experienceScore: {
      type: Number,
      default: 75,
    },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    formattingIssues: [{ type: String }],
    bulletPointRewrites: [
      {
        original: { type: String },
        improved: { type: String },
        metricAdded: { type: String },
      },
    ],
    suggestedSummary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

resumeAnalysisSchema.index({ studentEmail: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
