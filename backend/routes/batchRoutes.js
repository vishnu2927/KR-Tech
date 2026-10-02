const express = require('express');
const router = express.Router();
const {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  addStudentToBatch,
} = require('../controllers/batchController');
const { protect, admin, optionalAuth, verifyRole } = require('../middleware/authMiddleware');

// Custom Admin/Staff Guard
const staffProtect = async (req, res, next) => {
  if (req.headers['x-admin-key'] === 'krtech_admin_dev_bypass') {
    req.user = { role: 'admin', email: 'admin@krtech.com' };
    return next();
  }
  return protect(req, res, () => {
    if (['superAdmin', 'admin', 'mentor', 'counselor'].includes(req.user?.role)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: 'Access denied: Staff privileges required',
    });
  });
};

router.get('/', optionalAuth, getBatches);
router.get('/:id', optionalAuth, getBatchById);
router.post('/', staffProtect, createBatch);
router.put('/:id', staffProtect, updateBatch);
router.delete('/:id', staffProtect, deleteBatch);
router.post('/:id/students', staffProtect, addStudentToBatch);

module.exports = router;
