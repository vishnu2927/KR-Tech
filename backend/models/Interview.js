const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      index: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['technical', 'hr', 'system_design'],
      default: 'technical',
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: 'Software Development Engineer (SDE-1)',
    },
    targetCompany: {
      type: String,
      default: 'Google',
    },
    difficulty: {
      type: String,
      enum: ['Junior', 'Mid-Level', 'Senior', 'Staff'],
      default: 'Junior',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    questions: [
      {
        questionId: { type: String },
        questionText: { type: String, required: true },
        category: { type: String, default: 'Core CS' },
        idealAnswer: { type: String },
        studentAnswer: { type: String, default: '' },
        audioTranscript: { type: String, default: '' },
        feedback: { type: String, default: '' },
        score: { type: Number, default: 0 }, // 0 - 100
        technicalAccuracy: { type: Number, default: 0 },
        communicationClarity: { type: Number, default: 0 },
        fillerWordCount: { type: Number, default: 0 },
        sentiment: { type: String, default: 'neutral' },
        answeredAt: { type: Date },
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    technicalAccuracy: {
      type: Number,
      default: 0,
    },
    communicationScore: {
      type: Number,
      default: 0,
    },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ studentEmail: 1, createdAt: -1 });

module.exports = mongoose.model('Interview', interviewSchema);
