const express = require('express');
const router = express.Router();
const {
  applyCoupon,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponAnalytics,
} = require('../controllers/couponController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

// Student & Public routes
router.post('/apply', optionalAuth, applyCoupon);
router.get('/', optionalAuth, getCoupons);
router.get('/analytics', protect, admin, getCouponAnalytics);
router.get('/:id', optionalAuth, getCouponById);

// Admin CRUD routes
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
