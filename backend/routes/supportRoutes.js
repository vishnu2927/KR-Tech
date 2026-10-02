const express = require('express');
const router = express.Router();
const {
  createTicket,
  updateTicket,
  getTickets,
  getMyTickets,
} = require('../controllers/supportController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Public or Authenticated can submit ticket
router.post('/create', optionalAuth, createTicket);

// Student gets their own tickets
router.get('/me', protect, getMyTickets);

// Admin or staff views ticket queue
router.get('/', optionalAuth, getTickets);

// Update status, assign, reply
router.patch('/:id', optionalAuth, updateTicket);

module.exports = router;
