const express = require('express');
const router = express.Router();
const {
  chatWithMentor,
  getChatHistory,
  startInterview,
  answerInterviewQuestion,
  getInterviewSession,
  getInterviewSessions,
  analyzeResume,
  getResumeReports,
  generateQuiz,
  submitQuizAttempt,
  getQuizHistory,
  generateStudyPlan,
  getActiveStudyPlan,
  toggleMilestone,
  getAIProgress,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// 1. AI Mentor Chat
router.post('/chat', protect, chatWithMentor);
router.get('/chat/history', protect, getChatHistory);

// 2. Mock Interview Bot
router.post('/interview/start', protect, startInterview);
router.post('/interview/answer', protect, answerInterviewQuestion);
router.get('/interview/sessions', protect, getInterviewSessions);
router.get('/interview/:id', protect, getInterviewSession);

// 3. Resume ATS Analyzer
router.post('/resume/analyze', protect, analyzeResume);
router.get('/resume/reports', protect, getResumeReports);

// 4. Dynamic Quiz Generator
router.post('/quiz/generate', protect, generateQuiz);
router.post('/quiz/submit', protect, submitQuizAttempt);
router.get('/quiz/history', protect, getQuizHistory);

// 5. Study Assistant & Roadmaps
router.post('/study-plan/generate', protect, generateStudyPlan);
router.get('/study-plan', protect, getActiveStudyPlan);
router.put('/study-plan/:id/milestone', protect, toggleMilestone);

// 6. Overall Telemetry Progress
router.get('/progress', protect, getAIProgress);

module.exports = router;
