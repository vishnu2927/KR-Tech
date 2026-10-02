const mongoose = require('mongoose');

const PortfolioProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  techStack: [{ type: String }],
  stars: { type: Number, default: 12 },
  highlight: { type: Boolean, default: false },
});

const PortfolioExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, default: '2023 - Present' },
  description: { type: String, default: '' },
});

const PortfolioEducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, default: '2020 - 2024' },
  score: { type: String, default: '8.8 CGPA' },
});

const PortfolioCertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  credentialId: { type: String, required: true },
  issuer: { type: String, default: 'KR Tech Academy' },
  issueDate: { type: String, default: 'Sep 2026' },
  verifyUrl: { type: String, default: '' },
});

const PortfolioSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: 'Full Stack Cloud Engineer',
      trim: true,
    },
    bio: {
      type: String,
      default: 'Passionate software engineer building high-concurrency distributed systems and reactive web platforms.',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces&auto=format',
    },
    location: {
      type: String,
      default: 'Bengaluru, India',
    },
    skills: [{
      type: String,
      trim: true,
    }],
    projects: [PortfolioProjectSchema],
    experience: [PortfolioExperienceSchema],
    education: [PortfolioEducationSchema],
    certifications: [PortfolioCertificationSchema],
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      leetcode: { type: String, default: 'https://leetcode.com' },
      website: { type: String, default: '' },
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'portfolios',
  }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);
