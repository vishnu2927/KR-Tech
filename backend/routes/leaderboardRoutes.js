const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getMyRank,
} = require('../controllers/leaderboardController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getLeaderboard);
router.get('/me', protect, getMyRank);

module.exports = router;
