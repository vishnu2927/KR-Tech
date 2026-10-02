const express = require('express');
const router = express.Router();
const {
  getFeed,
  createPost,
  getPostById,
  addComment,
  toggleLike,
  toggleSavePost,
  getSavedPosts,
  getBadges,
  getCommunityLeaderboard,
} = require('../controllers/communityController');
const { getRooms } = require('../controllers/chatController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Community Feed & Posts
router.get('/feed', optionalAuth, getFeed);
router.post('/post', optionalAuth, createPost);
router.get('/post/:id', optionalAuth, getPostById);
router.post('/comment', optionalAuth, addComment);
router.post('/like/:id', optionalAuth, toggleLike);
router.post('/save/:id', optionalAuth, toggleSavePost);
router.get('/saved', optionalAuth, getSavedPosts);

// Rooms & Channels
router.get('/rooms', optionalAuth, getRooms);

// Badges & Leaderboards
router.get('/badges', optionalAuth, getBadges);
router.get('/leaderboard', optionalAuth, getCommunityLeaderboard);

module.exports = router;
