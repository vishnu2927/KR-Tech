import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { adminSuiteService, MentorCRMRecord } from "../services/adminSuiteService";

export default function MentorCRMPage() {
  const [mentors, setMentors] = useState<MentorCRMRecord[]>([]);
  const [summary, setSummary] = useState({
    totalMentors: 5,
    activeMentors: 5,
    totalStudentsMentored: 1910,
    avgRating: "4.93",
    totalMonthlyPayouts: 658000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<MentorCRMRecord | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await adminSuiteService.getMentorCRM();
        if (data && data.mentors) {
          setMentors(data.mentors);
          if (data.summary) setSummary(data.summary);
        }
      } catch (err: any) {
        console.error("Fetch mentors error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprovePayout = (mentorName: string, amount: number) => {
    showToast(`✓ Monthly payout of ₹${amount.toLocaleString("en-IN")} approved for ${mentorName}`);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Mentor & Faculty CRM — KR Global Learning Admin Suite"
        description="Manage elite industry mentors, batch assignments, ratings, and monthly payouts."
      />

      <DashboardSidebar role="admin" activeTab="mentors" onTabChange={() => {}} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                  Faculty & Mentors Operations
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                  Top Industry Experience
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Mentor <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Management & CRM</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Faculty performance tracking, active batch allocations, student satisfaction scores, and automated payroll processing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/live"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-2"
              >
                <span>📅</span> Live Schedule
              </Link>
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <span>←</span> Founder Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Active Mentors</p>
            <h4 className="text-2xl font-black text-white mt-1">{summary.activeMentors}</h4>
            <span className="text-[11px] text-emerald-400 font-semibold">100% On Schedule</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Students Mentored</p>
            <h4 className="text-2xl font-black text-cyan-400 mt-1">{summary.totalStudentsMentored.toLocaleString()}</h4>
            <span className="text-[11px] text-cyan-300 font-semibold">Live One-on-One & Batches</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Average Faculty Rating</p>
            <h4 className="text-2xl font-black text-amber-400 mt-1">★ {summary.avgRating}</h4>
            <span className="text-[11px] text-slate-400 font-semibold">From 4,200+ Reviews</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Monthly Faculty Payroll</p>
            <h4 className="text-2xl font-black text-emerald-400 mt-1">₹{(summary.totalMonthlyPayouts / 100000).toFixed(1)} Lakhs</h4>
            <span className="text-[11px] text-emerald-300 font-semibold">Due on 1st of month</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search faculty by name, ex-company (Amazon, Meta, Google), or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMentors.map((m) => (
            <div
              key={m._id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/40 transition-all shadow-xl space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-purple-500/30 shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">{m.name}</h4>
                      <p className="text-xs text-amber-300 font-semibold">{m.company}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.specialization}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-xl text-xs font-bold shrink-0">
                    ★ {m.rating}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">Experience</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{m.experience}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">Batches</p>
                    <p className="text-xs font-bold text-purple-300 mt-0.5">{m.activeBatches} Live</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">Students</p>
                    <p className="text-xs font-bold text-cyan-300 mt-0.5">{m.studentsEnrolled}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <p className="text-slate-400 text-[10px]">Monthly Compensation</p>
                    <p className="font-black text-emerald-400 text-sm">
                      ₹{m.monthlyPayout.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] text-right">Hourly Rate</p>
                    <p className="font-bold text-slate-300 text-xs text-right">
                      ₹{m.hourlyRate}/hr
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleApprovePayout(m.name, m.monthlyPayout)}
                  className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all"
                >
                  Approve Payout
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMentor(m)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mentor Profile Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMentor.avatar}
                    alt={selectedMentor.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-purple-500"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedMentor.name}</h3>
                    <p className="text-xs text-amber-300">{selectedMentor.company}</p>
                    <p className="text-xs text-slate-400">{selectedMentor.email} · {selectedMentor.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Specialization:</span>
                  <span className="font-bold text-white">{selectedMentor.specialization}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Batches:</span>
                  <span className="font-bold text-white">{selectedMentor.activeBatches} Active</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Students Trained:</span>
                  <span className="font-bold text-white">{selectedMentor.studentsEnrolled}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Monthly Compensation:</span>
                  <span className="font-bold text-emerald-400">₹{selectedMentor.monthlyPayout.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Directing message to ${selectedMentor.name}...`);
                    setSelectedMentor(null);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
