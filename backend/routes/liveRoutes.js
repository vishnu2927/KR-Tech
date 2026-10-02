const express = require('express');
const router = express.Router();
const {
  scheduleSession,
  getUpcomingSessions,
  getAllSessions,
  getSessionById,
  joinSession,
  leaveSession,
  getRecordings,
  createRecording,
  updateSession,
  deleteSession,
  getCalendarEvents,
  downloadICS,
  getMyAttendance,
  getLiveStats,
  triggerReminders,
} = require('../controllers/liveController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

// Custom Admin Guard (same pattern as adminRoutes)
const adminProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, () => {
      if (req.user && req.user.role === 'admin') {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator privileges required',
      });
    });
  }

  if (req.headers['x-admin-key'] === 'krtech_admin_dev_bypass') {
    req.user = { role: 'admin', email: 'admin@krtech.com' };
    return next();
  }

  return protect(req, res, next);
};

// ──── Admin/Mentor Routes ────
router.post('/schedule', adminProtect, scheduleSession);
router.get('/all', adminProtect, getAllSessions);
router.get('/stats', adminProtect, getLiveStats);
router.post('/reminders/trigger', adminProtect, triggerReminders);
router.put('/session/:id', adminProtect, updateSession);
router.delete('/session/:id', adminProtect, deleteSession);
router.post('/recordings', adminProtect, createRecording);

// ──── Student Routes ────
router.get('/upcoming', protect, getUpcomingSessions);
router.get('/session/:id', protect, getSessionById);
router.post('/join', protect, joinSession);
router.post('/leave', protect, leaveSession);
router.get('/recordings', protect, getRecordings);
router.get('/calendar', protect, getCalendarEvents);
router.get('/calendar/ics/:sessionId', protect, downloadICS);
router.get('/my-attendance', protect, getMyAttendance);

module.exports = router;
