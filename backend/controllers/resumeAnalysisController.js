const ResumeAnalysis = require('../models/ResumeAnalysis');

const TECH_KEYWORD_TAXONOMY = [
  'react',
  'node',
  'express',
  'mongodb',
  'typescript',
  'javascript',
  'docker',
  'kubernetes',
  'aws',
  'microservices',
  'ci/cd',
  'redis',
  'postgresql',
  'git',
  'graphql',
  'rest api',
  'system design',
  'data structures',
  'algorithms',
  'kafka',
  'sql',
  'tailwind',
  'next.js',
];

// @desc    Deep ATS Resume Audit
// @route   POST /api/resume/analyze
// @access  Public / Optional Auth
exports.analyzeResume = async (req, res) => {
  try {
    const studentEmail = (req.user && req.user.email) || req.body.studentEmail || 'student@krtech.in';
    const {
      resumeText,
      targetRole = 'Software Development Engineer',
      targetCompany = 'Top Tech Companies',
    } = req.body;

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ success: false, message: 'Please provide at least 50 characters of resume text' });
    }

    const lowerText = resumeText.toLowerCase();

    // Match keywords
    const matchedKeywords = TECH_KEYWORD_TAXONOMY.filter((kw) => lowerText.includes(kw));
    const missingKeywords = TECH_KEYWORD_TAXONOMY.filter((kw) => !lowerText.includes(kw)).slice(0, 7);

    // Compute scores
    const keywordScore = Math.min(95, Math.max(45, Math.round((matchedKeywords.length / 15) * 100)));
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
    const hasPhone = /\+?\d[\d -]{8,}\d/.test(resumeText);
    const hasMetrics = /\d+([%kK]|ms|x|X|\+)/.test(resumeText);

    let formatScore = 85;
    const formattingIssues = [];
    if (!hasEmail) {
      formatScore -= 15;
      formattingIssues.push('Missing direct email contact link');
    }
    if (!hasPhone) {
      formatScore -= 10;
      formattingIssues.push('Missing phone number format');
    }
    if (!hasMetrics) {
      formatScore -= 15;
      formattingIssues.push('Bullet points lack quantifiable business metrics (e.g. 40% latency drop, 10k DAU)');
    }
    if (resumeText.length > 3500) {
      formattingIssues.push('Resume length likely exceeds recommended 1-page single-column standard for junior engineers');
    }

    const experienceScore = hasMetrics ? 88 : 68;
    const atsScore = Math.round(keywordScore * 0.45 + formatScore * 0.3 + experienceScore * 0.25);

    const bulletPointRewrites = [
      {
        original: 'Worked on backend APIs for user management.',
        improved: 'Architected and deployed 14 RESTful microservice endpoints with JWT auth, reducing latency by 32% across 25k daily requests.',
        metricAdded: 'Quantified 32% latency reduction and 25k daily throughput',
      },
      {
        original: 'Implemented caching with Redis to speed up database queries.',
        improved: 'Engineered Cache-Aside pattern utilizing Redis Cluster, slashing redundant PostgreSQL database reads by 65% during flash traffic.',
        metricAdded: 'Documented 65% reduction in DB queries',
      },
    ];

    const suggestedSummary = `Results-driven ${targetRole} with proven expertise in ${matchedKeywords.slice(0, 4).join(', ')}. Experienced in building high-throughput microservices, optimizing database performance, and designing intuitive web interfaces. Passionate about solving complex distributed systems problems.`;

    const report = await ResumeAnalysis.create({
      studentEmail,
      targetRole,
      targetCompany,
      atsScore,
      formatScore,
      keywordScore,
      experienceScore,
      matchedKeywords,
      missingKeywords,
      formattingIssues,
      bulletPointRewrites,
      suggestedSummary,
    });

    res.status(201).json({
      success: true,
      report,
    });
  } catch (err) {
    console.error('analyzeResume Error:', err);
    res.status(500).json({ success: false, message: 'Resume analysis failed', error: err.message });
  }
};
