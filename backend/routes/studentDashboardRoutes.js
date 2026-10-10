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

// Primary Protected Student LMS APIs
router.get('/', protect, getDashboardSummary);
router.get('/dashboard', protect, getDashboardSummary);
router.get('/courses', protect, getStudentCourses);
router.get('/progress', protect, getStudentProgress);
router.get('/notifications', protect, require('../controllers/notificationController').getNotifications);
router.post('/upload', protect, submitCourseAssignment);
router.post('/assignment/upload', protect, submitCourseAssignment);
router.post('/assignments/upload', protect, submitCourseAssignment);

// Summary alias
router.get('/summary', protect, getDashboardSummary);

// Enrollments
router.get('/enrollments', protect, getEnrollments);
router.post('/enrollments', protect, createEnrollment);

// Progress by Course
router.get('/progress/:courseId', protect, getProgress);
router.post('/progress/mark-lecture', protect, markLectureCompleted);

// Recorded Lectures
router.get('/lectures', getLectures);
router.get('/lectures/:id', getLectureById);

// Assignments
router.get('/assignments', getAssignments);
router.post('/assignments/:id/submit', protect, submitAssignment);

module.exports = router;
