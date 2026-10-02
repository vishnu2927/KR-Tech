const express = require('express');
const router = express.Router();
const { getCalendarEvents } = require('../controllers/calendarController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getCalendarEvents);

module.exports = router;
