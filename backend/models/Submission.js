const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      index: true,
    },
    courseId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
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
    fileUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'graded', 'resubmission_requested'],
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
      default: 'Under review by our Principal Engineering Mentor.',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'submissions',
  }
);

SubmissionSchema.index({ userEmail: 1, assignmentId: 1 });

module.exports = mongoose.model('Submission', SubmissionSchema);
