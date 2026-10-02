const mongoose = require('mongoose');

const CodeSnippetSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled Snippet',
    },
    language: {
      type: String,
      enum: ['java', 'python', 'cpp', 'javascript', 'html_css', 'nodejs'],
      required: true,
      default: 'javascript',
    },
    code: {
      type: String,
      required: true,
    },
    stdin: {
      type: String,
      default: '',
    },
    lastOutput: {
      type: String,
      default: '',
    },
    lastError: {
      type: String,
      default: '',
    },
    aiExplanation: {
      type: String,
      default: '',
    },
    aiOptimization: {
      type: String,
      default: '',
    },
    tags: [{ type: String, trim: true }],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'codeSnippets',
  }
);

CodeSnippetSchema.index({ userId: 1, language: 1 });

module.exports = mongoose.model('CodeSnippet', CodeSnippetSchema);
