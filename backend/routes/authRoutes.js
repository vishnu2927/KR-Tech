const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getMyBookings,
  getMyCourses,
  enrollInCourse,
  getAllStudents,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logoutUser,
  refreshTokenHandler,
  logoutAll,
  getUserSessions,
  revokeSession,
  googleAuthStart,
  googleAuthCallback,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Security Rate Limiter: Max 5 password reset requests per 15 minutes
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests from this IP. Please wait 15 minutes before requesting another code.',
  },
});

// Security Rate Limiter: Max 15 verification attempts per 15 minutes
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP verification attempts. Please wait 15 minutes before retrying.',
  },
});

// Google OAuth 2.0 Endpoints
router.get('/google', googleAuthStart);
router.get('/google/callback', googleAuthCallback);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshTokenHandler);
router.post('/logout-all', protect, logoutAll);
router.get('/sessions', protect, getUserSessions);
router.delete('/sessions/:sessionId', protect, revokeSession);
router.post('/forgot-password', otpRequestLimiter, forgotPassword);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);
router.post('/reset-password', otpRequestLimiter, resetPassword);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/my-bookings', protect, getMyBookings);
router.get('/my-courses', protect, getMyCourses);
router.post('/enroll', protect, enrollInCourse);
router.get('/students', protect, admin, getAllStudents);

module.exports = router;
