const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
      index: true,
    },
    mentorName: {
      type: String,
      trim: true,
      default: '',
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date/time is required'],
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
      min: 15,
      max: 480,
    },
    platform: {
      type: String,
      enum: ['zoom', 'google_meet', 'teams', 'custom'],
      default: 'zoom',
    },
    meetingLink: {
      type: String,
      trim: true,
      default: '',
    },
    meetingId: {
      type: String,
      trim: true,
      default: '',
    },
    meetingPassword: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    maxAttendees: {
      type: Number,
      default: 100,
      min: 1,
    },
    topics: [{
      type: String,
      trim: true,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    thumbnail: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reminderSent24h: {
      type: Boolean,
      default: false,
    },
    reminderSent30m: {
      type: Boolean,
      default: false,
    },
    attendeeCount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'live_sessions',
  }
);

LiveSessionSchema.index({ scheduledAt: 1, status: 1 });
LiveSessionSchema.index({ course: 1, scheduledAt: -1 });

module.exports = mongoose.model('LiveSession', LiveSessionSchema);
