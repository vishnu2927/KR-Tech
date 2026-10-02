const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a batch name'],
      trim: true,
    },
    batchCode: {
      type: String,
      required: [true, 'Please provide a unique batch code'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    courseId: {
      type: String,
      required: [true, 'Please select or provide a course ID'],
      default: 'mern-fullstack-pro',
    },
    courseTitle: {
      type: String,
      default: 'Full Stack Web Development & System Design',
    },
    mentorId: {
      type: String,
      default: 'mentor-01',
    },
    mentorName: {
      type: String,
      required: [true, 'Please assign a primary mentor'],
      default: 'Rajesh Kumar (Principal Technical Architect)',
    },
    mentorEmail: {
      type: String,
      default: 'rajesh.mentor@krtech.in',
    },
    students: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: '' },
        enrolledAt: { type: Date, default: Date.now },
        attendancePercent: { type: Number, default: 100 },
      },
    ],
    zoomLink: {
      type: String,
      default: 'https://zoom.us/j/krtech-live-classroom',
    },
    schedule: {
      days: {
        type: [String],
        default: ['Mon', 'Wed', 'Fri'],
      },
      time: {
        type: String,
        default: '07:30 PM - 09:30 PM IST',
      },
      startDate: {
        type: Date,
        default: () => new Date(),
      },
      endDate: {
        type: Date,
        default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    },
    capacity: {
      type: Number,
      default: 60,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    description: {
      type: String,
      default: 'High-intensity live mentorship cohort with real-world production capstones.',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for enrolled count
batchSchema.virtual('enrolledCount').get(function () {
  return this.students ? this.students.length : 0;
});

module.exports = mongoose.models.Batch || mongoose.model('Batch', batchSchema);
