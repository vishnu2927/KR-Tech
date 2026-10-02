import React, { useState } from "react";
import type { InterviewQuestion } from "../../services/aiService";

interface InterviewQuestionCardProps {
  question: InterviewQuestion;
  questionIndex: number;
  totalQuestions: number;
  onSubmitAnswer: (answer: string) => void;
  isSubmitting: boolean;
  onNextQuestion?: () => void;
  hasNextQuestion?: boolean;
}

export default function InterviewQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onSubmitAnswer,
  isSubmitting,
  onNextQuestion,
  hasNextQuestion,
}: InterviewQuestionCardProps) {
  const [answer, setAnswer] = useState(question.studentAnswer || "");
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const hasFeedback = Boolean(question.aiFeedback && question.aiFeedback.score > 0);

  // Web Speech API Voice Recognition (Browser-native fallback)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please type your response.");
      setTimeout(() => setSpeechError(null), 3000);
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;
    onSubmitAnswer(answer);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
            {question.category}
          </span>
        </div>

        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
          {question.difficulty}
        </span>
      </div>

      {/* Question Text */}
      <div className="my-6">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
          {question.questionText}
        </h3>
      </div>

      {/* Answer Form (if not yet graded or editing) */}
      {!hasFeedback ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="State your approach, architecture trade-offs, edge cases, and concrete technology choices..."
              className="w-full p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 leading-relaxed font-sans placeholder:text-slate-500"
              required
            />

            <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                    isRecording
                      ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                      : "bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white"
                  }`}
                >
                  <span>{isRecording ? "⏹️ Stop Voice" : "🎙️ Voice Input"}</span>
                </button>
                {speechError && <span className="text-red-400 text-[11px]">{speechError}</span>}
              </div>

              <span>Words: <strong className="text-white">{answer.trim() ? answer.trim().split(/\s+/).length : 0}</strong></span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !answer.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Evaluating with AI Interviewer...
                </>
              ) : (
                <>Submit & Grade Response 🚀</>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Evaluation Feedback Display */
        <div className="mt-6 space-y-5">
          {/* Candidate Answer Recall */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Your Answer:
            </span>
            <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {question.studentAnswer}
            </p>
          </div>

          {/* AI Score Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-slate-900 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-lg text-purple-300">
                {question.aiFeedback?.score}/10
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">AI Evaluation Score</h4>
                <p className="text-xs text-slate-400">
                  {question.aiFeedback && question.aiFeedback.score >= 8
                    ? "Excellent depth and architectural articulation."
                    : question.aiFeedback && question.aiFeedback.score >= 6
                    ? "Solid foundation with room for distributed edge-case refinement."
                    : "Needs more specific enterprise architectural detail."}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40">
              <h5 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                <span>✓</span> Key Strengths
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {question.aiFeedback?.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40">
              <h5 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <span>⚡</span> Opportunities to Improve
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {question.aiFeedback?.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ideal Answer Summary */}
          {question.aiFeedback?.idealAnswerSummary && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 text-xs">
              <span className="font-bold text-cyan-300 block mb-1 flex items-center gap-1.5">
                <span>💡</span> Principal Engineer Ideal Answer Benchmark:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {question.aiFeedback.idealAnswerSummary}
              </p>
            </div>
          )}

          {/* Next Question / Finish Action */}
          {hasNextQuestion && onNextQuestion && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                Proceed to Next Question ➔
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
