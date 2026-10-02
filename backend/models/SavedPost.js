const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      index: true,
      lowercase: true,
      trim: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

savedPostSchema.index({ studentEmail: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('SavedPost', savedPostSchema);
