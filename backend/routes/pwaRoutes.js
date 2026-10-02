const express = require('express');
const router = express.Router();
const {
  registerDevice,
  syncProgress,
  getOfflineLessons,
} = require('../controllers/pwaController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/register-device', optionalAuth, registerDevice);
router.post('/sync-progress', optionalAuth, syncProgress);
router.get('/offline-lessons', optionalAuth, getOfflineLessons);

module.exports = router;
