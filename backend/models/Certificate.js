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
    studentEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    completionDate: {
      type: String,
      required: [true, 'Completion date is required'],
    },
    credentialId: {
      type: String,
      required: [true, 'Credential ID is required'],
      unique: true,
      trim: true,
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
    qrCodeDataUrl: {
      type: String,
    },
    pdfUrl: {
      type: String,
    },
    issuer: {
      type: String,
      default: 'KR GLOBAL LEARNING PRIVATE LIMITED',
    },
    accreditation: {
      type: String,
      default: 'KR Global Learning Verified Training Credential',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certificate', certificateSchema);
