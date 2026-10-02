const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 1,
    },
    duration: {
      type: String,
      default: '2 hours',
    },
  },
  {
    timestamps: true,
    collection: 'modules',
  }
);

ModuleSchema.index({ courseId: 1, moduleNumber: 1 });

module.exports = mongoose.model('Module', ModuleSchema);
