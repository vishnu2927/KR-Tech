const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    userName: {
      type: String,
      trim: true,
      default: 'Student',
    },
    courseId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    courseTitle: {
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
      default: 'KR Global Learning Senior Faculty',
    },
    batch: {
      type: String,
      default: 'Batch-2026 (Live One-on-One)',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
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
    collection: 'enrollments',
  }
);

EnrollmentSchema.index({ userEmail: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
