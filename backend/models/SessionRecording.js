const mongoose = require('mongoose');

const SessionRecordingSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
      index: true,
    },
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
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    recordingUrl: {
      type: String,
      required: [true, 'Recording URL is required'],
      trim: true,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    fileSize: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      enum: ['mp4', 'webm', 'mkv', 'other'],
      default: 'mp4',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    mentorNotes: {
      type: String,
      default: '',
      maxlength: 5000,
    },
    attachments: [{
      name: { type: String, trim: true },
      url: { type: String, trim: true },
      type: { type: String, default: 'document' },
    }],
    viewCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'session_recordings',
  }
);

SessionRecordingSchema.index({ course: 1, createdAt: -1 });

module.exports = mongoose.model('SessionRecording', SessionRecordingSchema);
