const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    snapshotDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly'],
      default: 'monthly',
      index: true,
    },
    financial: {
      mrr: { type: Number, default: 4850000 },
      arr: { type: Number, default: 58200000 },
      totalRevenue: { type: Number, default: 58200000 },
      netProfit: { type: Number, default: 18624000 },
      profitMarginPercent: { type: Number, default: 32 },
      gstCollected: { type: Number, default: 873000 },
      avgOrderValue: { type: Number, default: 16800 },
    },
    growth: {
      totalStudents: { type: Number, default: 15420 },
      activeCohorts: { type: Number, default: 28 },
      activeMentors: { type: Number, default: 16 },
      certificationRatePercent: { type: Number, default: 94.8 },
      courseCompletionRatePercent: { type: Number, default: 88.4 },
      retentionRatePercent: { type: Number, default: 92.1 },
    },
    marketing: {
      cac: { type: Number, default: 1850 },
      ltv: { type: Number, default: 28400 },
      ltvToCacRatio: { type: Number, default: 15.35 },
      adSpendMonthly: { type: Number, default: 245000 },
      leadsGenerated: { type: Number, default: 1240 },
      demosBooked: { type: Number, default: 460 },
      paidEnrollments: { type: Number, default: 289 },
      overallConversionRatePercent: { type: Number, default: 23.3 },
      channels: [
        {
          name: { type: String },
          spend: { type: Number },
          leads: { type: Number },
          conversions: { type: Number },
          roiPercent: { type: Number },
        },
      ],
    },
    operations: {
      supportTicketsTotal: { type: Number, default: 142 },
      supportTicketsOpen: { type: Number, default: 8 },
      avgResolutionHours: { type: Number, default: 3.4 },
      npsScore: { type: Number, default: 74 },
    },
    ceoExecutiveSummary: {
      keyHighlights: [{ type: String }],
      criticalAlerts: [{ type: String }],
      strategicNextSteps: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

analyticsSnapshotSchema.index({ period: 1, snapshotDate: -1 });

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
