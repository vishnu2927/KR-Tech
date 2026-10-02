const express = require('express');
const router = express.Router();
const { analyzeResume } = require('../controllers/resumeAnalysisController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/analyze', optionalAuth, analyzeResume);

module.exports = router;
