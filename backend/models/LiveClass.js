const mongoose = require('mongoose');

const LiveClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: String,
      default: '',
      trim: true,
    },
    instructorName: {
      type: String,
      default: 'Rajesh Kumar (Senior Staff Mentor)',
      trim: true,
    },
    instructorAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces&auto=format',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 90,
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/krtech-live-pair',
    },
    recordingUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    attendanceCount: {
      type: Number,
      default: 0,
    },
    resources: [
      {
        title: { type: String },
        url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'liveClasses',
  }
);

LiveClassSchema.index({ scheduledAt: 1, status: 1 });

module.exports = mongoose.model('LiveClass', LiveClassSchema);
