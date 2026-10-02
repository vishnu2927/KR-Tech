const express = require('express');
const router = express.Router();
const { getReadiness } = require('../controllers/readinessController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getReadiness);

module.exports = router;
