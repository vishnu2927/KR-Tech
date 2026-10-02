const express = require('express');
const router = express.Router();
const {
  getRazorpayKey,
  createOrder,
  verifyPayment,
  getMyPayments,
  getAllPayments,
  getPaymentById,
  getPaymentStats,
  getAdminPayments,
  getRevenueAnalytics,
  getRecentPayments,
  downloadInvoice,
  handleWebhook,
} = require('../controllers/paymentController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

// Public / Student endpoints
router.get('/key', getRazorpayKey);
router.post('/create-order', optionalAuth, createOrder);
router.post('/verify', optionalAuth, verifyPayment);
router.get('/history', optionalAuth, getMyPayments);
router.get('/my-payments', optionalAuth, getMyPayments);
router.get('/invoice/:paymentId', optionalAuth, downloadInvoice);
router.post('/webhook', handleWebhook);

// Admin & Analytic endpoints
router.get('/admin', protect, admin, getAdminPayments);
router.get('/admin/stats', protect, admin, getPaymentStats);
router.get('/admin/revenue', protect, admin, getRevenueAnalytics);
router.get('/admin/recent', protect, admin, getRecentPayments);
router.get('/stats', protect, admin, getPaymentStats);
router.get('/revenue', protect, admin, getRevenueAnalytics);
router.get('/recent', protect, admin, getRecentPayments);
router.get('/all', protect, admin, getAllPayments);

// Get single payment by ID (must be after named routes)
router.get('/:id', optionalAuth, getPaymentById);

module.exports = router;
