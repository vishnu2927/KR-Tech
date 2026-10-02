const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: [true, 'Room ID is required'],
      index: true,
    },
    sender: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String, default: '' },
      role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
      badge: { type: String, default: 'Member' },
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    codeSnippet: {
      language: { type: String, default: '' },
      code: { type: String, default: '' },
    },
    attachments: [
      {
        type: { type: String, default: 'link' },
        url: { type: String, default: '' },
        name: { type: String, default: '' },
      },
    ],
    reactions: [
      {
        emoji: { type: String },
        count: { type: Number, default: 0 },
        users: [{ type: String }], // user emails
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ room: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
