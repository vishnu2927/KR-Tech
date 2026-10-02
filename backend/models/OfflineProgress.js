const mongoose = require('mongoose');

const offlineProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      index: true,
    },
    lessonId: {
      type: String,
      required: [true, 'Lesson ID is required'],
    },
    moduleNumber: {
      type: Number,
      default: 1,
    },
    durationWatchedSeconds: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
      default: null,
    },
    offlineTimestamp: {
      type: Date,
      default: Date.now,
    },
    syncedAt: {
      type: Date,
      default: Date.now,
    },
    deviceInfo: {
      type: String,
      default: 'PWA Offline Client',
    },
  },
  {
    timestamps: true,
  }
);

offlineProgressSchema.index({ student: 1, courseId: 1, lessonId: 1 });

module.exports = mongoose.model('OfflineProgress', offlineProgressSchema);
