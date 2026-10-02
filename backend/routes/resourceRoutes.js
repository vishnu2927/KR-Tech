const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  trackDownload,
  downloadResourceFileEndpoint,
  createResource,
  deleteResource,
} = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getResources);
router.get('/:id/download', downloadResourceFileEndpoint);
router.get('/:id', getResourceById);
router.post('/:id/download', trackDownload);
router.post('/', createResource);
router.delete('/:id', deleteResource);

module.exports = router;
