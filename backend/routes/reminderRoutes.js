const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
} = require('../controllers/reminderController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getReminders);
router.post('/', optionalAuth, createReminder);

module.exports = router;
