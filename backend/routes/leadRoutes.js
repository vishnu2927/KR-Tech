const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  getAdminStats,
} = require('../controllers/leadController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public lead submission
router.post('/', createLead);

// Protected Admin lead management & stats
router.get('/', protect, admin, getLeads);
router.get('/stats', protect, admin, getAdminStats);
router.patch('/:id', protect, admin, updateLeadStatus);
router.delete('/:id', protect, admin, deleteLead);

module.exports = router;
