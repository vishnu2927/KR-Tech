const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mentor name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Mentor role is required'],
    },
    company: {
      type: String,
      default: 'Top Tech MNC',
    },
    experience: {
      type: String,
      default: '10+ Years',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    studentsMentored: {
      type: Number,
      default: 250,
    },
    skills: [
      {
        type: String,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com',
    },
    hourlyRate: {
      type: String,
      default: 'Free 1:1 Demo',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mentor', mentorSchema);
