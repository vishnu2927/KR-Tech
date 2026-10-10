const StudentAnalytics = require('../models/StudentAnalytics');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Course = require('../models/Course');

const LEVEL_TITLES = [
  'Novice Explorer',
  'Junior Coder',
  'Backend Apprentice',
  'Microservices Practitioner',
  'Distributed Systems Builder',
  'Cloud Native Engineer',
  'System Architect Specialist',
  'Senior Systems Builder',
  'Staff Systems Architect',
  'Principal Engineering Leader',
  'Distinguished Fellow',
  'Chief Architect Fellow',
];

const DEFAULT_BADGES = [
  {
    id: 'badge-scaler',
    name: 'Distributed Scaler',
    icon: '⚡',
    description: 'Designed and deployed an Apache Kafka consumer group with zero message loss.',
    category: 'Architecture',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    progressPercent: 100,
    criteria: 'Deploy production Kafka pipeline with consumer rebalance listeners.',
  },
  {
    id: 'badge-resilience',
    name: 'Resilience Architect',
    icon: '🛡️',
    description: 'Configured Resilience4j circuit breakers, bulkheads, and idempotent retry policies.',
    category: 'Microservices',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    progressPercent: 100,
    criteria: '100% test pass on resilience circuit breaker fault injection suite.',
  },
  {
    id: 'badge-streak-7',
    name: '7-Day Streak Warrior',
    icon: '🔥',
    description: 'Completed code challenges and attended live cohort sessions for 7 consecutive days.',
    category: 'Consistency',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    progressPercent: 100,
    criteria: 'Maintain continuous 7-day study and coding activity.',
  },
  {
    id: 'badge-cloud-pioneer',
    name: 'Cloud Pioneer',
    icon: '☁️',
    description: 'Passed AWS Certified Solutions Architect capstone with greater than 90% score.',
    category: 'Cloud & DevOps',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
    progressPercent: 100,
    criteria: 'Achieve >90% on AWS Multi-Region VPC & EKS Capstone evaluation.',
  },
  {
    id: 'badge-clean-code',
    name: 'Clean Code Artisan',
    icon: '💻',
    description: 'Maintained 100% test coverage with JUnit 5 & Testcontainers on Spring Boot 3.',
    category: 'Code Quality',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    progressPercent: 100,
    criteria: 'Zero code smell alerts and full integration coverage.',
  },
  {
    id: 'badge-fullstack-pro',
    name: 'Full Stack Master',
    icon: '🚀',
    description: 'Integrated React 19 Frontend with Distributed Java Backend microservices.',
    category: 'Engineering',
    unlocked: false,
    progressPercent: 65,
    criteria: 'Complete Full Stack capstone with OAuth2 token rotation & WebSockets.',
  },
  {
    id: 'badge-staff-candidate',
    name: 'Staff Engineer Candidate',
    icon: '👑',
    description: 'Completed all Tier-1 mock system design interview rounds with Principal Mentors.',
    category: 'Career',
    unlocked: false,
    progressPercent: 80,
    criteria: 'Pass 4 high-scale mock system design interview evaluations.',
  },
  {
    id: 'badge-capstone-champion',
    name: 'Capstone Champion',
    icon: '🏆',
    description: 'Final enterprise production capstone approved and signed off by lead mentor.',
    category: 'Milestone',
    unlocked: false,
    progressPercent: 40,
    criteria: 'Deploy end-to-end multi-tenant fintech architecture to Kubernetes.',
  },
];

const DEFAULT_ATTENDANCE_HISTORY = [
  {
    sessionId: 'sess-101',
    topic: 'Microservices Circuit Breaker & Resilience4j in Action',
    mentorName: 'Rajesh Kumar (Principal Technical Architect)',
    date: 'Sep 16, 2026',
    status: 'Present',
    sessionType: '1:1 Live Coding & Architecture',
  },
  {
    sessionId: 'sess-102',
    topic: 'Distributed Kafka Event Sourcing & Partition Design',
    mentorName: 'Rajesh Kumar (Principal Technical Architect)',
    date: 'Sep 14, 2026',
    status: 'Present',
    sessionType: '1:1 Live Coding & Architecture',
  },
  {
    sessionId: 'sess-103',
    topic: 'AWS Multi-AZ VPC Peering & High Availability Routing',
    mentorName: 'Vikram Nair (Staff Software Engineer Cloud)',
    date: 'Sep 11, 2026',
    status: 'Present',
    sessionType: '1:1 Live Capstone Review',
  },
  {
    sessionId: 'sess-104',
    topic: 'Database Sharding Strategies with Raft & Paxos',
    mentorName: 'Rajesh Kumar (Principal Technical Architect)',
    date: 'Sep 08, 2026',
    status: 'Present',
    sessionType: '1:1 Live Architecture',
  },
  {
    sessionId: 'sess-105',
    topic: 'React 19 Server Actions & Optimistic State Sync',
    mentorName: 'Amit Verma (Principal Systems Architect)',
    date: 'Sep 05, 2026',
    status: 'Present',
    sessionType: '1:1 Live Coding',
  },
];

const DEFAULT_XP_ACTIVITIES = [
  {
    title: 'Completed Lecture: Distributed Database Sharding',
    xp: 50,
    type: 'lecture',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    title: 'Submitted Capstone Assignment: Resilience4j Circuit Breaker',
    xp: 150,
    type: 'assignment',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
  },
  {
    title: 'Attended 1:1 Live Coding Session with Rajesh Kumar',
    xp: 100,
    type: 'attendance',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28),
  },
  {
    title: 'Maintained 5-Day Consecutive Learning Streak',
    xp: 75,
    type: 'streak',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    title: 'Unlocked Badge: Resilience Architect',
    xp: 200,
    type: 'badge',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168),
  },
];

const getEffectiveStudent = (req) => {
  if (req.user && req.user.email) {
    return {
      userId: req.user._id,
      email: req.user.email.toLowerCase().trim(),
      name: req.user.name || 'Student',
      role: req.user.role || 'student',
    };
  }
  return null;
};

// @desc    Get complete student learning analytics & progress tracker
// @route   GET /api/student/analytics
// @access  Private
exports.getStudentAnalytics = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;

    // Find or provision student analytics
    let analytics = await StudentAnalytics.findOne({ userEmail });

    if (!analytics) {
      analytics = await StudentAnalytics.create({
        userEmail,
        userName: student.name,
        xp: 0,
        level: 1,
        levelTitle: 'Novice Explorer',
        streak: {
          current: 0,
          longest: 0,
          lastActiveDate: null,
          weeklyDays: [],
        },
        attendance: {
          attendedSessions: 0,
          totalSessions: 0,
          attendanceRate: 0,
          history: [],
        },
        badges: [],
        xpActivities: [],
      });
    }

    // Dynamic XP next level computation
    const xpPerLevel = 500;
    const computedLevel = Math.max(1, Math.floor(analytics.xp / xpPerLevel) + 1);
    const currentLevelProgressXP = analytics.xp % xpPerLevel;
    const xpToNextLevel = xpPerLevel - currentLevelProgressXP;
    const levelTitle = LEVEL_TITLES[Math.min(computedLevel - 1, LEVEL_TITLES.length - 1)];

    // Fetch Course Progress Bars and Completion Status strictly for authenticated user
    const enrollments = await Enrollment.find({ userEmail }).lean();
    const progressDocs = await Progress.find({ userEmail }).lean();

    const coursesWithProgress = enrollments.map((enr) => {
      const pDoc = progressDocs.find((p) => p.courseId === enr.courseId);
      const percent = pDoc?.progressPercent || 0;
      const completedCount = (pDoc?.completedLectures || []).length;
      const totalLectures = 24;

      return {
        courseId: enr.courseId,
        courseTitle: enr.courseTitle,
        category: enr.category,
        mentor: enr.mentor,
        progressPercent: percent,
        completedLectures: completedCount,
        totalLectures,
        watchHours: Math.round((completedCount * 45) / 60),
        modules: [
          { name: 'Architecture Foundations', progress: Math.min(100, percent * 2) },
          { name: 'Core Implementation', progress: percent >= 50 ? Math.min(100, (percent - 50) * 2) : 0 },
        ],
      };
    });

    const overallCurriculumCompletion = coursesWithProgress.length > 0
      ? Math.round(coursesWithProgress.reduce((acc, c) => acc + c.progressPercent, 0) / coursesWithProgress.length)
      : 0;

    res.json({
      success: true,
      analytics: {
        userEmail: analytics.userEmail,
        userName: analytics.userName,
        xp: analytics.xp,
        level: computedLevel,
        levelTitle,
        xpProgress: {
          currentLevelXP: currentLevelProgressXP,
          xpPerLevel,
          xpToNextLevel,
          progressPercent: Math.round((currentLevelProgressXP / xpPerLevel) * 100),
        },
        streak: analytics.streak,
        attendance: analytics.attendance,
        badges: analytics.badges || [],
        xpActivities: analytics.xpActivities || [],
        courses: coursesWithProgress,
        overallCurriculumCompletion,
      },
    });
  } catch (error) {
    console.error('Get Student Analytics Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Award XP for completing activities (Lecture, Assignment, Streak)
// @route   POST /api/student/analytics/xp
// @access  Private
exports.awardXP = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    const { xp = 50, title = 'Completed Learning Activity', type = 'lecture' } = req.body;

    let analytics = await StudentAnalytics.findOne({ userEmail });
    if (!analytics) {
      analytics = new StudentAnalytics({ userEmail, userName: student.name });
    }

    analytics.xp += parseInt(xp, 10);
    analytics.level = Math.max(1, Math.floor(analytics.xp / 500) + 1);
    analytics.levelTitle = LEVEL_TITLES[Math.min(analytics.level - 1, LEVEL_TITLES.length - 1)];

    analytics.xpActivities.unshift({
      title,
      xp: parseInt(xp, 10),
      type,
      timestamp: new Date(),
    });

    // Keep latest 25 activities
    if (analytics.xpActivities.length > 25) {
      analytics.xpActivities = analytics.xpActivities.slice(0, 25);
    }

    await analytics.save();

    res.json({
      success: true,
      message: `+${xp} XP awarded successfully!`,
      xp: analytics.xp,
      level: analytics.level,
      levelTitle: analytics.levelTitle,
      newActivity: analytics.xpActivities[0],
    });
  } catch (error) {
    console.error('Award XP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check-in and update daily streak
// @route   POST /api/student/analytics/check-in
// @access  Private
exports.checkInStreak = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    let analytics = await StudentAnalytics.findOne({ userEmail });
    if (!analytics) {
      analytics = new StudentAnalytics({ userEmail, userName: student.name });
    }

    const todayDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

    if (!analytics.streak.weeklyDays.includes(todayDayName)) {
      analytics.streak.weeklyDays.push(todayDayName);
      analytics.streak.current += 1;
      if (analytics.streak.current > analytics.streak.longest) {
        analytics.streak.longest = analytics.streak.current;
      }
      analytics.streak.lastActiveDate = new Date();

      // Award bonus XP for daily check-in
      analytics.xp += 75;
      analytics.xpActivities.unshift({
        title: `Daily Check-in Streak 🔥 (${analytics.streak.current} Days)`,
        xp: 75,
        type: 'streak',
        timestamp: new Date(),
      });

      await analytics.save();
    }

    res.json({
      success: true,
      message: `Daily check-in verified! Current streak is ${analytics.streak.current} days 🔥`,
      streak: analytics.streak,
      xp: analytics.xp,
    });
  } catch (error) {
    console.error('Check-in Streak Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all badges
// @route   GET /api/student/analytics/badges
// @access  Private
exports.getBadges = async (req, res) => {
  try {
    const student = getEffectiveStudent(req);
    if (!student) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userEmail = student.email;
    const analytics = await StudentAnalytics.findOne({ userEmail }).lean();
    const badges = analytics?.badges || [];

    res.json({
      success: true,
      count: badges.length,
      unlockedCount: badges.filter((b) => b.unlocked).length,
      badges,
    });
  } catch (error) {
    console.error('Get Badges Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
