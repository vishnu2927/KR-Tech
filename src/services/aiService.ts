import { api } from "./api";

/* ──────── Types ──────── */

export interface ChatMessage {
  _id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface AIChatSession {
  _id: string;
  sessionId: string;
  mentorPersona: "fullstack" | "cloud_devops" | "system_design" | "cybersecurity" | "dsa" | "general";
  topic: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface InterviewQuestion {
  _id?: string;
  questionId: string;
  questionText: string;
  category: string;
  difficulty: string;
  studentAnswer?: string;
  answeredAt?: string;
  aiFeedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    idealAnswerSummary: string;
  };
}

export interface InterviewSession {
  _id: string;
  targetRole: string;
  interviewType: "technical" | "hr" | "system_design" | "coding";
  difficulty: "entry" | "junior" | "mid" | "senior" | "lead";
  status: "in_progress" | "completed" | "abandoned";
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  overallScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  skillVerdict: "Advanced Mastery" | "Proficient" | "Intermediate" | "Needs More Practice" | "Pending";
  createdAt: string;
}

export interface ResumeReport {
  _id: string;
  targetRole: string;
  targetCompany: string;
  resumeText: string;
  atsScore: number;
  matchRate: number;
  keywordAnalysis: {
    presentKeywords: string[];
    missingKeywords: string[];
    densityRating: string;
  };
  formattingRating: "Excellent" | "Good" | "Needs Improvement";
  sectionScores: {
    summary: number;
    experience: number;
    skills: number;
    projects: number;
    education: number;
  };
  strengths: string[];
  criticalFixes: string[];
  suggestedSummary: string;
  actionableSuggestions: string[];
  createdAt: string;
}

export interface QuizQuestionItem {
  _id?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  selectedOptionIndex?: number;
  isCorrect?: boolean;
  explanation: string;
}

export interface QuizAttempt {
  _id: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  totalQuestions: number;
  score: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  questions: QuizQuestionItem[];
  createdAt: string;
}

export interface StudyPlanWeek {
  _id?: string;
  weekNumber: number;
  title: string;
  description: string;
  topics: string[];
  practicalProject: string;
  milestone: string;
  resources?: { title: string; url: string; type: string }[];
  completed: boolean;
  completedAt?: string | null;
}

export interface StudyPlan {
  _id: string;
  targetRole: string;
  targetTimelineWeeks: number;
  weeklyHours: number;
  currentSkillLevel: "beginner" | "intermediate" | "advanced";
  targetSkills: string[];
  weeks: StudyPlanWeek[];
  overallProgress: number;
  status: "active" | "completed" | "paused";
  createdAt: string;
}

export interface AIProgressStats {
  totalChats: number;
  interviewSessionsCompleted: number;
  averageInterviewScore: number;
  interviewReadinessLevel: string;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  latestResumeAtsScore: number;
  studyRoadmapProgress: number;
  overallMasteryPercentage: number;
}

/* ──────── Service Functions ──────── */

// 1. AI Mentor
export async function sendMentorMessage(payload: {
  sessionId?: string;
  message: string;
  mentorPersona?: string;
  topic?: string;
}): Promise<{
  sessionId: string;
  reply: string;
  mentorPersona: string;
  messages: ChatMessage[];
  modelUsed: string;
}> {
  const res = await api.post<{ success: boolean; data: any }>("/ai/chat", payload);
  return res.data.data;
}

export async function getChatSessions(sessionId?: string): Promise<AIChatSession[]> {
  const res = await api.get<{ success: boolean; data: AIChatSession[] }>("/ai/chat/history", {
    params: sessionId ? { sessionId } : undefined,
  });
  return res.data.data || [];
}

// 2. Mock Interview
export async function startMockInterview(payload: {
  targetRole: string;
  interviewType?: "technical" | "hr" | "system_design" | "coding";
  difficulty?: "entry" | "junior" | "mid" | "senior" | "lead";
}): Promise<InterviewSession> {
  const res = await api.post<{ success: boolean; data: InterviewSession }>("/ai/interview/start", payload);
  return res.data.data;
}

export async function submitInterviewAnswer(payload: {
  sessionId: string;
  questionId: string;
  studentAnswer: string;
}): Promise<{
  session: InterviewSession;
  evaluation: {
    score: number;
    strengths: string[];
    improvements: string[];
    idealAnswerSummary: string;
  };
  isCompleted: boolean;
}> {
  const res = await api.post<{ success: boolean; data: any }>("/ai/interview/answer", payload);
  return res.data.data;
}

export async function getInterviewSessionById(id: string): Promise<InterviewSession> {
  const res = await api.get<{ success: boolean; data: InterviewSession }>(`/ai/interview/${id}`);
  return res.data.data;
}

export async function getInterviewHistory(): Promise<InterviewSession[]> {
  const res = await api.get<{ success: boolean; data: InterviewSession[] }>("/ai/interview/sessions");
  return res.data.data || [];
}

// 3. Resume ATS Analyzer
export async function analyzeResumeText(payload: {
  resumeText: string;
  targetRole?: string;
  targetCompany?: string;
}): Promise<ResumeReport> {
  const res = await api.post<{ success: boolean; data: ResumeReport }>("/ai/resume/analyze", payload);
  return res.data.data;
}

export async function getResumeAnalysisHistory(): Promise<ResumeReport[]> {
  const res = await api.get<{ success: boolean; data: ResumeReport[] }>("/ai/resume/reports");
  return res.data.data || [];
}

// 4. Dynamic Quiz Generator
export async function generateQuizQuestions(payload: {
  topic: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  count?: number;
}): Promise<{
  topic: string;
  difficulty: string;
  totalQuestions: number;
  questions: QuizQuestionItem[];
}> {
  const res = await api.post<{ success: boolean; data: any }>("/ai/quiz/generate", payload);
  return res.data.data;
}

export async function submitQuizResults(payload: {
  topic: string;
  difficulty: string;
  questions: QuizQuestionItem[];
  timeSpentSeconds?: number;
}): Promise<QuizAttempt> {
  const res = await api.post<{ success: boolean; data: QuizAttempt }>("/ai/quiz/submit", payload);
  return res.data.data;
}

export async function getQuizAttemptsHistory(): Promise<QuizAttempt[]> {
  const res = await api.get<{ success: boolean; data: QuizAttempt[] }>("/ai/quiz/history");
  return res.data.data || [];
}

// 5. Study Assistant
export async function generateCustomStudyPlan(payload: {
  targetRole: string;
  timelineWeeks?: number;
  weeklyHours?: number;
  currentLevel?: "beginner" | "intermediate" | "advanced";
}): Promise<StudyPlan> {
  const res = await api.post<{ success: boolean; data: StudyPlan }>("/ai/study-plan/generate", payload);
  return res.data.data;
}

export async function getCurrentStudyPlan(): Promise<StudyPlan | null> {
  const res = await api.get<{ success: boolean; data: StudyPlan | null }>("/ai/study-plan");
  return res.data.data;
}

export async function toggleStudyMilestone(
  planId: string,
  weekNumber: number,
  completed: boolean
): Promise<StudyPlan> {
  const res = await api.put<{ success: boolean; data: StudyPlan }>(`/ai/study-plan/${planId}/milestone`, {
    weekNumber,
    completed,
  });
  return res.data.data;
}

// 6. Overall Telemetry Progress
export async function getAIProgressTelemetry(): Promise<AIProgressStats> {
  const res = await api.get<{ success: boolean; data: AIProgressStats }>("/ai/progress");
  return res.data.data;
}
