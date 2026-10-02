const express = require('express');
const router = express.Router();
const {
  getOverviewWidgets,
  getRevenueTrend,
  getSignupsTrend,
  getCategoryDistribution,
  getPopularCourses,
  getPaymentMethods,
} = require('../controllers/analyticsController');

// All endpoints support query params like ?days=7|30|90
router.get('/widgets', getOverviewWidgets);
router.get('/revenue-trend', getRevenueTrend);
router.get('/signups-trend', getSignupsTrend);
router.get('/category-distribution', getCategoryDistribution);
router.get('/popular-courses', getPopularCourses);
router.get('/payment-methods', getPaymentMethods);

module.exports = router;
