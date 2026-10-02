const mongoose = require('mongoose');

const StudyPlanWeekSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  topics: [{
    type: String,
    trim: true,
  }],
  practicalProject: {
    type: String,
    default: '',
  },
  milestone: {
    type: String,
    default: '',
  },
  resources: [{
    title: { type: String },
    url: { type: String },
    type: { type: String, default: 'documentation' },
  }],
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

const StudyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
      default: 'Full Stack Cloud Engineer',
    },
    targetTimelineWeeks: {
      type: Number,
      default: 8,
      min: 2,
      max: 52,
    },
    weeklyHours: {
      type: Number,
      default: 12,
      min: 2,
      max: 60,
    },
    currentSkillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    targetSkills: [{
      type: String,
      trim: true,
    }],
    weeks: [StudyPlanWeekSchema],
    overallProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'study_plans',
  }
);

StudyPlanSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
