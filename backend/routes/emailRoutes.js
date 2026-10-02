const express = require('express');
const router = express.Router();
const {
  getEmailLogs,
  getEmailStats,
  sendTestEmail,
  previewTemplate,
  resendEmail,
  getQueueStatus,
  verifySmtpStatus,
} = require('../controllers/emailController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

// Public preview of templates in browser
router.get('/preview/:template', previewTemplate);

// Verify SMTP Connection Status
router.get('/verify-smtp', verifySmtpStatus);

// Real-Time Email Queue Status
router.get('/queue-status', getQueueStatus);

// Dispatch test email
router.post('/send-test', optionalAuth, sendTestEmail);

// Resend / Retry email from log ID
router.post('/resend/:id', optionalAuth, resendEmail);

// Admin log viewing & stats
router.get('/logs', protect, admin, getEmailLogs);
router.get('/stats', protect, admin, getEmailStats);

module.exports = router;
