const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema(
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
    deckName: {
      type: String,
      default: 'General Computer Science',
      trim: true,
      index: true,
    },
    front: {
      type: String,
      required: true,
      trim: true,
    },
    back: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ['lesson', 'pdf', 'notes', 'quiz_mistakes', 'custom'],
      default: 'notes',
    },
    difficultyRating: {
      type: String,
      enum: ['again', 'hard', 'good', 'easy'],
      default: 'good',
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    intervalDays: {
      type: Number,
      default: 1,
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'flashcards',
  }
);

FlashcardSchema.index({ userId: 1, nextReviewDate: 1 });
FlashcardSchema.index({ userId: 1, isFavorite: 1 });

module.exports = mongoose.model('Flashcard', FlashcardSchema);
