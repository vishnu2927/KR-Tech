const express = require('express');
const router = express.Router();
const {
  getMyPortfolio,
  savePortfolio,
  getPublicPortfolio,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyPortfolio);
router.post('/', protect, savePortfolio);
router.get('/:handle', getPublicPortfolio);

module.exports = router;
