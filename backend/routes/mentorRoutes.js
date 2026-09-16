const express = require('express');
const router = express.Router();
const {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
} = require('../controllers/mentorController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public mentor directory browsing
router.get('/', getMentors);
router.get('/:id', getMentorById);

// Admin mentor management
router.post('/', protect, admin, createMentor);
router.put('/:id', protect, admin, updateMentor);
router.delete('/:id', protect, admin, deleteMentor);

module.exports = router;
