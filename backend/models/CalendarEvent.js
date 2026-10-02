const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    eventType: {
      type: String,
      enum: ['live_class', 'assignment_due', 'exam', 'workshop', 'office_hours', 'other'],
      default: 'live_class',
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    liveSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    meetingLink: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Online',
    },
    color: {
      type: String,
      default: '#00f0ff',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly', 'none'],
      default: 'none',
    },
  },
  {
    timestamps: true,
    collection: 'calendar_events',
  }
);

CalendarEventSchema.index({ startTime: 1, endTime: 1 });
CalendarEventSchema.index({ course: 1, startTime: 1 });

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);
