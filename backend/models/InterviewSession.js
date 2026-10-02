const mongoose = require('mongoose');

const InterviewQuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Technical Competency',
  },
  difficulty: {
    type: String,
    default: 'Intermediate',
  },
  studentAnswer: {
    type: String,
    default: '',
  },
  answeredAt: {
    type: Date,
    default: null,
  },
  aiFeedback: {
    score: { type: Number, min: 0, max: 10, default: 0 },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    idealAnswerSummary: { type: String, default: '' },
    evaluatedAt: { type: Date, default: null },
  },
});

const InterviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
      default: 'Full Stack Software Engineer',
    },
    interviewType: {
      type: String,
      enum: ['technical', 'hr', 'system_design', 'coding'],
      default: 'technical',
    },
    difficulty: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior', 'lead'],
      default: 'mid',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    questions: [InterviewQuestionSchema],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    skillVerdict: {
      type: String,
      enum: ['Advanced Mastery', 'Proficient', 'Intermediate', 'Needs More Practice', 'Pending'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    collection: 'interview_sessions',
  }
);

InterviewSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
