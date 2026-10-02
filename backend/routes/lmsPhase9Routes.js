const express = require('express');
const router = express.Router();
const lmsCtrl = require('../controllers/lmsPhase9Controller');

// Optional auth middleware fallback (allows both demo/preview & logged in tokens)
let authMiddleware = (req, res, next) => next();
try {
  const { protect } = require('../middleware/authMiddleware');
  if (protect) {
    authMiddleware = (req, res, next) => {
      // If Authorization header present, verify token, otherwise proceed as guest student
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return protect(req, res, next);
      }
      return next();
    };
  }
} catch (e) {
  // fallback
}

// Sprint 9.1: AI Home Dashboard
router.get('/dashboard', authMiddleware, lmsCtrl.getDashboardData);

// Sprint 9.2: AI Study Assistant
router.post('/ai/chat', authMiddleware, lmsCtrl.aiAssistantChat);

// Sprint 9.3: AI Notes Generator
router.post('/notes/generate', authMiddleware, lmsCtrl.generateNotes);
router.get('/notes/ai', authMiddleware, lmsCtrl.getAINotes);

// Sprint 9.4: AI Quiz Generator
router.post('/quiz/generate', authMiddleware, lmsCtrl.generateQuiz);
router.post('/quiz/submit', authMiddleware, lmsCtrl.submitQuiz);
router.get('/quiz/leaderboard', authMiddleware, lmsCtrl.getQuizLeaderboard);

// Sprint 9.5: AI Study Planner
router.get('/planner', authMiddleware, lmsCtrl.getStudyPlan);
router.post('/planner/pomodoro', authMiddleware, lmsCtrl.logPomodoroSession);

// Sprint 9.6: Smart Notes Library
router.get('/notes', authMiddleware, lmsCtrl.getSmartNotes);
router.post('/notes', authMiddleware, lmsCtrl.createSmartNote);

// Sprint 9.7: Video Learning System
router.post('/lessons/progress', authMiddleware, lmsCtrl.updateLessonProgress);

// Sprint 9.8: Assignment Management
router.get('/assignments', authMiddleware, lmsCtrl.getAssignments);
router.post('/assignments/submit', authMiddleware, lmsCtrl.submitAssignment);

// Sprint 9.9: Live Class System
router.get('/live/upcoming', authMiddleware, lmsCtrl.getLiveClasses);
router.post('/live/join/:id', authMiddleware, lmsCtrl.joinLiveClass);

// Sprint 9.10: AI PDF Summarizer
router.post('/pdf/summarize', authMiddleware, lmsCtrl.summarizePdf);

// Sprint 9.11: AI Flashcard Generator
router.get('/flashcards', authMiddleware, lmsCtrl.getFlashcards);
router.post('/flashcards/review/:id', authMiddleware, lmsCtrl.reviewFlashcard);

// Sprint 9.12: AI Code Compiler
router.post('/compiler/run', authMiddleware, lmsCtrl.runCode);
router.post('/compiler/assist', authMiddleware, lmsCtrl.aiCodeAssist);

// Sprint 9.13: AI Doubt Solver
router.get('/doubts', authMiddleware, lmsCtrl.getDoubts);
router.post('/doubts/ask', authMiddleware, lmsCtrl.askDoubt);

// Sprint 9.14: Study Gamification
router.get('/gamification/status', authMiddleware, lmsCtrl.getGamificationStatus);

// Sprint 9.15: Notification Center
router.get('/notifications', authMiddleware, lmsCtrl.getNotifications);

// Sprint 9.16: Certificate Center
router.get('/certificates', authMiddleware, lmsCtrl.getCertificates);

// Sprint 9.17: Learning Analytics
router.get('/analytics', authMiddleware, lmsCtrl.getLearningAnalytics);

// Sprint 9.18: Admin AI LMS CRM
router.get('/admin/overview', authMiddleware, lmsCtrl.getAdminLmsOverview);

// Sprint 9.19: Email Automation (AI LMS)
router.post('/emails/send-template', authMiddleware, lmsCtrl.sendLmsEmailNotification);

module.exports = router;
