const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['general', 'dsa', 'certifications', 'webdev', 'tech', 'ai', 'mentor_qa', 'announcement'],
      default: 'general',
      index: true,
    },
    author: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true, index: true },
      avatar: { type: String, default: '' },
      role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
      badge: { type: String, default: 'Code Explorer' },
      isMentor: { type: Boolean, default: false },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
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
      index: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    isAnnouncement: {
      type: Boolean,
      default: false,
      index: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    dsaDifficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', ''],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ upvotesCount: -1, createdAt: -1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema);
