const express = require('express');
const router = express.Router();
const {
  getStudentAnalytics,
  awardXP,
  checkInStreak,
  getBadges,
} = require('../controllers/studentAnalyticsController');

router.get('/', getStudentAnalytics);
router.post('/xp', awardXP);
router.post('/check-in', checkInStreak);
router.get('/badges', getBadges);

module.exports = router;
