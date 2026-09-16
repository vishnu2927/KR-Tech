const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
    },
    completionDate: {
      type: String,
      required: [true, 'Completion date is required'],
    },
    credentialId: {
      type: String,
      required: [true, 'Credential ID is required'],
      unique: true,
    },
    grade: {
      type: String,
      default: 'Grade A+ (96%)',
    },
    skills: [
      {
        type: String,
      },
    ],
    verified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certificate', certificateSchema);
