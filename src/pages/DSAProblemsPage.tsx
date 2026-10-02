import React, { useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
import { codingPlatformService, DSAProblemItem } from '../services/codingPlatformService';

export default function DSAProblemsPage() {
  const [problems, setProblems] = useState<DSAProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Problem Solver Modal
  const [activeProblem, setActiveProblem] = useState<DSAProblemItem | null>(null);
  const [userCode, setUserCode] = useState('');
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true);
        const data = await codingPlatformService.getDSAProblems({
          difficulty: selectedDifficulty,
          category: selectedCategory,
          search: searchQuery || undefined,
        });
        setProblems(data);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, [selectedDifficulty, selectedCategory, searchQuery]);

  const handleOpenSolver = (p: DSAProblemItem) => {
    setActiveProblem(p);
    setUserCode(p.starterTemplates[selectedLang] || p.starterTemplates['javascript'] || '');
    setSubmissionResult(null);
  };

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    if (activeProblem) {
      setUserCode(activeProblem.starterTemplates[lang] || '');
    }
  };

  const handleSubmitSolution = async () => {
    if (!activeProblem || !userCode.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await codingPlatformService.submitDSACode({
        problemId: activeProblem.id,
        language: selectedLang,
        code: userCode,
      });
      setSubmissionResult(res);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="LeetCode Style DSA Problem Set | KR Global Learning"
        description="Solve 250+ curated algorithmic problems with hidden test case verification, multi-language support, and company tag filtering."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-950/40 to-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
                <span>⚔️ LeetCode 250 Problem Engine</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">Algorithmic Problem Set</h1>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
                Curated patterns tested at Google, Amazon, Microsoft, and Uber. Submit code to run against all hidden test cases.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                <span className="block text-xl font-bold text-emerald-400">42</span>
                <span className="text-[10px] text-slate-400">Problems Solved</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                <span className="block text-xl font-bold text-purple-400">14d</span>
                <span className="text-[10px] text-slate-400">Coding Streak</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center gap-4 justify-between">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by problem title or category..."
              className="w-full md:w-80 px-4 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />

            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
              <span className="text-xs text-slate-400">Difficulty:</span>
              {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDifficulty === d
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-6">#</th>
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-6">Difficulty</th>
                  <th className="py-3.5 px-6">Acceptance</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Companies</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                      Loading problem catalog...
                    </td>
                  </tr>
                ) : problems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                      No problems match your filters.
                    </td>
                  </tr>
                ) : (
                  problems.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => handleOpenSolver(p)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6 text-slate-500 font-mono">{p.number}</td>
                      <td className="py-4 px-6 font-bold text-white hover:text-purple-300">
                        {p.title}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.difficulty === 'Hard'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">{p.acceptance}</td>
                      <td className="py-4 px-6 text-slate-300">{p.category}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1">
                          {p.companies.slice(0, 2).map((c) => (
                            <span
                              key={c}
                              className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="px-3 py-1 rounded-lg bg-purple-600/30 border border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white text-[11px] font-bold transition-all">
                          Solve →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Solver Modal */}
      {activeProblem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Top Bar */}
            <div className="px-6 py-3 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white">
                  {activeProblem.number}. {activeProblem.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeProblem.difficulty === 'Hard'
                      ? 'bg-rose-500/20 text-rose-300'
                      : activeProblem.difficulty === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {activeProblem.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedLang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-cyan-300"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>

                <button
                  onClick={() => setActiveProblem(null)}
                  className="text-slate-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Split: Description (Left) & Editor (Right) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Problem Description (5 cols) */}
              <div className="md:col-span-5 p-6 overflow-y-auto border-r border-white/10 space-y-4 text-xs leading-relaxed">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-slate-300">{activeProblem.description}</p>

                <div className="space-y-2 pt-2">
                  <span className="font-bold text-slate-400">Examples:</span>
                  {activeProblem.examples.map((ex, i) => (
                    <div key={i} className="p-2.5 rounded bg-slate-950 font-mono text-[11px] space-y-1">
                      <p className="text-slate-400">
                        <span className="text-cyan-400">Input:</span> {ex.input}
                      </p>
                      <p className="text-slate-400">
                        <span className="text-purple-400">Output:</span> {ex.output}
                      </p>
                    </div>
                  ))}
                </div>

                {submissionResult && (
                  <div
                    className={`p-4 rounded-xl border mt-4 space-y-2 ${
                      submissionResult.submission.status === 'Accepted'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Verdict: {submissionResult.submission.status}</span>
                      <span>{submissionResult.submission.runtimeMs}ms</span>
                    </div>
                    <p className="text-[11px]">{submissionResult.message}</p>
                  </div>
                )}
              </div>

              {/* Code Editor & Submit (7 cols) */}
              <div className="md:col-span-7 flex flex-col bg-[#0b0e1b] overflow-hidden">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-1 p-4 bg-transparent font-mono text-xs text-purple-200 focus:outline-none resize-none leading-relaxed overflow-y-auto"
                />

                <div className="p-3 bg-slate-950 border-t border-white/10 flex justify-end gap-3">
                  <button
                    onClick={() => setActiveProblem(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitSolution}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Evaluating Test Cases...' : 'Submit Solution'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
