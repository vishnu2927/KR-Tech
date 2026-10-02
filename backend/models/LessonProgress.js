const mongoose = require('mongoose');

const VideoNoteSchema = new mongoose.Schema(
  {
    timestampSeconds: { type: Number, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const VideoBookmarkSchema = new mongoose.Schema(
  {
    timestampSeconds: { type: Number, required: true },
    title: { type: String, default: 'Bookmark' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const LessonProgressSchema = new mongoose.Schema(
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
    courseId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lessonId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lessonTitle: {
      type: String,
      default: '',
    },
    watchedSeconds: {
      type: Number,
      default: 0,
    },
    totalDurationSeconds: {
      type: Number,
      default: 900,
    },
    lastPlaybackSpeed: {
      type: Number,
      default: 1.0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    notes: [VideoNoteSchema],
    bookmarks: [VideoBookmarkSchema],
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'lessonProgress',
  }
);

LessonProgressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', LessonProgressSchema);
