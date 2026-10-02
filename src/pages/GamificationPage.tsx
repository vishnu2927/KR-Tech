import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function GamificationPage() {
  const [gamificationData, setGamificationData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [claimedStreak, setClaimedStreak] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [res, lb] = await Promise.all([
      lmsService.getGamificationStatus(),
      lmsService.getQuizLeaderboard(),
    ]);
    setGamificationData(res);
    setLeaderboard(lb);
  };

  const handleClaimStreak = () => {
    setClaimedStreak(true);
    showToast("🔥 Daily Streak Checked In! +50 XP bonus added to your account.");
  };

  const handleRedeem = (rewardTitle: string, costXp: number) => {
    showToast(`✓ Redeemed "${rewardTitle}" (-${costXp} XP)! Check your email for details.`);
  };

  const xp = gamificationData?.xp || {
    totalXp: 3450,
    currentLevel: 7,
    levelTitle: "Senior Cloud Craftsman",
    dailyStreak: 18,
    longestStreak: 24,
  };

  const nextLevelXp = (xp.currentLevel || 7) * 500;
  const progressPercent = Math.min(100, Math.round(((xp.totalXp % 500) / 500) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="Study Gamification & Rewards | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="XP leveling, daily streak multipliers, unlockable achievement badges, global leaderboards, and exclusive rewards shop for top learners."
      />
      <DashboardNavbar />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-amber-950/70 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.14</span>
              <span>•</span>
              <span>Study Gamification & XP Arena</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Gamified Learning & Achievement Badges</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Level up your developer profile. Earn XP for quizzes, assignments, daily streaks, and peer reviews. Unlock badges and redeem One-on-One mentor passes.
            </p>
          </div>

          {/* Daily Streak Check-in Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClaimStreak}
              disabled={claimedStreak}
              className={`px-5 py-3 rounded-2xl font-bold text-xs border transition cursor-pointer flex items-center gap-2 ${
                claimedStreak
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-950/40 border-transparent hover:scale-105"
              }`}
            >
              <span>🔥</span>
              <span>{claimedStreak ? "Streak Claimed (+50 XP)" : "Claim Day 18 Streak"}</span>
            </button>
          </div>
        </div>

        {/* Level & XP Overview Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-purple-900/40">
                {xp.currentLevel}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Level {xp.currentLevel}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">{xp.levelTitle}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total Experience Points: <span className="text-cyan-300 font-mono font-bold">{xp.totalXp} XP</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[100px]">
                <div className="text-amber-400 font-bold text-base">🔥 {xp.dailyStreak} Days</div>
                <div className="text-[10px] text-slate-400">Current Streak</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[100px]">
                <div className="text-purple-400 font-bold text-base">⚡ {xp.longestStreak} Days</div>
                <div className="text-[10px] text-slate-400">Longest Streak</div>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Level {xp.currentLevel} Progress</span>
              <span className="font-mono text-cyan-300">{progressPercent}% to Level {xp.currentLevel + 1}</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-Column: Badges & Rewards Shop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Achievement Badges (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🏆 Achievement Badges</span>
                </h2>
                <span className="text-xs text-purple-400 font-mono font-bold">5 of 7 Unlocked</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gamificationData?.badges?.map((badge: any) => (
                  <div
                    key={badge.key}
                    className={`p-4 rounded-2xl border flex items-start gap-4 transition ${
                      badge.unlocked
                        ? "bg-purple-950/20 border-purple-500/40 text-purple-100"
                        : "bg-slate-950/50 border-slate-800/80 opacity-60 text-slate-400"
                    }`}
                  >
                    <div className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                      {badge.icon}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{badge.title}</span>
                        {badge.unlocked && <span className="text-emerald-400 text-xs">✓</span>}
                      </div>
                      <p className="text-xs text-slate-400 m-0">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white">🏆 Batch XP Leaderboard</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Rank</th>
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3 text-right">XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {leaderboard.map((item) => (
                      <tr key={item.rank} className={item.name.includes("You") ? "bg-purple-600/10 font-bold" : ""}>
                        <td className="py-2.5 px-3 font-mono">#{item.rank}</td>
                        <td className="py-2.5 px-3">{item.name}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] text-cyan-300 font-bold">{item.badge}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-purple-300">{item.xp} XP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Rewards Shop Column (1 Col) */}
          <div className="space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>💎 XP Rewards Shop</span>
                </h3>
                <span className="text-xs font-mono font-bold text-amber-400">Balance: {xp.totalXp} XP</span>
              </div>

              <div className="space-y-3">
                {gamificationData?.rewardsShop?.map((rew: any) => (
                  <div key={rew.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {rew.category}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1.5">{rew.title}</h4>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono font-bold text-purple-300">{rew.costXp} XP</span>
                      <button
                        onClick={() => handleRedeem(rew.title, rew.costXp)}
                        disabled={xp.totalXp < rew.costXp}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-bold text-white shadow-md cursor-pointer"
                      >
                        Redeem ↗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
