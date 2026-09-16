const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getMyBookings,
  getMyCourses,
  enrollInCourse,
  getAllStudents,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/my-bookings', protect, getMyBookings);
router.get('/my-courses', protect, getMyCourses);
router.post('/enroll', protect, enrollInCourse);
router.get('/students', protect, admin, getAllStudents);

module.exports = router;
