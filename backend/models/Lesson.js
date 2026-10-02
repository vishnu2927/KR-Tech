const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    moduleId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    moduleTitle: {
      type: String,
      default: 'Core Module',
      trim: true,
    },
    lessonNumber: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      default: '15:00',
    },
    durationSeconds: {
      type: Number,
      default: 900,
    },
    videoUrl: {
      type: String,
      required: true,
      default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    description: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: 'pdf' },
      },
    ],
    isFreePreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    collection: 'lessons',
  }
);

LessonSchema.index({ courseId: 1, lessonNumber: 1 });

module.exports = mongoose.model('Lesson', LessonSchema);
