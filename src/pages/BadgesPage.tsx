import React, { useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
import { communityService, BadgeItem, StudentReputation, LeaderboardItem } from '../services/communityService';

export default function BadgesPage() {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [reputation, setReputation] = useState<StudentReputation | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'dsa' | 'community' | 'learning' | 'skills'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBadgesData() {
      try {
        setLoading(true);
        const [badgesRes, lbRes] = await Promise.all([
          communityService.getBadges(),
          communityService.getLeaderboard(),
        ]);
        setBadges(badgesRes.badges || []);
        setReputation(badgesRes.studentReputation || null);
        setLeaderboard(lbRes || []);
      } catch (err) {
        console.error('Failed to load badges data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBadgesData();
  }, []);

  const filteredBadges = activeTab === 'all'
    ? badges
    : badges.filter((b) => b.category === activeTab);

  // Hardcoded earned badge IDs for student view
  const earnedBadgeIds = ['code-samurai', 'top-contributor', 'bug-hunter', 'streak-30', 'industry-ready'];

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Badges & Reputation Leaderboard | KR Global Learning"
        description="Earn technical achievements, climb the community reputation ranks, and unlock exclusive mentor guidance and advanced certification perks."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Reputation Profile Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-950/40 to-cyan-950/30 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase">
                <span>🏆 Gamified Platform Reputation</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                Student Badges & Karma
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Earn XP by answering peer questions, solving LeetCode problems, maintaining attendance streaks, and clearing mock technical interviews.
              </p>
            </div>

            {/* Quick XP Summary Card */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 min-w-[240px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase font-semibold">Reputation Tier</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold">
                  {reputation?.currentTier || 'Gold Contributor'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-400">
                  {reputation?.reputationPoints || 2450}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ {reputation?.nextTierXp || 3000} XP</span>
              </div>
              {/* Progress bar to next tier */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full w-[81%]" />
                </div>
                <span className="text-[10px] text-slate-400 block text-right">550 XP to Platinum Tier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['all', 'dsa', 'community', 'learning', 'skills'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab === 'all' ? 'All Badges' : tab}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredBadges.map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.badgeId);
            return (
              <div
                key={badge.badgeId}
                className={`p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isEarned
                    ? 'bg-slate-900/80 border-purple-500/40 shadow-lg shadow-purple-950/20'
                    : 'bg-slate-900/40 border-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                {/* Top Icon & Tier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{badge.icon}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        badge.tier === 'diamond'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : badge.tier === 'platinum'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                          : badge.tier === 'gold'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {badge.tier}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{badge.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                  </div>
                </div>

                {/* Bottom Criteria & XP */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-mono font-bold">+{badge.xp} XP</span>
                  {isEarned ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                      <span>✓</span> Unlocked
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">🔒 Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform Leaderboard Section */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🏆 Community Karma Leaderboard</span>
              </h2>
              <p className="text-xs text-slate-400">
                Top student contributors ranked by verified solutions, upvotes, and peer support.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4">Solutions</th>
                  <th className="py-3 px-4 text-right">Reputation XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((student) => (
                  <tr
                    key={student.rank}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      student.name.includes('You') ? 'bg-purple-950/20 font-bold text-white' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold">
                      {student.rank === 1 ? '🥇 #1' : student.rank === 2 ? '🥈 #2' : student.rank === 3 ? '🥉 #3' : `#${student.rank}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <span className="font-semibold text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold text-[10px]">
                        {student.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{student.badgesCount}</td>
                    <td className="py-3.5 px-4 font-mono">{student.solutionsCount}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                      {student.xp.toLocaleString()} XP
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
