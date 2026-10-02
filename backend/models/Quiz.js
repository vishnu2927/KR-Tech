const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'true_false', 'fill_blanks', 'coding', 'subjective'],
      default: 'mcq',
    },
    options: [{ type: String }],
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    starterCode: {
      type: String,
      default: '',
    },
    rubric: {
      type: String,
      default: '',
    },
    marks: {
      type: Number,
      default: 10,
    },
  },
  { _id: true }
);

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    courseId: {
      type: String,
      default: '',
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ['lesson', 'pdf', 'topic', 'custom'],
      default: 'topic',
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
    questionCount: {
      type: Number,
      default: 5,
    },
    questions: [QuestionSchema],
    totalMarks: {
      type: Number,
      default: 50,
    },
    passingScore: {
      type: Number,
      default: 35,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'quizzes',
  }
);

QuizSchema.index({ topic: 1, difficulty: 1 });

module.exports = mongoose.model('Quiz', QuizSchema);
