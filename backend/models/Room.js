const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: [true, 'Room ID is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['batch', 'dsa', 'skills', 'tech', 'general'],
      default: 'general',
      index: true,
    },
    icon: {
      type: String,
      default: '💬',
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    activeUsersCount: {
      type: Number,
      default: 0,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    allowedRoles: {
      type: [String],
      default: ['student', 'mentor', 'admin'],
    },
    lastMessage: {
      text: { type: String, default: '' },
      senderName: { type: String, default: '' },
      timestamp: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
