import React, { useState, useEffect } from "react";
import {
  analyzeResumeText,
  getResumeAnalysisHistory,
  type ResumeReport,
} from "../services/aiService";
import ResumeUploader from "../components/ai/ResumeUploader";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function ResumeAnalyzerPage() {
  const [currentReport, setCurrentReport] = useState<ResumeReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pastReports, setPastReports] = useState<ResumeReport[]>([]);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const reports = await getResumeAnalysisHistory();
      setPastReports(reports);
      if (reports.length > 0 && !currentReport) {
        setCurrentReport(reports[0]);
      }
    } catch {
      // Ignored
    }
  };

  const handleAnalyze = async (payload: { resumeText: string; targetRole: string; targetCompany: string }) => {
    setIsAnalyzing(true);
    try {
      const report = await analyzeResumeText(payload);
      setCurrentReport(report);
      fetchHistory();
    } catch (err) {
      console.error("Resume analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySummary = () => {
    if (currentReport?.suggestedSummary) {
      navigator.clipboard.writeText(currentReport.suggestedSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="AI Resume ATS Analyzer | KR Global Learning"
        description="Audit your software engineering resume against top tech applicant tracking systems (ATS), missing keywords, and industry benchmarks."
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>📄</span> ATS Resume Auditor
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Resume ATS Compatibility & Keyword Scanner
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            Get your engineering resume parsed against Tier-1 tech algorithms. Spot missing industry keywords, improve bullet point impact, and boost your interview callback rate.
          </p>
        </div>

        {/* Uploader Section */}
        <ResumeUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Results Section */}
        {currentReport && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
            {/* Header Score Overview */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Audit Report For:
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {currentReport.targetRole}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target Company Tier: <span className="text-slate-200 font-semibold">{currentReport.targetCompany}</span>
                </p>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-4">
                <div className="text-center p-3 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[110px]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    ATS Score
                  </span>
                  <span
                    className={`text-3xl font-black ${
                      currentReport.atsScore >= 80
                        ? "text-emerald-400"
                        : currentReport.atsScore >= 70
                        ? "text-cyan-400"
                        : "text-amber-400"
                    }`}
                  >
                    {currentReport.atsScore}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">/100</span>
                </div>

                <div className="text-center p-3 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[110px]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Match Rate
                  </span>
                  <span className="text-3xl font-black text-purple-400">
                    {currentReport.matchRate}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">Relevance</span>
                </div>
              </div>
            </div>

            {/* Keyword Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Present Keywords */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>✓</span> High-Value Keywords Present ({currentReport.keywordAnalysis.presentKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentReport.keywordAnalysis.presentKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>⚠️</span> Missing In-Demand Keywords ({currentReport.keywordAnalysis.missingKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentReport.keywordAnalysis.missingKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono font-medium"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Breakdown Radar Bars */}
            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>📊</span> ATS Section-by-Section Quality Scores
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(currentReport.sectionScores).map(([sec, score], idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 capitalize block mb-1">
                      {sec}
                    </span>
                    <span className="text-xl font-bold text-white block">
                      {score}%
                    </span>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Critical Fixes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-800/30">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                  Key Strengths Detected
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentReport.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-amber-950/15 border border-amber-800/30">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                  Critical ATS Fixes Needed
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentReport.criticalFixes.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Suggested Executive Summary */}
            {currentReport.suggestedSummary && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border border-indigo-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <span>✨</span> AI-Optimized Executive Summary
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="text-xs px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 border border-indigo-500/40 transition-all font-semibold cursor-pointer"
                  >
                    {copiedSummary ? "Copied! ✓" : "Copy to Resume"}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-950/50 p-4 rounded-xl border border-indigo-500/20">
                  "{currentReport.suggestedSummary}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
