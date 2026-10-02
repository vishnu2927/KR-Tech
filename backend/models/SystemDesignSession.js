const mongoose = require('mongoose');

const systemDesignSessionSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      index: true,
      lowercase: true,
      trim: true,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    problemId: {
      type: String,
      required: true,
    },
    scaleEstimations: {
      dailyActiveUsers: { type: String, default: '100M' },
      writesPerSec: { type: String, default: '10,000' },
      readsPerSec: { type: String, default: '100,000' },
      storagePerYear: { type: String, default: '15 TB' },
    },
    architectureComponents: [
      {
        name: { type: String },
        type: { type: String, enum: ['client', 'dns_lb', 'service', 'cache', 'database', 'queue', 'storage'] },
        technology: { type: String },
        rationale: { type: String },
      },
    ],
    tradeoffAnalysis: {
      consistencyVsAvailability: { type: String, default: 'Eventual consistency selected' },
      cachingStrategy: { type: String, default: 'Cache-Aside with Redis Cluster' },
      partitioningStrategy: { type: String, default: 'Consistent Hashing on UserID' },
    },
    feedback: {
      score: { type: Number, default: 85 },
      strengths: [{ type: String }],
      bottlenecksIdentified: [{ type: String }],
      recommendations: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

systemDesignSessionSchema.index({ studentEmail: 1, createdAt: -1 });

module.exports = mongoose.model('SystemDesignSession', systemDesignSessionSchema);
