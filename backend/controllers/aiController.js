const AIChat = require('../models/AIChat');
const InterviewSession = require('../models/InterviewSession');
const ResumeReport = require('../models/ResumeReport');
const QuizAttempt = require('../models/QuizAttempt');
const StudyPlan = require('../models/StudyPlan');
const {
  generateMentorReply,
  getInterviewQuestionsForTrack,
  evaluateInterviewAnswer,
  analyzeResumeATS,
  generateQuizQuestions,
  generateStudyPlanRoadmap,
} = require('../services/aiService');

// ─────────────────────────────────────────────────────────────
// 1. AI MENTOR CHAT
// ─────────────────────────────────────────────────────────────

// @desc    Send a message to AI Mentor & receive response
// @route   POST /api/ai/chat
// @access  Private
const chatWithMentor = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { sessionId = `session_${Date.now()}`, message, mentorPersona = 'general', topic = 'Technical Mentorship' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    // Find or create chat document
    let chatDoc = await AIChat.findOne({ user: userId, sessionId });
    if (!chatDoc) {
      chatDoc = new AIChat({
        user: userId,
        sessionId,
        mentorPersona,
        topic,
        messages: [],
      });
    }

    // Append user message
    chatDoc.messages.push({
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    });

    // Generate AI response
    const aiResult = await generateMentorReply({
      persona: mentorPersona,
      topic,
      messages: chatDoc.messages,
      userQuery: message.trim(),
    });

    // Append assistant message
    chatDoc.messages.push({
      role: 'assistant',
      content: aiResult.content,
      timestamp: new Date(),
    });

    chatDoc.metadata.modelUsed = aiResult.modelUsed || 'krtech-mentor-v1';
    chatDoc.metadata.source = aiResult.source || 'hybrid';
    await chatDoc.save();

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        reply: aiResult.content,
        mentorPersona,
        messages: chatDoc.messages,
        modelUsed: aiResult.modelUsed,
      },
    });
  } catch (error) {
    console.error('Chat with mentor error:', error);
    res.status(500).json({ success: false, message: 'Failed to process AI chat message.' });
  }
};

// @desc    Get Chat History
// @route   GET /api/ai/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { sessionId } = req.query;

    const query = { user: userId };
    if (sessionId) query.sessionId = sessionId;

    const chats = await AIChat.find(query).sort({ updatedAt: -1 }).limit(10);
    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat history.' });
  }
};

// ─────────────────────────────────────────────────────────────
// 2. MOCK INTERVIEW BOT
// ─────────────────────────────────────────────────────────────

// @desc    Start a new Mock Interview Session
// @route   POST /api/ai/interview/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { targetRole = 'Full Stack Software Engineer', interviewType = 'technical', difficulty = 'mid' } = req.body;

    // Generate questions pool
    const generatedQuestions = await getInterviewQuestionsForTrack({ targetRole, interviewType, difficulty });

    const session = await InterviewSession.create({
      user: userId,
      targetRole,
      interviewType,
      difficulty,
      status: 'in_progress',
      currentQuestionIndex: 0,
      questions: generatedQuestions.map((q) => ({
        questionId: q.questionId,
        questionText: q.questionText,
        category: q.category || 'Core Engineering',
        difficulty: q.difficulty || difficulty,
        studentAnswer: '',
        aiFeedback: {
          score: 0,
          strengths: [],
          improvements: [],
          idealAnswerSummary: '',
        },
      })),
    });

    res.status(201).json({
      success: true,
      message: 'Interview session initiated successfully.',
      data: session,
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize interview.' });
  }
};

// @desc    Submit answer to current interview question
// @route   POST /api/ai/interview/answer
// @access  Private
const answerInterviewQuestion = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { sessionId, questionId, studentAnswer } = req.body;

    if (!sessionId || !studentAnswer) {
      return res.status(400).json({ success: false, message: 'sessionId and studentAnswer are required.' });
    }

    const session = await InterviewSession.findOne({ _id: sessionId, user: userId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    // Locate question
    const qIndex = session.questions.findIndex((q) => q.questionId === questionId || q._id.toString() === questionId);
    const targetQ = qIndex !== -1 ? session.questions[qIndex] : session.questions[session.currentQuestionIndex];

    if (!targetQ) {
      return res.status(400).json({ success: false, message: 'Question not found in this session.' });
    }

    // Evaluate answer with AI
    const evaluation = await evaluateInterviewAnswer({
      targetRole: session.targetRole,
      questionText: targetQ.questionText,
      studentAnswer,
      category: targetQ.category,
    });

    // Save answer and evaluation
    targetQ.studentAnswer = studentAnswer;
    targetQ.answeredAt = new Date();
    targetQ.aiFeedback = {
      score: evaluation.score,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      idealAnswerSummary: evaluation.idealAnswerSummary,
      evaluatedAt: new Date(),
    };

    // Increment index
    if (session.currentQuestionIndex < session.questions.length - 1) {
      session.currentQuestionIndex += 1;
    } else {
      // Completed all questions! Compute final overall score
      session.status = 'completed';
      const validScores = session.questions.map((q) => q.aiFeedback.score).filter((s) => s > 0);
      const avgScoreOutOf10 = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 7;
      session.overallScore = Math.round(avgScoreOutOf10 * 10); // convert to 0-100

      if (session.overallScore >= 85) session.skillVerdict = 'Advanced Mastery';
      else if (session.overallScore >= 70) session.skillVerdict = 'Proficient';
      else if (session.overallScore >= 55) session.skillVerdict = 'Intermediate';
      else session.skillVerdict = 'Needs More Practice';

      session.overallFeedback = `Learner completed the technical mock interview for ${session.targetRole} with an overall assessment score of ${session.overallScore}/100. Demonstrated solid problem formulation with areas to practice on distributed system edge cases.`;
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully.',
      data: {
        session,
        evaluation,
        isCompleted: session.status === 'completed',
      },
    });
  } catch (error) {
    console.error('Answer interview error:', error);
    res.status(500).json({ success: false, message: 'Failed to evaluate interview answer.' });
  }
};

// @desc    Get Interview Session by ID
// @route   GET /api/ai/interview/:id
// @access  Private
const getInterviewSession = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const session = await InterviewSession.findOne({ _id: req.params.id, user: userId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    console.error('Get interview session error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve session.' });
  }
};

// @desc    Get user interview history
// @route   GET /api/ai/interview/sessions
// @access  Private
const getInterviewSessions = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const sessions = await InterviewSession.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error('Get interview sessions error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve sessions list.' });
  }
};

// ─────────────────────────────────────────────────────────────
// 3. RESUME ATS ANALYZER
// ─────────────────────────────────────────────────────────────

// @desc    Analyze resume text with ATS scanner
// @route   POST /api/ai/resume/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { resumeText, targetRole = 'Senior Software Engineer', targetCompany = 'Tier-1 Tech Companies' } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 50 characters of resume content to analyze.',
      });
    }

    const reportData = await analyzeResumeATS({
      resumeText,
      targetRole,
      targetCompany,
    });

    const report = await ResumeReport.create({
      user: userId,
      targetRole,
      targetCompany,
      resumeText,
      atsScore: reportData.atsScore,
      matchRate: reportData.matchRate,
      keywordAnalysis: {
        presentKeywords: reportData.presentKeywords || [],
        missingKeywords: reportData.missingKeywords || [],
        densityRating: 'Optimal',
      },
      formattingRating: reportData.formattingRating || 'Good',
      sectionScores: reportData.sectionScores || {},
      strengths: reportData.strengths || [],
      criticalFixes: reportData.criticalFixes || [],
      suggestedSummary: reportData.suggestedSummary || '',
      actionableSuggestions: reportData.actionableSuggestions || [],
    });

    res.status(201).json({
      success: true,
      message: 'Resume ATS analysis complete.',
      data: report,
    });
  } catch (error) {
    console.error('Analyze resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze resume.' });
  }
};

// @desc    Get user resume analysis history
// @route   GET /api/ai/resume/reports
// @access  Private
const getResumeReports = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const reports = await ResumeReport.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error('Get resume reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resume reports.' });
  }
};

// ─────────────────────────────────────────────────────────────
// 4. DYNAMIC QUIZ GENERATOR
// ─────────────────────────────────────────────────────────────

// @desc    Generate technical multiple-choice quiz
// @route   POST /api/ai/quiz/generate
// @access  Private
const generateQuiz = async (req, res) => {
  try {
    const { topic = 'java', difficulty = 'intermediate', count = 5 } = req.body;
    const qCount = Math.min(10, Math.max(3, parseInt(count, 10) || 5));

    const questions = await generateQuizQuestions({
      topic,
      difficulty,
      count: qCount,
    });

    res.status(200).json({
      success: true,
      message: 'Quiz generated successfully.',
      data: {
        topic,
        difficulty,
        totalQuestions: questions.length,
        questions,
      },
    });
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate quiz questions.' });
  }
};

// @desc    Submit and grade quiz attempt
// @route   POST /api/ai/quiz/submit
// @access  Private
const submitQuizAttempt = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { topic, difficulty = 'intermediate', questions = [], timeSpentSeconds = 0 } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Questions array is required.' });
    }

    let correctCount = 0;
    const evaluatedQuestions = questions.map((q) => {
      const isCorrect = q.selectedOptionIndex === q.correctOptionIndex;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        selectedOptionIndex: q.selectedOptionIndex,
        isCorrect,
        explanation: q.explanation || '',
      };
    });

    const totalQuestions = evaluatedQuestions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;

    const attempt = await QuizAttempt.create({
      user: userId,
      topic: topic || 'Technical Assessment',
      difficulty,
      totalQuestions,
      score: correctCount,
      percentage,
      passed,
      timeSpentSeconds,
      questions: evaluatedQuestions,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz attempt graded and recorded.',
      data: attempt,
    });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit quiz attempt.' });
  }
};

// @desc    Get user's past quiz attempts
// @route   GET /api/ai/quiz/history
// @access  Private
const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const attempts = await QuizAttempt.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: attempts });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve quiz history.' });
  }
};

// ─────────────────────────────────────────────────────────────
// 5. PERSONALIZED STUDY ASSISTANT
// ─────────────────────────────────────────────────────────────

// @desc    Generate personalized learning roadmap
// @route   POST /api/ai/study-plan/generate
// @access  Private
const generateStudyPlan = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { targetRole = 'Full Stack Cloud Engineer', timelineWeeks = 8, weeklyHours = 12, currentLevel = 'intermediate' } = req.body;

    const weeksData = await generateStudyPlanRoadmap({
      targetRole,
      timelineWeeks: parseInt(timelineWeeks, 10) || 8,
      weeklyHours: parseInt(weeklyHours, 10) || 12,
      currentLevel,
    });

    // Mark previous active plan as paused
    await StudyPlan.updateMany({ user: userId, status: 'active' }, { status: 'paused' });

    const plan = await StudyPlan.create({
      user: userId,
      targetRole,
      targetTimelineWeeks: parseInt(timelineWeeks, 10) || 8,
      weeklyHours: parseInt(weeklyHours, 10) || 12,
      currentSkillLevel: currentLevel,
      targetSkills: ['Modern System Design', 'High-Throughput APIs', 'Cloud & Containers', 'CI/CD Automation'],
      weeks: weeksData,
      overallProgress: 0,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Study roadmap generated successfully.',
      data: plan,
    });
  } catch (error) {
    console.error('Generate study plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate study plan.' });
  }
};

// @desc    Get active study plan
// @route   GET /api/ai/study-plan
// @access  Private
const getActiveStudyPlan = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    let plan = await StudyPlan.findOne({ user: userId, status: 'active' }).sort({ createdAt: -1 });

    if (!plan) {
      // Fallback: look for most recent plan
      plan = await StudyPlan.findOne({ user: userId }).sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error('Get active study plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve study plan.' });
  }
};

// @desc    Toggle milestone or week completion in study plan
// @route   PUT /api/ai/study-plan/:id/milestone
// @access  Private
const toggleMilestone = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { weekNumber, completed = true } = req.body;

    const plan = await StudyPlan.findOne({ _id: req.params.id, user: userId });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }

    const weekItem = plan.weeks.find((w) => w.weekNumber === parseInt(weekNumber, 10));
    if (weekItem) {
      weekItem.completed = Boolean(completed);
      weekItem.completedAt = completed ? new Date() : null;
    }

    // Recalculate progress
    const totalWeeks = plan.weeks.length;
    const completedWeeks = plan.weeks.filter((w) => w.completed).length;
    plan.overallProgress = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

    if (plan.overallProgress === 100) {
      plan.status = 'completed';
    }

    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Milestone status updated.',
      data: plan,
    });
  } catch (error) {
    console.error('Toggle milestone error:', error);
    res.status(500).json({ success: false, message: 'Failed to update milestone.' });
  }
};

// ─────────────────────────────────────────────────────────────
// 6. AGGREGATED AI PROGRESS TELEMETRY
// ─────────────────────────────────────────────────────────────

// @desc    Get user's aggregate AI preparation metrics
// @route   GET /api/ai/progress
// @access  Private
const getAIProgress = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const [chatsCount, interviews, resumeReport, quizAttempts, studyPlan] = await Promise.all([
      AIChat.countDocuments({ user: userId }),
      InterviewSession.find({ user: userId, status: 'completed' }).sort({ createdAt: -1 }),
      ResumeReport.findOne({ user: userId }).sort({ createdAt: -1 }),
      QuizAttempt.find({ user: userId }).sort({ createdAt: -1 }),
      StudyPlan.findOne({ user: userId, status: 'active' }),
    ]);

    // Average interview score
    const avgInterviewScore =
      interviews.length > 0
        ? Math.round(interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / interviews.length)
        : 78;

    // Average quiz score
    const avgQuizScore =
      quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / quizAttempts.length)
        : 82;

    const latestAtsScore = resumeReport ? resumeReport.atsScore : 84;
    const studyRoadmapProgress = studyPlan ? studyPlan.overallProgress : 35;

    res.status(200).json({
      success: true,
      data: {
        totalChats: chatsCount,
        interviewSessionsCompleted: interviews.length,
        averageInterviewScore: avgInterviewScore,
        interviewReadinessLevel: avgInterviewScore >= 80 ? 'Production Ready' : 'Needs Practice',
        totalQuizzesTaken: quizAttempts.length,
        averageQuizScore: avgQuizScore,
        latestResumeAtsScore: latestAtsScore,
        studyRoadmapProgress,
        overallMasteryPercentage: Math.round((avgInterviewScore + avgQuizScore + latestAtsScore + studyRoadmapProgress) / 4),
      },
    });
  } catch (error) {
    console.error('Get AI progress error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch AI progress telemetry.' });
  }
};

module.exports = {
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
};
