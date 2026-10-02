const mongoose = require('mongoose');

const communityNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: [true, 'Recipient email is required'],
      index: true,
      lowercase: true,
      trim: true,
    },
    sender: {
      name: { type: String, default: 'KR Tech Community' },
      avatar: { type: String, default: '' },
      role: { type: String, default: 'member' },
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'mention', 'badge_earned', 'mentor_reply', 'announcement', 'message'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '/community',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

communityNotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityNotification', communityNotificationSchema);
