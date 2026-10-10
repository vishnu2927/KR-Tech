const express = require('express');
const router = express.Router();
const {
  getStudentAnalytics,
  awardXP,
  checkInStreak,
  getBadges,
} = require('../controllers/studentAnalyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getStudentAnalytics);
router.post('/xp', protect, awardXP);
router.post('/check-in', protect, checkInStreak);
router.get('/badges', protect, getBadges);

module.exports = router;
