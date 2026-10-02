const express = require('express');
const router = express.Router();
const {
  getLectures,
  getLectureById,
  getContinueWatching,
  updateWatchProgress,
  saveStudentNotes,
  downloadAttachment,
  getWatchHistory,
} = require('../controllers/lecturePortalController');

// Continue Watching Shelf
router.get('/continue-watching', getContinueWatching);

// Watch History
router.get('/history', getWatchHistory);

// List all lectures (with courseId filter, search, etc.)
router.get('/', getLectures);

// Get single lecture detail
router.get('/:id', getLectureById);

// Update playback progress & toggle completion
router.post('/:id/progress', updateWatchProgress);

// Save student personal notes for lecture
router.post('/:id/notes', saveStudentNotes);

// Download attachment and increment counter
router.post('/:id/attachments/:attachmentId/download', downloadAttachment);

module.exports = router;
