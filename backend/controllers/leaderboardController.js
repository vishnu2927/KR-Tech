const Leaderboard = require('../models/Leaderboard');
const mongoose = require('mongoose');

const SEED_STUDENTS = [
  {
    studentName: 'Aarav Singhania',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces&auto=format',
    college: 'IIT Bombay',
    domain: 'Full Stack Java',
    weeklyRank: 1,
    allTimeRank: 1,
    totalPoints: 3820,
    problemsSolved: 489,
    contestsAttended: 24,
    streakDays: 68,
    badgesCount: 18,
    recentBadges: ['Grandmaster Coder', 'Kafka Architect', 'Spring Boot Pro'],
  },
  {
    studentName: 'Sneha Kulkarni',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&auto=format',
    college: 'NIT Surathkal',
    domain: 'Cloud & DevOps',
    weeklyRank: 2,
    allTimeRank: 2,
    totalPoints: 3540,
    problemsSolved: 432,
    contestsAttended: 21,
    streakDays: 54,
    badgesCount: 16,
    recentBadges: ['K8s Certified', 'Terraform Specialist', 'AWS Master'],
  },
  {
    studentName: 'Rohan Deshmukh',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&auto=format',
    college: 'BITS Pilani',
    domain: 'Cyber Security',
    weeklyRank: 3,
    allTimeRank: 4,
    totalPoints: 3190,
    problemsSolved: 398,
    contestsAttended: 19,
    streakDays: 42,
    badgesCount: 15,
    recentBadges: ['CEH Elite', 'Zero Trust Vanguard', 'Bug Bounty Pro'],
  },
  {
    studentName: 'Pooja Hegde',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces&auto=format',
    college: 'DTU Delhi',
    domain: 'Data Engineering',
    weeklyRank: 4,
    allTimeRank: 3,
    totalPoints: 3120,
    problemsSolved: 376,
    contestsAttended: 18,
    streakDays: 39,
    badgesCount: 13,
    recentBadges: ['Spark Guru', 'Snowflake Certified', 'SQL Champion'],
  },
  {
    studentName: 'Vikram Nair',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces&auto=format',
    college: 'IIIT Hyderabad',
    domain: 'Algorithms / Competitive Programming',
    weeklyRank: 5,
    allTimeRank: 5,
    totalPoints: 2980,
    problemsSolved: 460,
    contestsAttended: 22,
    streakDays: 47,
    badgesCount: 14,
    recentBadges: ['Graph Master', 'DP Ninja', 'Tree Traverser'],
  },
  {
    studentName: 'Ananya Roy',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces&auto=format',
    college: 'IIT Madras',
    domain: 'Full Stack Java',
    weeklyRank: 6,
    allTimeRank: 6,
    totalPoints: 2840,
    problemsSolved: 350,
    contestsAttended: 16,
    streakDays: 31,
    badgesCount: 12,
    recentBadges: ['React 19 Specialist', 'Microservices Hero'],
  },
];

async function ensureLeaderboardSeeded() {
  const count = await Leaderboard.countDocuments();
  if (count >= 5) return;

  const records = SEED_STUDENTS.map((s) => ({
    ...s,
    student: new mongoose.Types.ObjectId(),
  }));

  await Leaderboard.insertMany(records);
  console.log(`🏆 Seeded ${records.length} leaderboard contestants into MongoDB Atlas.`);
}

// @desc    Get Leaderboard Rankings (Weekly / All-Time)
// @route   GET /api/leaderboard
// @access  Public / Student
const getLeaderboard = async (req, res) => {
  try {
    await ensureLeaderboardSeeded();

    const { timeframe = 'weekly', domain } = req.query;
    const query = {};

    if (domain && domain !== 'All') {
      query.domain = domain;
    }

    const sortField = timeframe === 'all_time' ? { allTimeRank: 1, totalPoints: -1 } : { weeklyRank: 1, totalPoints: -1 };

    const rankings = await Leaderboard.find(query).sort(sortField).limit(50);

    // Summary stats
    const topThree = rankings.slice(0, 3);
    const rest = rankings.slice(3);

    res.status(200).json({
      success: true,
      data: {
        topThree,
        rankings: rest,
        totalParticipants: 1840,
        activeContests: 3,
        weeklyPrizePool: '₹50,000 + Direct FAANG Interviews',
      },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
  }
};

// @desc    Get Current Student's Rank
// @route   GET /api/leaderboard/me
// @access  Private / Student
const getMyRank = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    let rankDoc = await Leaderboard.findOne({ student: userId });

    if (!rankDoc) {
      rankDoc = {
        studentName: req.user?.name || 'Aditya Sharma',
        weeklyRank: 7,
        allTimeRank: 8,
        totalPoints: 2450,
        problemsSolved: 342,
        contestsAttended: 18,
        streakDays: 48,
        badgesCount: 14,
        college: 'National Institute of Technology (NIT)',
        domain: 'Full Stack Java',
      };
    }

    res.status(200).json({ success: true, data: rankDoc });
  } catch (error) {
    console.error('Get my rank error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student rank.' });
  }
};

module.exports = {
  getLeaderboard,
  getMyRank,
};
