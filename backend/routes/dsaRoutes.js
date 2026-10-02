const express = require('express');
const router = express.Router();
const { getDSAProblems, submitDSACode } = require('../controllers/compilerController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/problems', getDSAProblems);
router.post('/submit', optionalAuth, submitDSACode);

module.exports = router;
