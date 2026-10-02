const mongoose = require('mongoose');

const QuizQuestionItemSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
    default: -1,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  explanation: {
    type: String,
    default: '',
  },
});

const QuizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 5,
    },
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    passingPercentage: {
      type: Number,
      default: 70,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    questions: [QuizQuestionItemSchema],
  },
  {
    timestamps: true,
    collection: 'quiz_attempts',
  }
);

QuizAttemptSchema.index({ user: 1, createdAt: -1 });
QuizAttemptSchema.index({ topic: 1 });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
