const mongoose = require('mongoose');

const HighlightSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    color: { type: String, default: 'yellow' },
    position: { type: Number, default: 0 },
  },
  { _id: true }
);

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, default: 'Student' },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const NoteSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      default: 'General',
      trim: true,
      index: true,
    },
    courseId: {
      type: String,
      trim: true,
      default: '',
    },
    tags: [{ type: String, trim: true }],
    highlights: [HighlightSchema],
    comments: [CommentSchema],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    readingProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isOfflineAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'notes',
  }
);

NoteSchema.index({ userId: 1, folder: 1 });
NoteSchema.index({ userId: 1, isFavorite: 1 });
NoteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', NoteSchema);
