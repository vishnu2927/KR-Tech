const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'KR GLOBAL LEARNING PRIVATE LIMITED',
    },
    tagline: {
      type: String,
      default: 'Learn. Build. Grow. Globally.',
    },
    cin: {
      type: String,
      default: 'U80902DL2024PTC428190',
    },
    supportPhone: {
      type: String,
      default: '+91 9311073936',
    },
    supportEmail: {
      type: String,
      default: 'krglobal0713@gmail.com',
    },
    officeAddress: {
      type: String,
      default: 'A-Block, Connaught Place, New Delhi, Delhi 110001',
    },
    logoUrl: {
      type: String,
      default: '/favicon.svg',
    },
    theme: {
      type: String,
      default: 'dark-glassmorphism',
    },
    smtp: {
      host: { type: String, default: 'smtp.gmail.com' },
      port: { type: Number, default: 587 },
      user: { type: String, default: 'krglobal0713@gmail.com' },
      fromEmail: { type: String, default: 'no-reply@krgloballearning.com' },
      enabled: { type: Boolean, default: true },
    },
    razorpay: {
      keyId: { type: String, default: 'rzp_live_krglobal2026' },
      isLive: { type: Boolean, default: true },
      currency: { type: String, default: 'INR' },
    },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com/company/kr-global-learning' },
      youtube: { type: String, default: 'https://youtube.com/@krgloballearning' },
      twitter: { type: String, default: 'https://x.com/krgloballearning' },
      github: { type: String, default: 'https://github.com/kr-global-learning' },
    },
    seo: {
      metaTitle: {
        type: String,
        default: 'KR GLOBAL LEARNING PRIVATE LIMITED — Advanced AI & Engineering LMS',
      },
      metaDescription: {
        type: String,
        default: 'Premier tech upskilling and certification platform for AI, Cloud Architecture, and Software Engineering.',
      },
      keywords: {
        type: [String],
        default: ['EdTech', 'AI Learning', 'Cloud Architect', 'Certifications', 'KR Global Learning'],
      },
    },
    announcement: {
      message: { type: String, default: '🚀 Founder Edition Phase 11 Super Admin ERP Active.' },
      isActive: { type: Boolean, default: true },
      type: { type: String, default: 'info' },
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: String,
      default: 'Founder Super Admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompanySettings', companySettingsSchema, 'companySettings');
