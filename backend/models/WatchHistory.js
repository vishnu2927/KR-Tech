const mongoose = require('mongoose');

const WatchHistorySchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    lectureId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    courseId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lectureTitle: {
      type: String,
      required: true,
      trim: true,
    },
    courseTitle: {
      type: String,
      default: '',
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    instructor: {
      type: String,
      default: '',
    },
    watchedSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    durationSeconds: {
      type: Number,
      default: 2700, // 45 mins default
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    personalNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'watch_history',
  }
);

WatchHistorySchema.index({ userEmail: 1, lectureId: 1 }, { unique: true });
WatchHistorySchema.index({ userEmail: 1, completed: 1, lastWatchedAt: -1 });

module.exports = mongoose.model('WatchHistory', WatchHistorySchema);
