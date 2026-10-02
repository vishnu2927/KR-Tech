const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      index: true,
      lowercase: true,
      trim: true,
    },
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'cpp', 'java'],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
      required: true,
      index: true,
    },
    runtimeMs: {
      type: Number,
      default: 0,
    },
    memoryKb: {
      type: Number,
      default: 0,
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    testResults: [
      {
        testCase: { type: Number },
        input: { type: String },
        expectedOutput: { type: String },
        actualOutput: { type: String },
        passed: { type: Boolean },
      },
    ],
  },
  {
    timestamps: true,
  }
);

codingSubmissionSchema.index({ studentEmail: 1, problemId: 1, status: 1 });

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
