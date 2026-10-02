const mongoose = require('mongoose');

const WhatsAppLogSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
      trim: true,
    },
    template: {
      type: String,
      required: true,
      enum: [
        'demo_confirmation',
        'payment_success',
        'upcoming_batch_reminder',
        'live_class_reminder',
        'certificate_ready',
        'general',
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ['queued', 'sent', 'delivered', 'read', 'simulated', 'failed', 'retrying'],
      default: 'sent',
    },
    waMessageId: {
      type: String,
      trim: true,
      index: true,
    },
    messagePreview: {
      type: String,
      trim: true,
    },
    parameters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    lastRetryAt: {
      type: Date,
    },
    error: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'whatsappLogs',
  }
);

WhatsAppLogSchema.index({ recipient: 1, createdAt: -1 });
WhatsAppLogSchema.index({ template: 1, status: 1 });

module.exports = mongoose.model('WhatsAppLog', WhatsAppLogSchema);
