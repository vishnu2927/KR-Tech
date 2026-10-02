const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    moduleNumber: {
      type: Number,
      default: 1,
    },
    moduleTitle: {
      type: String,
      required: true,
      trim: true,
    },
    lectureNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '45 mins',
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    videoUrl: {
      type: String,
      default: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', // or placeholder video stream
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop&auto=format',
    },
    notesUrl: {
      type: String,
      default: 'https://krtech.edu/downloads/lecture-notes-sample.pdf',
    },
    notesFileName: {
      type: String,
      default: 'Lecture_Architectural_Notes.pdf',
    },
    recordedDate: {
      type: String,
      default: 'Recent Session',
    },
    instructor: {
      type: String,
      default: 'Senior Technical Architect',
    },
    tags: [
      {
        type: String,
      },
    ],
    chapters: [
      {
        id: { type: String },
        title: { type: String, required: true },
        timestamp: { type: String, required: true }, // e.g., "08:30"
        seconds: { type: Number, required: true }, // e.g., 510
        summary: { type: String, default: "" },
      },
    ],
    notes: {
      type: String,
      default: "", // Comprehensive architectural markdown/formatted notes
    },
    attachments: [
      {
        id: { type: String },
        name: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, default: "PDF" }, // PDF, ZIP, JSON, YAML
        fileSize: { type: String, default: "2.4 MB" },
        downloadCount: { type: Number, default: 0 },
      },
    ],
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: "link" }, // github, docs, article, sandbox
      },
    ],
  },
  {
    timestamps: true,
    collection: 'lectures',
  }
);

LectureSchema.index({ courseId: 1, moduleNumber: 1, lectureNumber: 1 });

module.exports = mongoose.model('Lecture', LectureSchema);
