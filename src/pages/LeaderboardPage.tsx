import React, { useState, useEffect } from "react";
import { learningService, type LeaderboardResponse, type LeaderboardEntry } from "../services/learningService";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [timeframe, setTimeframe] = useState<"weekly" | "all_time">("weekly");
  const [domainFilter, setDomainFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, domainFilter]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const [res, rank] = await Promise.all([
        learningService.getLeaderboard({
          timeframe,
          domain: domainFilter !== "All" ? domainFilter : undefined,
        }),
        learningService.getMyRank(),
      ]);
      setLeaderboard(res);
      setMyRank(rank);
    } catch (err) {
      console.error("Fetch leaderboard error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Coding Contest & Certification Leaderboard | KR Global Learning"
        description="Weekly algorithmic problem-solving contests, practical skill rankings, and top performer podium across global learner cohorts."
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>🏆</span> Engineering Hall of Fame
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Coding Contest & Certification Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2">
            Compete in weekly coding battles, maintain problem-solving streaks, and unlock advanced masterclasses and verified certification honors.
          </p>
        </div>

        {/* Current Student Highlight Card */}
        {myRank && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={myRank.studentAvatar}
                alt={myRank.studentName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/40 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{myRank.studentName} (You)</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Rank #{myRank.weeklyRank}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {myRank.college} • {myRank.domain}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center sm:text-right">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Points</span>
                <span className="text-lg font-black text-amber-400">{myRank.totalPoints}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Solved</span>
                <span className="text-lg font-black text-cyan-400">{myRank.problemsSolved}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Streak</span>
                <span className="text-lg font-black text-emerald-400">🔥 {myRank.streakDays}d</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl shadow-xl">
          {/* Timeframe switch */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setTimeframe("weekly")}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === "weekly" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Weekly Sprint
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("all_time")}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === "all_time" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              All-Time Legends
            </button>
          </div>

          {/* Domain dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium shrink-0">Track:</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Engineering Tracks</option>
              <option value="Full Stack Java">Full Stack Java</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="Algorithms / Competitive Programming">Algorithms / DSA</option>
            </select>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        {leaderboard && leaderboard.topThree.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
            {/* 2nd Place */}
            <div className="order-2 md:order-1 p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 text-center shadow-xl space-y-3 relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-700 text-slate-200 text-xs font-bold border border-slate-500">
                🥈 Rank #2
              </span>
              <img
                src={leaderboard.topThree[1].studentAvatar}
                alt={leaderboard.topThree[1].studentName}
                className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-slate-400/50 mt-2"
              />
              <div>
                <h4 className="text-base font-bold text-white">{leaderboard.topThree[1].studentName}</h4>
                <p className="text-xs text-slate-400">{leaderboard.topThree[1].college}</p>
              </div>
              <div className="text-xl font-black text-slate-200">
                {leaderboard.topThree[1].totalPoints} pts
              </div>
              <span className="text-[10px] text-slate-500 block">
                {leaderboard.topThree[1].problemsSolved} Solved • 🔥 {leaderboard.topThree[1].streakDays}d Streak
              </span>
            </div>

            {/* 1st Place (Center / Tallest) */}
            <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/60 text-center shadow-2xl space-y-4 relative md:-translate-y-4">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/40 flex items-center gap-1">
                👑 Rank #1 Champion
              </span>
              <img
                src={leaderboard.topThree[0].studentAvatar}
                alt={leaderboard.topThree[0].studentName}
                className="w-20 h-20 rounded-3xl mx-auto object-cover ring-4 ring-amber-400/50 mt-2"
              />
              <div>
                <h3 className="text-lg font-extrabold text-white">{leaderboard.topThree[0].studentName}</h3>
                <p className="text-xs text-amber-300/90 font-medium">{leaderboard.topThree[0].college}</p>
              </div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                {leaderboard.topThree[0].totalPoints} pts
              </div>
              <span className="text-xs text-slate-400 block font-medium">
                {leaderboard.topThree[0].problemsSolved} Solved • 🔥 {leaderboard.topThree[0].streakDays}d Streak
              </span>
            </div>

            {/* 3rd Place */}
            <div className="order-3 p-6 rounded-3xl bg-slate-900/80 border border-amber-800/60 text-center shadow-xl space-y-3 relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-800 text-amber-200 text-xs font-bold border border-amber-600">
                🥉 Rank #3
              </span>
              <img
                src={leaderboard.topThree[2].studentAvatar}
                alt={leaderboard.topThree[2].studentName}
                className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-amber-700/50 mt-2"
              />
              <div>
                <h4 className="text-base font-bold text-white">{leaderboard.topThree[2].studentName}</h4>
                <p className="text-xs text-slate-400">{leaderboard.topThree[2].college}</p>
              </div>
              <div className="text-xl font-black text-amber-500">
                {leaderboard.topThree[2].totalPoints} pts
              </div>
              <span className="text-[10px] text-slate-500 block">
                {leaderboard.topThree[2].problemsSolved} Solved • 🔥 {leaderboard.topThree[2].streakDays}d Streak
              </span>
            </div>
          </div>
        )}

        {/* Table of Remaining Rankings */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="pb-3 px-4">Rank</th>
                  <th className="pb-3 px-4">Student</th>
                  <th className="pb-3 px-4">Domain Track</th>
                  <th className="pb-3 px-4 text-center">Problems Solved</th>
                  <th className="pb-3 px-4 text-center">Contests</th>
                  <th className="pb-3 px-4 text-center">Daily Streak</th>
                  <th className="pb-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard?.rankings.map((student, idx) => (
                  <tr key={student._id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                      #{idx + 4}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.studentAvatar}
                          alt={student.studentName}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block">{student.studentName}</span>
                          <span className="text-[10px] text-slate-500">{student.college}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 text-[11px]">
                        {student.domain}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-300">
                      {student.problemsSolved}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      {student.contestsAttended}
                    </td>
                    <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">
                      🔥 {student.streakDays}d
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-amber-400">
                      {student.totalPoints}
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
