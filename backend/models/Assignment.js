const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    studentName: {
      type: String,
      default: 'Student',
    },
    githubUrl: {
      type: String,
      required: true,
      trim: true,
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'resubmission_requested'],
      default: 'submitted',
    },
    grade: {
      type: String,
      default: 'Pending Evaluation',
    },
    score: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: 'Our senior mentor will review code modularity, test coverage, and documentation.',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
  },
  { _id: true }
);

const AssignmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    moduleTitle: {
      type: String,
      default: 'Capstone Module',
    },
    deadline: {
      type: String,
      default: 'Sunday, 11:59 PM IST',
    },
    maxScore: {
      type: Number,
      default: 100,
    },
    requirements: [
      {
        type: String,
      },
    ],
    starterRepoUrl: {
      type: String,
      default: 'https://github.com/krtech-academy/capstone-starter',
    },
    submissions: [SubmissionSchema],
  },
  {
    timestamps: true,
    collection: 'assignments',
  }
);

module.exports = mongoose.model('Assignment', AssignmentSchema);
