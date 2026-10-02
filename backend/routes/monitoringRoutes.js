const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getMonitoringDiagnostics } = require('../services/monitoringService');

// Custom Admin Guard that checks JWT & admin role
const adminGuard = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, () => {
      if (req.user && (req.user.role === 'admin' || req.user.role === 'superAdmin')) {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator privileges required',
      });
    });
  }

  // Allow x-admin-key fallback if configured
  if (process.env.ADMIN_KEY && req.headers['x-admin-key'] === process.env.ADMIN_KEY) {
    return next();
  }

  // Development environment demo review mode
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication required: Admin token missing',
  });
};

// @desc    Get real-time monitoring diagnostics & metrics
// @route   GET /api/admin/monitoring/stats
// @access  Protected / Admin Only
router.get('/stats', adminGuard, async (req, res) => {
  try {
    const data = await getMonitoringDiagnostics();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Monitoring API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve monitoring diagnostics',
      error: error.message,
    });
  }
});

module.exports = router;
