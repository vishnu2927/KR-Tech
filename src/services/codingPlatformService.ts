import { api } from './api';

export interface InterviewQuestion {
  questionId: string;
  questionText: string;
  category: string;
  idealAnswer?: string;
  studentAnswer?: string;
  feedback?: string;
  score?: number;
  technicalAccuracy?: number;
  communicationClarity?: number;
  fillerWordCount?: number;
  sentiment?: string;
}

export interface InterviewSessionData {
  _id: string;
  type: 'technical' | 'hr' | 'system_design';
  targetCompany: string;
  targetRole: string;
  difficulty: string;
  status: 'in_progress' | 'completed';
  questions: InterviewQuestion[];
  overallScore: number;
  strengths?: string[];
  improvements?: string[];
  createdAt: string;
}

export interface DSAProblemItem {
  id: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance: string;
  category: string;
  companies: string[];
  description: string;
  examples: { input: string; output: string }[];
  starterTemplates: Record<string, string>;
}

export interface ReadinessData {
  overallReadinessPercent: number;
  dsaScore: number;
  systemDesignScore: number;
  resumeScore: number;
  mockInterviewScore: number;
  targetTier: string;
  verdict: string;
  recommendedActions: { area: string; action: string; impact: string }[];
}

export const codingPlatformService = {
  // 1. Mock Interview Flow
  async startInterview(payload: {
    type?: string;
    targetCompany?: string;
    targetRole?: string;
    difficulty?: string;
  }): Promise<{ interview: InterviewSessionData }> {
    const res = await api.post('/interview/start', payload);
    return res.data;
  },

  async answerQuestion(payload: {
    interviewId: string;
    questionIndex: number;
    studentAnswer: string;
  }): Promise<{
    questionScore: number;
    feedback: string;
    fillerWordCount: number;
    isCompleted: boolean;
    interview: InterviewSessionData;
  }> {
    const res = await api.post('/interview/answer', payload);
    return res.data;
  },

  async getInterviewAnalytics(studentEmail?: string) {
    const res = await api.get('/interview/analytics', { params: { studentEmail } });
    return res.data.analytics;
  },

  // 2. ATS Resume Analysis
  async analyzeResume(payload: {
    resumeText: string;
    targetRole?: string;
    targetCompany?: string;
  }) {
    const res = await api.post('/resume/analyze', payload);
    return res.data.report;
  },

  // 3. Online Code Compiler Sandbox
  async runCode(payload: {
    code: string;
    language: string;
    stdin?: string;
  }): Promise<{
    success: boolean;
    stdout: string;
    stderr: string | null;
    runtimeMs: number;
    memoryKb: number;
    status: string;
  }> {
    const res = await api.post('/compiler/run', payload);
    return res.data;
  },

  // 4. DSA Problem Solver
  async getDSAProblems(params?: { category?: string; difficulty?: string; search?: string }) {
    const res = await api.get('/dsa/problems', { params });
    return res.data.problems as DSAProblemItem[];
  },

  async submitDSACode(payload: {
    problemId: string;
    language: string;
    code: string;
  }) {
    const res = await api.post('/dsa/submit', payload);
    return res.data;
  },

  // 5. Holistic Skill & Certification Readiness
  async getReadiness(studentEmail?: string): Promise<ReadinessData> {
    const res = await api.get('/readiness', { params: { studentEmail } });
    return res.data.readiness;
  },

  // 6. System Design Simulator
  async getSystemDesignProblems() {
    const res = await api.get('/system-design/problems');
    return res.data.problems;
  },

  async saveSystemDesignSession(payload: any) {
    const res = await api.post('/system-design/save', payload);
    return res.data;
  },
};
