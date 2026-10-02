import React, { useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
import { codingPlatformService, ReadinessData } from '../services/codingPlatformService';

export default function InterviewAnalyticsPage() {
  const [readiness, setReadiness] = useState<ReadinessData | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [rData, aData] = await Promise.all([
          codingPlatformService.getReadiness(),
          codingPlatformService.getInterviewAnalytics(),
        ]);
        setReadiness(rData);
        setAnalytics(aData);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Industry Skill Readiness & Technical Analytics | KR Global Learning"
        description="Comprehensive industry skill readiness index combining DSA scores, AI mock interview ratings, and technical portfolio audits."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/30 border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase">
                <span>📊 Skill Telemetry & Readiness Index</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                Technical Skill Readiness Dashboard
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Real-time algorithmic confidence, mock interview speech analysis, and targeted certification recommendations.
              </p>
            </div>

            {/* Overall Score Circle */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-white/10 text-center min-w-[200px] space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Readiness Index</span>
              <div className="text-4xl font-extrabold text-emerald-400">
                {readiness?.overallReadinessPercent || 84}%
              </div>
              <span className="text-[10px] text-purple-300 font-bold block">
                {readiness?.targetTier || 'Tier-1 MAANG Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-2xl">⚔️</span>
            <h3 className="text-sm font-bold text-white">DSA & Algorithms</h3>
            <div className="text-2xl font-extrabold text-cyan-400">
              {readiness?.dsaScore || 78}%
            </div>
            <p className="text-[11px] text-slate-400">42 Problems Solved • 61% Acceptance</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-2xl">🎙️</span>
            <h3 className="text-sm font-bold text-white">Mock Interviews</h3>
            <div className="text-2xl font-extrabold text-purple-400">
              {readiness?.mockInterviewScore || 82}%
            </div>
            <p className="text-[11px] text-slate-400">Technical: 84% • Behavioral: 80%</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-2xl">📄</span>
            <h3 className="text-sm font-bold text-white">ATS Resume Health</h3>
            <div className="text-2xl font-extrabold text-emerald-400">
              {readiness?.resumeScore || 86}%
            </div>
            <p className="text-[11px] text-slate-400">18 Keywords Matched • 0 Errors</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-2xl">🏛️</span>
            <h3 className="text-sm font-bold text-white">System Architecture</h3>
            <div className="text-2xl font-extrabold text-amber-400">
              {readiness?.systemDesignScore || 74}%
            </div>
            <p className="text-[11px] text-slate-400">Cache-Aside • Kafka PubSub</p>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎯 High-ROI Action Items to Unlock Tier-1 Offers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(readiness?.recommendedActions || []).map((action, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-cyan-400">{action.area}</span>
                <p className="text-xs text-white leading-snug">{action.action}</p>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  {action.impact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Session History */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white">Past Mock Interview Sessions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Company Target</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(analytics?.recentSessions || []).map((s: any) => (
                  <tr key={s._id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 uppercase font-bold text-purple-300">{s.type}</td>
                    <td className="py-3 px-4 text-white font-semibold">{s.targetCompany}</td>
                    <td className="py-3 px-4 text-slate-300">{s.targetRole}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{s.overallScore || 85}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Completed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recently'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
