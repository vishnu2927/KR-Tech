const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'PDF',
    },
    fileSize: {
      type: String,
      default: '4.5 MB',
    },
    downloadsCount: {
      type: String,
      default: '12.5k',
    },
    tags: [
      {
        type: String,
      },
    ],
    downloadUrl: {
      type: String,
      default: '#',
    },
    content: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'KR Tech Senior Architect Council',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
