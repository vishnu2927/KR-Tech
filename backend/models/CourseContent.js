const mongoose = require('mongoose');

const CourseContentSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      default: '',
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: String,
      default: '45 hours',
    },
    modules: [
      {
        moduleNumber: Number,
        title: String,
        lessonsCount: Number,
        duration: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'course_contents',
  }
);

module.exports = mongoose.model('CourseContent', CourseContentSchema);
