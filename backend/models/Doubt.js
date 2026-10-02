const mongoose = require('mongoose');

const DoubtSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    studentName: {
      type: String,
      default: 'Student',
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
    codeSnippet: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Full Stack Web Dev',
    },
    attachments: [
      {
        fileName: { type: String },
        fileUrl: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['open', 'answered_by_ai', 'mentor_verified', 'resolved'],
      default: 'open',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    aiAnswerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
    },
    answersCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'doubts',
  }
);

DoubtSchema.index({ category: 1, status: 1 });
DoubtSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Doubt', DoubtSchema);
