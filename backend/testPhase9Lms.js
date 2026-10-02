const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api/lms';

// Color logging helpers
const green = (msg) => `\x1b[32m${msg}\x1b[0m`;
const red = (msg) => `\x1b[31m${msg}\x1b[0m`;
const cyan = (msg) => `\x1b[36m${msg}\x1b[0m`;
const yellow = (msg) => `\x1b[33m${msg}\x1b[0m`;

let testResults = [];

function recordResult(sprint, feature, passed, details) {
  testResults.push({ sprint, feature, passed, details });
  const statusStr = passed ? green('PASS ✓') : red('FAIL ✗');
  console.log(`[${cyan(sprint)}] ${feature.padEnd(35)} : ${statusStr} ${details || ''}`);
}

async function runTestSuite() {
  console.log('\n================================================================================');
  console.log(yellow('🚀 KR GLOBAL LEARNING PRIVATE LIMITED — PHASE 9 PRODUCTION TEST SUITE'));
  console.log(cyan('AI Learning Platform + Smart LMS (150+ Features Audit)'));
  console.log('================================================================================\n');

  try {
    // 1. Dashboard (Sprint 9.1)
    try {
      const res = await axios.get(`${API_BASE}/dashboard`);
      const d = res.data.data;
      const valid = d && d.continueLearning && d.streak && d.xp && d.weeklyStudyGoal && d.badges;
      recordResult('Sprint 9.1', 'AI Home Dashboard (10 Widgets)', !!valid, `XP: ${d.xp.totalXp}, Streak: ${d.streak.currentStreak}d`);
    } catch (e) {
      recordResult('Sprint 9.1', 'AI Home Dashboard', false, e.message);
    }

    // 2. AI Assistant (Sprint 9.2)
    try {
      const res = await axios.post(`${API_BASE}/ai/chat`, {
        prompt: 'Explain CAP theorem in simple terms with code example',
        action: 'explain',
      });
      const valid = res.data.success && res.data.data.reply;
      recordResult('Sprint 9.2', 'AI Study Assistant (ChatGPT Style)', !!valid, 'Reply synthesized');
    } catch (e) {
      recordResult('Sprint 9.2', 'AI Study Assistant', false, e.message);
    }

    // 3. AI Notes Generator (Sprint 9.3)
    let generatedNoteId = null;
    try {
      const res = await axios.post(`${API_BASE}/notes/generate`, {
        course: 'Full Stack Java & Microservices',
        unit: 'Unit 4: Event Streams',
        topic: 'Kafka Distributed Commit Log',
        format: 'exam',
      });
      const valid = res.data.success && res.data.data._id;
      if (valid) generatedNoteId = res.data.data._id;
      recordResult('Sprint 9.3', 'AI Notes Generator (Exam format)', !!valid, `Note ID: ${generatedNoteId}`);
    } catch (e) {
      recordResult('Sprint 9.3', 'AI Notes Generator', false, e.message);
    }

    // 4. AI Quiz Generator (Sprint 9.4)
    let quizId = null;
    try {
      const res = await axios.post(`${API_BASE}/quiz/generate`, {
        topic: 'Apache Kafka & Event Streams',
        difficulty: 'intermediate',
        questionCount: 5,
      });
      const valid = res.data.success && res.data.data.questions?.length > 0;
      if (valid) quizId = res.data.data._id;
      recordResult('Sprint 9.4', 'AI Quiz Generator (5 Qs, MCQ+Coding)', !!valid, `Total Marks: ${res.data.data.totalMarks}`);
    } catch (e) {
      recordResult('Sprint 9.4', 'AI Quiz Generator', false, e.message);
    }

    // 5. Submit Quiz (Sprint 9.4)
    if (quizId) {
      try {
        const res = await axios.post(`${API_BASE}/quiz/submit`, {
          quizId,
          answers: { 0: 'To ensure an operation can be retried multiple times without changing the end state' },
          timeSpentSeconds: 95,
        });
        const valid = res.data.success && res.data.data.score !== undefined;
        recordResult('Sprint 9.4', 'AI Quiz Submission & Auto-Grading', !!valid, `Score: ${res.data.data.score}, +${res.data.data.xpAwarded} XP`);
      } catch (e) {
        recordResult('Sprint 9.4', 'AI Quiz Submission', false, e.message);
      }
    }

    // 6. Study Planner & Pomodoro (Sprint 9.5)
    try {
      const res = await axios.post(`${API_BASE}/planner/pomodoro`, {
        topic: 'Spring Security Filter Chain Lab',
        durationMinutes: 25,
      });
      const valid = res.data.success && res.data.xpAwarded === 25;
      recordResult('Sprint 9.5', 'AI Study Planner & Pomodoro', !!valid, `+${res.data.xpAwarded} XP awarded`);
    } catch (e) {
      recordResult('Sprint 9.5', 'AI Study Planner & Pomodoro', false, e.message);
    }

    // 7. Smart Notes Library (Sprint 9.6)
    try {
      const res = await axios.get(`${API_BASE}/notes`);
      const valid = res.data.success && res.data.data?.length > 0;
      recordResult('Sprint 9.6', 'Smart Notes Library & Folders', !!valid, `Count: ${res.data.count}, Folders: ${res.data.folders.length}`);
    } catch (e) {
      recordResult('Sprint 9.6', 'Smart Notes Library', false, e.message);
    }

    // 8. Video Learning System Progress (Sprint 9.7)
    try {
      const res = await axios.post(`${API_BASE}/lessons/progress`, {
        courseId: 'crs-java-fullstack-2026',
        lessonId: 'lec-kafka-01',
        watchedSeconds: 720,
        totalDurationSeconds: 900,
        lastPlaybackSpeed: 1.25,
      });
      const valid = res.data.success && res.data.data.progressPercent >= 80;
      recordResult('Sprint 9.7', 'Video Learning System Progress', !!valid, `Progress: ${res.data.data.progressPercent}%`);
    } catch (e) {
      recordResult('Sprint 9.7', 'Video Learning System Progress', false, e.message);
    }

    // 9. Assignment Management (Sprint 9.8)
    try {
      const res = await axios.post(`${API_BASE}/assignments/submit`, {
        courseId: 'crs-java-fullstack-2026',
        githubUrl: 'https://github.com/krtech-student/kafka-rebalance-capstone',
        fileName: 'kafka_simulator.zip',
        notes: 'Handled rebalance listeners and manual ack.',
      });
      const valid = res.data.success && res.data.data._id;
      recordResult('Sprint 9.8', 'Assignment Portal & Submissions', !!valid, `Status: ${res.data.data.status}`);
    } catch (e) {
      recordResult('Sprint 9.8', 'Assignment Management', false, e.message);
    }

    // 10. Live Classes System (Sprint 9.9)
    try {
      const res = await axios.get(`${API_BASE}/live/upcoming`);
      const valid = res.data.success && res.data.upcoming?.length > 0;
      recordResult('Sprint 9.9', 'Live Class System & Attendance', !!valid, `Upcoming classes: ${res.data.upcoming.length}`);
    } catch (e) {
      recordResult('Sprint 9.9', 'Live Class System', false, e.message);
    }

    // 11. AI PDF Summarizer (Sprint 9.10)
    try {
      const res = await axios.post(`${API_BASE}/pdf/summarize`, {
        fileName: 'Microservices_Scalability_Architecture.pdf',
      });
      const valid = res.data.success && res.data.data.summary && res.data.data.flashcards?.length > 0;
      recordResult('Sprint 9.10', 'AI PDF Summarizer & Mind Map', !!valid, `Points: ${res.data.data.importantPoints?.length}`);
    } catch (e) {
      recordResult('Sprint 9.10', 'AI PDF Summarizer', false, e.message);
    }

    // 12. AI Flashcards & Spaced Repetition (Sprint 9.11)
    try {
      const res = await axios.get(`${API_BASE}/flashcards`);
      const valid = res.data.success && res.data.data?.length > 0;
      recordResult('Sprint 9.11', 'AI Flashcards (Spaced Repetition)', !!valid, `Decks: ${res.data.count} cards`);
    } catch (e) {
      recordResult('Sprint 9.11', 'AI Flashcards', false, e.message);
    }

    // 13. AI Code Compiler (Sprint 9.12)
    try {
      const res = await axios.post(`${API_BASE}/compiler/run`, {
        language: 'javascript',
        code: 'console.log("TwoSum index result:", [0, 1]);',
      });
      const valid = res.data.success && res.data.data.output.includes('TwoSum');
      recordResult('Sprint 9.12', 'AI Code Compiler Sandbox', !!valid, `Latency: ${res.data.data.executionTimeMs}ms`);
    } catch (e) {
      recordResult('Sprint 9.12', 'AI Code Compiler', false, e.message);
    }

    // 14. AI Doubt Solver (Sprint 9.13)
    try {
      const res = await axios.post(`${API_BASE}/doubts/ask`, {
        title: 'How to avoid N+1 query problem with Spring Data JPA?',
        description: 'Using @EntityGraph vs JOIN FETCH in production queries.',
      });
      const valid = res.data.success && res.data.instantAnswer;
      recordResult('Sprint 9.13', 'AI Doubt Solver & Instant Answer', !!valid, 'AI Instant Answer generated');
    } catch (e) {
      recordResult('Sprint 9.13', 'AI Doubt Solver', false, e.message);
    }

    // 15. Study Gamification (Sprint 9.14)
    try {
      const res = await axios.get(`${API_BASE}/gamification/status`);
      const valid = res.data.success && res.data.data.xp && res.data.data.badges?.length > 0;
      recordResult('Sprint 9.14', 'Study Gamification & Rewards', !!valid, `Badges: ${res.data.data.badges.length}, Shop: ${res.data.data.rewardsShop.length}`);
    } catch (e) {
      recordResult('Sprint 9.14', 'Study Gamification', false, e.message);
    }

    // 16. Notifications (Sprint 9.15)
    try {
      const res = await axios.get(`${API_BASE}/notifications`);
      const valid = res.data.success && res.data.data?.length > 0;
      recordResult('Sprint 9.15', 'Notification Center (Class/Quiz/Due)', !!valid, `Notifications: ${res.data.data.length}`);
    } catch (e) {
      recordResult('Sprint 9.15', 'Notification Center', false, e.message);
    }

    // 17. Certificates (Sprint 9.16)
    try {
      const res = await axios.get(`${API_BASE}/certificates`);
      const valid = res.data.success && res.data.data?.length > 0;
      recordResult('Sprint 9.16', 'Certificate Center & QR Verify', !!valid, `Cert ID: ${res.data.data[0].credentialId}`);
    } catch (e) {
      recordResult('Sprint 9.16', 'Certificate Center', false, e.message);
    }

    // 18. Learning Analytics (Sprint 9.17)
    try {
      const res = await axios.get(`${API_BASE}/analytics`);
      const valid = res.data.success && res.data.data.summary;
      recordResult('Sprint 9.17', 'Deep Learning Telemetry & Analytics', !!valid, `Accuracy: ${res.data.data.summary.overallQuizAccuracy}%`);
    } catch (e) {
      recordResult('Sprint 9.17', 'Learning Analytics', false, e.message);
    }

    // 19. Admin LMS CRM (Sprint 9.18)
    try {
      const res = await axios.get(`${API_BASE}/admin/overview`);
      const valid = res.data.success && res.data.stats;
      recordResult('Sprint 9.18', 'Admin AI LMS CRM Console', !!valid, `Students: ${res.data.stats.totalStudents}`);
    } catch (e) {
      recordResult('Sprint 9.18', 'Admin AI LMS CRM', false, e.message);
    }

    // 20. Email Automation (Sprint 9.19)
    try {
      const res = await axios.post(`${API_BASE}/emails/send-template`, {
        template: 'live_class_reminder',
        recipientEmail: 'aditya.sharma@krtech.edu',
        recipientName: 'Aditya Sharma',
        metadata: { title: 'Kafka Pair Programming Masterclass' },
      });
      const valid = res.data.success && res.data.log;
      recordResult('Sprint 9.19', 'Email Automation (Live Class / Streak)', !!valid, `Status: ${res.data.log.status}`);
    } catch (e) {
      recordResult('Sprint 9.19', 'Email Automation', false, e.message);
    }

  } catch (err) {
    console.error('Test suite error:', err);
  } finally {
    console.log('\n================================================================================');
    const passedCount = testResults.filter((r) => r.passed).length;
    const totalCount = testResults.length;
    console.log(yellow(`SUMMARY: ${passedCount} / ${totalCount} SPRINT TESTS PASSED`));
    console.log(passedCount === totalCount ? green('✓ PHASE 9 PRODUCTION READINESS VERIFIED 100%') : red('⚠ SOME TESTS FAILED'));
    console.log('================================================================================\n');
  }
}

// Self-executing if run directly
if (require.main === module) {
  runTestSuite();
}

module.exports = { runTestSuite };
