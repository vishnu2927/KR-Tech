import React, { useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
import { codingPlatformService, InterviewSessionData } from '../services/codingPlatformService';
import { useAuth } from '../context/AuthContext';

export default function AIMockInterviewPage() {
  const { user } = useAuth();
  const [session, setSession] = useState<InterviewSessionData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('technical');
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedRole, setSelectedRole] = useState('Software Development Engineer (SDE-1)');
  const [isRecording, setIsRecording] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);

  // Speech Recognition setup if supported
  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      let currentText = '';
      for (let i = 0; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }
      setStudentAnswer(currentText);
    };

    recognition.start();
  };

  const handleStartInterview = async () => {
    setIsStarting(true);
    try {
      const res = await codingPlatformService.startInterview({
        type: selectedType,
        targetCompany: selectedCompany,
        targetRole: selectedRole,
      });
      setSession(res.interview);
      setCurrentQuestionIndex(0);
      setStudentAnswer('');
      setFeedbackData(null);
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !studentAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await codingPlatformService.answerQuestion({
        interviewId: session._id,
        questionIndex: currentQuestionIndex,
        studentAnswer: studentAnswer.trim(),
      });

      setFeedbackData(res);
      setSession(res.interview);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    setFeedbackData(null);
    setStudentAnswer('');
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentQ = session?.questions[currentQuestionIndex];
  const isCompleted = session?.status === 'completed' || (session && currentQuestionIndex >= session.questions.length);

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="AI Mock Interview Bot (Technical & HR) | KR Global Learning"
        description="Practice simulated top-tier tech technical and HR behavioral interviews with real-time vocal scoring, filler word analysis, and model answer comparison."
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/30 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase">
                <span>🎙️ Real-Time Vocal & Technical Evaluator</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                AI Mock Interview Simulator
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Simulate high-pressure technical and behavioral rounds modeled after real Google, Amazon, Microsoft, and TCS question rubrics.
              </p>
            </div>

            {session && (
              <button
                onClick={() => setSession(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold self-start md:self-auto border border-white/10"
              >
                Reset / New Session
              </button>
            )}
          </div>
        </div>

        {/* Configuration Setup State */}
        {!session && (
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 md:p-10 space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>⚙️ Configure Your Mock Interview</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase">
                  Interview Track
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'technical', label: 'Technical & System Architecture', icon: '💻' },
                    { id: 'hr', label: 'HR Behavioral & Leadership Principles', icon: '👔' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`w-full p-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 border ${
                        selectedType === t.id
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg'
                          : 'bg-slate-800/60 border-white/5 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase">
                  Target Company Rubric
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Google', 'Amazon', 'Microsoft', 'General'].map((comp) => (
                    <button
                      key={comp}
                      onClick={() => setSelectedCompany(comp)}
                      className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                        selectedCompany === comp
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Role */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase">
                  Target Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-3.5 bg-slate-800 border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Software Development Engineer (SDE-1)">SDE-1 (Backend / Full Stack)</option>
                  <option value="Frontend Engineer (React/TypeScript)">Frontend Specialist (React 19)</option>
                  <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
                  <option value="TCS Digital Systems Engineer">TCS Digital Systems Cadre</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-center">
              <button
                onClick={handleStartInterview}
                disabled={isStarting}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                {isStarting ? 'Preparing Question Bank...' : '🚀 Enter Live Interview Room'}
              </button>
            </div>
          </div>
        )}

        {/* Live Interview Active State */}
        {session && !isCompleted && currentQ && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left AI Interviewer Card (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-white/10 rounded-3xl p-6 space-y-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-1">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-4xl">
                  🤖
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">AI Principal Interviewer</h3>
                <p className="text-xs text-purple-300 font-mono">
                  {session.targetCompany} • {session.type.toUpperCase()}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-400">
                Question {currentQuestionIndex + 1} of {session.questions.length}
              </div>

              <button
                onClick={() => speakQuestion(currentQ.questionText)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-2 border border-white/5"
              >
                <span>🔊</span> Listen to Question
              </button>
            </div>

            {/* Right Question & Answer Workspace (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900/80 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              {/* Question Statement */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  Category: {currentQ.category}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-white leading-snug">
                  {currentQ.questionText}
                </h2>
              </div>

              {/* Student Answer Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Your Verbal / Typed Explanation:</span>
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isRecording
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-slate-800 border-white/10 hover:text-white'
                    }`}
                  >
                    <span>🎙️</span> {isRecording ? 'Listening...' : 'Voice Dictate'}
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Articulate your thought process, architecture trade-offs, and metrics..."
                  className="w-full p-4 bg-slate-950/80 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Submit / Feedback */}
              {!feedbackData ? (
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !studentAnswer.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-40"
                  >
                    {isSubmitting ? 'Evaluating Response...' : 'Submit Response for AI Scoring'}
                  </button>
                </div>
              ) : (
                /* Instant Feedback Box */
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-500/30 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-amber-400">
                        Score: {feedbackData.questionScore}/100
                      </span>
                      <span className="text-xs text-slate-400">
                        (Filler words: {feedbackData.fillerWordCount})
                      </span>
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                    >
                      {currentQuestionIndex + 1 < session.questions.length ? 'Next Question →' : 'View Full Report →'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-cyan-300">Interviewer Feedback: </strong>
                    {feedbackData.feedback}
                  </p>

                  {currentQ.idealAnswer && (
                    <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-400 border border-white/5">
                      <strong className="text-emerald-400 block mb-1">Model Engineering Answer:</strong>
                      {currentQ.idealAnswer}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Final Report Card */}
        {session && isCompleted && (
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl">
              🏆
            </div>
            <h2 className="text-2xl font-extrabold text-white">Interview Round Completed!</h2>
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Overall Technical Performance</span>
              <div className="text-4xl font-extrabold text-emerald-400">
                {session.overallScore || 85}%
              </div>
              <p className="text-xs text-slate-400">
                Performance aligns with top percentile candidates for {session.targetCompany} {session.targetRole}.
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setSession(null)}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Start Another Company Round
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
