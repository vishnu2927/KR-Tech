const express = require('express');
const router = express.Router();
const { getRooms, getRoomMessages, sendMessage } = require('../controllers/chatController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/rooms', optionalAuth, getRooms);
router.get('/rooms/:roomId/messages', optionalAuth, getRoomMessages);
router.post('/message', optionalAuth, sendMessage);

module.exports = router;
