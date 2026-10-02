const express = require('express');
const router = express.Router();
const {
  getWhatsAppLogs,
  getWhatsAppStats,
  sendTestMessage,
  retryMessage,
  previewTemplate,
  handleWebhookVerification,
  handleWebhookEvent,
} = require('../controllers/whatsappController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

// Meta WhatsApp Cloud API Webhook Handshake & Events
router.get('/webhook', handleWebhookVerification);
router.post('/webhook', handleWebhookEvent);

// Public / Testing Template Preview
router.get('/preview/:template', previewTemplate);
router.post('/send-test', optionalAuth, sendTestMessage);

// Protected Admin Endpoints
router.get('/logs', protect, admin, getWhatsAppLogs);
router.get('/stats', protect, admin, getWhatsAppStats);
router.post('/retry/:id', protect, admin, retryMessage);

module.exports = router;
