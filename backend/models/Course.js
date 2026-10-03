const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
    },
    categoryGroup: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    duration: {
      type: String,
      default: '80 Hours',
    },
    durationHours: {
      type: Number,
      default: 80,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Intermediate',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    studentsCount: {
      type: Number,
      default: 120,
    },
    highlights: [
      {
        type: String,
      },
    ],
    price: {
      type: mongoose.Schema.Types.Mixed,
      default: 599,
    },
    originalPrice: {
      type: mongoose.Schema.Types.Mixed,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// High-Performance Query Indexes (Note: `id` already indexed via unique: true)
courseSchema.index({ category: 1 });
courseSchema.index({ categoryGroup: 1 });
courseSchema.index({ isPopular: 1, rating: -1 });
courseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Course', courseSchema);
