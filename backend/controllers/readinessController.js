const ReadinessScore = require('../models/ReadinessScore');
const DSAProgress = require('../models/DSAProgress');
const Interview = require('../models/Interview');
const ResumeAnalysis = require('../models/ResumeAnalysis');

// @desc    Get Overall Learning Readiness Score
// @route   GET /api/readiness
// @access  Public / Optional Auth
exports.getReadiness = async (req, res) => {
  try {
    const studentEmail = (req.user && req.user.email) || req.query.studentEmail || 'student@krtech.in';

    const [dsa, interview, resume] = await Promise.all([
      DSAProgress.findOne({ studentEmail }).lean(),
      Interview.findOne({ studentEmail, status: 'completed' }).sort({ createdAt: -1 }).lean(),
      ResumeAnalysis.findOne({ studentEmail }).sort({ createdAt: -1 }).lean(),
    ]);

    const dsaScore = dsa ? Math.min(95, Math.max(50, Math.round((dsa.totalSolved || 15) * 2.8))) : 78;
    const mockInterviewScore = interview ? interview.overallScore : 82;
    const resumeScore = resume ? resume.atsScore : 86;
    const systemDesignScore = 74;

    const overall = Math.round(
      dsaScore * 0.35 + mockInterviewScore * 0.3 + resumeScore * 0.2 + systemDesignScore * 0.15
    );

    let verdict = 'Ready for Product Unicorns & High-Growth Startups';
    if (overall >= 85) verdict = 'MAANG & Tier-1 High-Frequency Ready';
    else if (overall < 70) verdict = 'Additional DSA & Mock Practice Recommended';

    const recommendedActions = [
      {
        area: 'Data Structures',
        action: 'Solve 10 more Hard Graph & Dynamic Programming problems',
        impact: '+5% to Tier-1 Readiness',
      },
      {
        area: 'Mock Interview',
        action: 'Practice Behavioral STAR questions to reduce filler words',
        impact: '+4% to Communication Index',
      },
      {
        area: 'ATS Resume',
        action: 'Add AWS ECS & Kafka architectural impact metrics',
        impact: '+6% to Portfolio ATS Match Rate',
      },
    ];

    const scoreData = {
      studentEmail,
      overallReadinessPercent: overall,
      dsaScore,
      systemDesignScore,
      resumeScore,
      mockInterviewScore,
      targetTier: overall >= 85 ? 'Tier-1 MAANG' : 'Product Unicorn',
      verdict,
      recommendedActions,
    };

    await ReadinessScore.findOneAndUpdate({ studentEmail }, scoreData, { upsert: true, new: true });

    res.json({
      success: true,
      readiness: scoreData,
    });
  } catch (err) {
    console.error('getReadiness Error:', err);
    res.status(500).json({ success: false, message: 'Failed to compute readiness score', error: err.message });
  }
};
