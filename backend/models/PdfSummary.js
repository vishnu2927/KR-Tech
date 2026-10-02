const mongoose = require('mongoose');

const PdfSummarySchema = new mongoose.Schema(
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
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileSizeKb: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      required: true,
    },
    importantPoints: [{ type: String }],
    keywords: [
      {
        term: { type: String },
        definition: { type: String },
      },
    ],
    flashcards: [
      {
        front: { type: String },
        back: { type: String },
      },
    ],
    quiz: [
      {
        question: { type: String },
        options: [{ type: String }],
        answer: { type: String },
        explanation: { type: String },
      },
    ],
    mindMapData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'pdfSummaries',
  }
);

PdfSummarySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('PdfSummary', PdfSummarySchema);
