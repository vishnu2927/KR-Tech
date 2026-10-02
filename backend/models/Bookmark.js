const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
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
    targetType: {
      type: String,
      enum: ['note', 'lesson', 'timestamp', 'resource'],
      default: 'note',
    },
    targetId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    timestampSeconds: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'bookmarks',
  }
);

BookmarkSchema.index({ userId: 1, targetType: 1 });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
