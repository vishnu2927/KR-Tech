const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema(
  {
    doubtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doubt',
      required: true,
      index: true,
    },
    authorType: {
      type: String,
      enum: ['ai', 'mentor', 'peer'],
      default: 'ai',
    },
    authorName: {
      type: String,
      default: 'KR AI Mentor',
    },
    authorAvatar: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerifiedMentorAnswer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'answers',
  }
);

AnswerSchema.index({ doubtId: 1, helpfulVotes: -1 });

module.exports = mongoose.model('Answer', AnswerSchema);
