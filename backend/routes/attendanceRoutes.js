const express = require('express');
const router = express.Router();
const { getAttendance, markAttendance } = require('../controllers/attendanceController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getAttendance);
router.post('/mark', optionalAuth, markAttendance);
router.post('/', optionalAuth, markAttendance);

module.exports = router;
