const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  trackDownload,
  createResource,
} = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/:id/download', trackDownload);
router.post('/', protect, admin, createResource);

module.exports = router;
