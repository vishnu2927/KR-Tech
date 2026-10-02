const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    badgeId: {
      type: String,
      required: [true, 'Badge ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '🏆',
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'bronze',
    },
    category: {
      type: String,
      enum: ['dsa', 'community', 'learning', 'skills'],
      default: 'community',
    },
    xp: {
      type: Number,
      default: 100,
    },
    criteria: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Badge', badgeSchema);
