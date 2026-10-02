const mongoose = require('mongoose');

const CourseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    completedLessons: [
      {
        type: String,
        trim: true,
      },
    ],
    completedAssignments: [
      {
        type: String,
        trim: true,
      },
    ],
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currentLesson: {
      type: String,
      default: 'Module 1: Architecture & Distributed Systems',
    },
    learningHours: {
      type: Number,
      default: 0,
    },
    weeklyActivity: [
      {
        day: { type: String, required: true }, // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
        hours: { type: Number, default: 0 },
      },
    ],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'course_progress',
  }
);

CourseProgressSchema.index({ user: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('CourseProgress', CourseProgressSchema);
