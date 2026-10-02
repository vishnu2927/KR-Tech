import React from "react";
import type { QuizQuestionItem } from "../../services/aiService";

interface QuizCardProps {
  question: QuizQuestionItem;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number;
  onSelectOption: (index: number) => void;
  showExplanation: boolean;
}

export default function QuizCard({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  showExplanation,
}: QuizCardProps) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-xs text-slate-400">
          Single Choice Assessment
        </span>
      </div>

      {/* Question Text */}
      <div className="my-6">
        <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = question.correctOptionIndex === idx;

          let optionStyle = "border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-slate-700 text-slate-200";

          if (showExplanation) {
            if (isCorrect) {
              optionStyle = "border-emerald-500/60 bg-emerald-950/30 text-emerald-300 ring-1 ring-emerald-500/40";
            } else if (isSelected && !isCorrect) {
              optionStyle = "border-rose-500/60 bg-rose-950/30 text-rose-300 ring-1 ring-rose-500/40";
            } else {
              optionStyle = "border-slate-800/50 bg-slate-950/30 text-slate-400 opacity-70";
            }
          } else if (isSelected) {
            optionStyle = "border-cyan-500 bg-cyan-950/30 text-cyan-200 ring-1 ring-cyan-500/50";
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={showExplanation}
              onClick={() => onSelectOption(idx)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {letters[idx]}
              </span>
              <span className="text-xs sm:text-sm font-medium leading-relaxed">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {showExplanation && question.explanation && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 text-xs">
          <span className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
            <span>💡</span> Technical Explanation:
          </span>
          <p className="text-slate-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
