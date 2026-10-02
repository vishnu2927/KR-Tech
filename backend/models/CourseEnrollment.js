const mongoose = require('mongoose');

const CourseEnrollmentSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Software Engineering',
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format',
    },
    mentor: {
      type: String,
      default: 'Senior Technical Architect',
    },
    mentorCompany: {
      type: String,
      default: 'Principal Technical Architect · Staff Architect',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'course_enrollments',
  }
);

CourseEnrollmentSchema.index({ user: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('CourseEnrollment', CourseEnrollmentSchema);
