const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    sessionDate: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['pomodoro', 'revision', 'practice', 'reading', 'live_class'],
      default: 'pomodoro',
    },
    durationMinutes: {
      type: Number,
      default: 25,
    },
    completedPomodoros: {
      type: Number,
      default: 1,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
    productivityScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
    collection: 'studySessions',
  }
);

StudySessionSchema.index({ userId: 1, sessionDate: -1 });

module.exports = mongoose.model('StudySession', StudySessionSchema);
