const express = require('express');
const router = express.Router();
const {
  startInterview,
  answerQuestion,
  getInterviewAnalytics,
} = require('../controllers/interviewPlatformController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/start', optionalAuth, startInterview);
router.post('/answer', optionalAuth, answerQuestion);
router.get('/analytics', optionalAuth, getInterviewAnalytics);

module.exports = router;
