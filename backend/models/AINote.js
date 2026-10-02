const mongoose = require('mongoose');

const AINoteSchema = new mongoose.Schema(
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
    course: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String,
      enum: ['short', 'detailed', 'bullet', 'exam', 'interview'],
      default: 'detailed',
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
    summary: {
      type: String,
      default: '',
    },
    keyTerms: [
      {
        term: { type: String },
        definition: { type: String },
      },
    ],
    tags: [{ type: String }],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    readTimeMinutes: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
    collection: 'aiNotes',
  }
);

AINoteSchema.index({ userId: 1, course: 1, topic: 1 });

module.exports = mongoose.model('AINote', AINoteSchema);
