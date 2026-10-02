const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AIChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    mentorPersona: {
      type: String,
      enum: ['fullstack', 'cloud_devops', 'system_design', 'cybersecurity', 'dsa', 'general'],
      default: 'general',
    },
    topic: {
      type: String,
      default: 'General Technical Discussion',
    },
    messages: [ChatMessageSchema],
    metadata: {
      tokensUsed: { type: Number, default: 0 },
      modelUsed: { type: String, default: 'gpt-4o-mini' },
      source: { type: String, default: 'krtech_ai_mentor' },
    },
  },
  {
    timestamps: true,
    collection: 'ai_chats',
  }
);

AIChatSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('AIChat', AIChatSchema);
