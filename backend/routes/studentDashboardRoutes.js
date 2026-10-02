const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getEnrollments,
  createEnrollment,
  getProgress,
  markLectureCompleted,
  getLectures,
  getLectureById,
  getAssignments,
  submitAssignment,
  getStudentCourses,
  getStudentProgress,
  getCourseDetails,
  getCourseModules,
  getCourseLessons,
  updateCourseProgress,
  submitCourseAssignment,
} = require('../controllers/studentDashboardController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Sprint 4.2: Course & Video LMS Core APIs
router.get('/course/:courseId', optionalAuth, getCourseDetails);
router.get('/course/:courseId/modules', optionalAuth, getCourseModules);
router.get('/course/:courseId/lessons', optionalAuth, getCourseLessons);
router.patch('/course/:courseId/progress', optionalAuth, updateCourseProgress);
router.post('/course/:courseId/assignment', optionalAuth, submitCourseAssignment);

// Primary Protected Student LMS APIs (Sprint 6.14)
router.get('/', optionalAuth, getDashboardSummary);
router.get('/dashboard', optionalAuth, getDashboardSummary);
router.get('/courses', optionalAuth, getStudentCourses);
router.get('/progress', optionalAuth, getStudentProgress);
router.get('/notifications', optionalAuth, require('../controllers/notificationController').getNotifications);
router.post('/upload', optionalAuth, submitCourseAssignment);
router.post('/assignment/upload', optionalAuth, submitCourseAssignment);
router.post('/assignments/upload', optionalAuth, submitCourseAssignment);

// Public / Demo Fallback Route
router.get('/summary', optionalAuth, getDashboardSummary);

// Enrollments
router.get('/enrollments', optionalAuth, getEnrollments);
router.post('/enrollments', optionalAuth, createEnrollment);

// Progress by Course
router.get('/progress/:courseId', optionalAuth, getProgress);
router.post('/progress/mark-lecture', optionalAuth, markLectureCompleted);

// Recorded Lectures
router.get('/lectures', getLectures);
router.get('/lectures/:id', getLectureById);

// Assignments
router.get('/assignments', getAssignments);
router.post('/assignments/:id/submit', optionalAuth, submitAssignment);

module.exports = router;
