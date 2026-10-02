const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
      index: true,
    },
    author: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String, default: '' },
      role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
      badge: { type: String, default: 'Peer Helper' },
      isMentor: { type: Boolean, default: false },
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    codeSnippet: {
      language: { type: String, default: 'javascript' },
      code: { type: String, default: '' },
    },
    upvotes: [
      {
        type: String, // user email
      },
    ],
    upvotesCount: {
      type: Number,
      default: 0,
    },
    isAcceptedAnswer: {
      type: Boolean,
      default: false,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ post: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);
