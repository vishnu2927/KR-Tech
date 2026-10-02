import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";

interface StudentCRMItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  avatar: string;
  stage: "Lead" | "Enrolled" | "In Training" | "Industry Ready" | "Certified" | "At Risk";
  progress: number;
  attendancePercent: number;
  masteryScore: number;
  batch: string;
  mentor: string;
  feeStatus: "Paid" | "EMI Active" | "Pending";
  enrolledDate: string;
  lastActive: string;
  notes: string[];
}

const INITIAL_CRM_STUDENTS: StudentCRMItem[] = [
  {
    id: "std-01",
    name: "Aditya Sharma",
    email: "aditya.sharma@krtech.edu",
    phone: "+91 98765 43210",
    course: "Complete Java Backend Development with Spring Boot 3",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces&auto=format",
    stage: "Industry Ready",
    progress: 88,
    attendancePercent: 96,
    masteryScore: 92,
    batch: "Batch-24A (Weekend)",
    mentor: "Rajesh Kumar (Principal Technical Architect)",
    feeStatus: "Paid",
    enrolledDate: "2026-07-15",
    lastActive: "12 mins ago",
    notes: ["Cleared System Design Architecture Evaluation", "Portfolio approved with 3 live microservices"],
  },
  {
    id: "std-02",
    name: "Kavya Patel",
    email: "kavya.patel@gmail.com",
    phone: "+91 98234 56789",
    course: "MERN Stack Full Stack Web Development Mastery",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces&auto=format",
    stage: "In Training",
    progress: 68,
    attendancePercent: 92,
    masteryScore: 78,
    batch: "Batch-24B (Evening)",
    mentor: "Amit Verma (Principal Systems Architect)",
    feeStatus: "Paid",
    enrolledDate: "2026-08-01",
    lastActive: "2 hours ago",
    notes: ["Completed Next.js Capstone repository", "Attended live debugging clinic"],
  },
  {
    id: "std-03",
    name: "Siddharth Verma",
    email: "sid.verma@outlook.com",
    phone: "+91 97123 45678",
    course: "AWS Certified Solutions Architect Associate (SAA-C03)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces&auto=format",
    stage: "Certified",
    progress: 100,
    attendancePercent: 98,
    masteryScore: 96,
    batch: "Batch-23F",
    mentor: "Vikram Nair (Staff Software Engineer Cloud)",
    feeStatus: "Paid",
    enrolledDate: "2026-06-10",
    lastActive: "1 day ago",
    notes: ["Passed AWS Certified Solutions Architect Associate exam with 92% score"],
  },
  {
    id: "std-04",
    name: "Meenakshi Iyer",
    email: "meenakshi.iyer@gmail.com",
    phone: "+91 99876 54321",
    course: "Microsoft Azure Administrator (AZ-104)",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop&crop=faces&auto=format",
    stage: "In Training",
    progress: 45,
    attendancePercent: 88,
    masteryScore: 65,
    batch: "Batch-24C (Fast-track)",
    mentor: "Pooja Hegde (Senior Cloud Specialist)",
    feeStatus: "EMI Active",
    enrolledDate: "2026-08-20",
    lastActive: "4 hours ago",
    notes: ["Submitted Azure IAM assignment with 95% score"],
  },
  {
    id: "std-05",
    name: "Rohan Deshmukh",
    email: "rohan.desh@techmail.com",
    phone: "+91 96543 21098",
    course: "Full Stack Java & Microservices Masterclass",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces&auto=format",
    stage: "At Risk",
    progress: 22,
    attendancePercent: 38,
    masteryScore: 40,
    batch: "Batch-24A",
    mentor: "Rajesh Kumar",
    feeStatus: "Pending",
    enrolledDate: "2026-08-05",
    lastActive: "6 days ago",
    notes: ["Missed 3 consecutive weekend live classes", "Counselor follow-up call requested"],
  },
  {
    id: "std-06",
    name: "Priyanka Sen",
    email: "priyanka.s@gmail.com",
    phone: "+91 95432 99887",
    course: "Data Science, Machine Learning & AI Engineering",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces&auto=format",
    stage: "Industry Ready",
    progress: 92,
    attendancePercent: 95,
    masteryScore: 94,
    batch: "Batch-24E",
    mentor: "Deepak Joshi (Senior FinTech Architect)",
    feeStatus: "Paid",
    enrolledDate: "2026-07-01",
    lastActive: "35 mins ago",
    notes: ["Completed Generative AI LangChain capstone", "Technical assessment scored 94/100"],
  },
];

export default function StudentCRMPage() {
  const [students, setStudents] = useState<StudentCRMItem[]>(INITIAL_CRM_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<StudentCRMItem | null>(null);
  const [newNote, setNewNote] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStage = stageFilter === "All" || s.stage === stageFilter;
      const matchBatch = batchFilter === "All" || s.batch.includes(batchFilter);
      return matchSearch && matchStage && matchBatch;
    });
  }, [students, searchQuery, stageFilter, batchFilter]);

  const handleAddNote = () => {
    if (!selectedStudent || !newNote.trim()) return;
    const updated = students.map((s) => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          notes: [newNote.trim(), ...s.notes],
        };
      }
      return s;
    });
    setStudents(updated);
    setSelectedStudent({
      ...selectedStudent,
      notes: [newNote.trim(), ...selectedStudent.notes],
    });
    setNewNote("");
    showToast("✓ Counselor note appended to student profile");
  };

  const handleStatusChange = (id: string, newStage: StudentCRMItem["stage"]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, stage: newStage } : s))
    );
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
    showToast(`✓ Student status updated to ${newStage}`);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Student 360° CRM — KR Global Learning Admin Suite"
        description="Comprehensive lifecycle student CRM with attendance tracking, LMS progress, and practical skill mastery."
      />

      {/* Admin Sidebar */}
      <DashboardSidebar role="admin" activeTab="students" onTabChange={() => {}} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {/* Toast Notification */}
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
                  CRM · Student Lifecycle 360
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                  15,420 Enrolled
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Management & CRM</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Real-time tracking of LMS curriculum progression, live class attendance records, practical skill mastery index, and counselor interventions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-2"
              >
                <span>←</span> Founder Dashboard
              </Link>
              <button
                type="button"
                onClick={() => showToast("Exporting comprehensive student roster CSV...")}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <span>📥</span> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Active Learners</p>
            <h4 className="text-2xl font-black text-white mt-1">11,240</h4>
            <span className="text-[11px] text-emerald-400 font-semibold">↑ 14% this month</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Industry Ready Cohort</p>
            <h4 className="text-2xl font-black text-cyan-400 mt-1">1,840</h4>
            <span className="text-[11px] text-cyan-300 font-semibold">Score &gt; 80%</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Certificates Issued</p>
            <h4 className="text-2xl font-black text-emerald-400 mt-1">1,412</h4>
            <span className="text-[11px] text-slate-400 font-semibold">98.4% Certification Rate</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">At-Risk Interventions</p>
            <h4 className="text-2xl font-black text-rose-400 mt-1">42</h4>
            <span className="text-[11px] text-rose-300 font-semibold">Attendance &lt; 50%</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[260px] relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search by student name, email, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl p-1">
              {["All", "Industry Ready", "In Training", "Certified", "At Risk"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStageFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stageFilter === st
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="All">All Batches</option>
              <option value="Batch-24A">Batch 24A (Weekend)</option>
              <option value="Batch-24B">Batch 24B (Evening)</option>
              <option value="Batch-24C">Batch 24C</option>
              <option value="Batch-23F">Batch 23F</option>
            </select>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-4 px-5">Candidate</th>
                  <th className="py-4 px-4">Course & Batch</th>
                  <th className="py-4 px-4">LMS Progress</th>
                  <th className="py-4 px-4">Attendance</th>
                  <th className="py-4 px-4">Mastery Index</th>
                  <th className="py-4 px-4">Stage</th>
                  <th className="py-4 px-4">Fee Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-800/30 transition-all cursor-pointer"
                    onClick={() => setSelectedStudent(s)}
                  >
                    <td className="py-4 px-5 flex items-center gap-3">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-md shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white hover:text-purple-300 transition-colors">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{s.email}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-medium text-slate-200 line-clamp-1 max-w-[220px]">
                        {s.course}
                      </p>
                      <span className="text-[10px] text-purple-300 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {s.batch}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-300 text-[11px]">
                          {s.progress}%
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`font-bold ${
                          s.attendancePercent >= 80
                            ? "text-emerald-400"
                            : s.attendancePercent >= 60
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {s.attendancePercent}%
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 rounded-lg font-bold text-[11px]">
                        {s.masteryScore}/100
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          s.stage === "Certified"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : s.stage === "Industry Ready"
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                            : s.stage === "At Risk"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                        }`}
                      >
                        {s.stage}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`text-[11px] font-semibold ${
                          s.feeStatus === "Paid"
                            ? "text-emerald-400"
                            : s.feeStatus === "EMI Active"
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {s.feeStatus}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(s);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all"
                      >
                        Profile 360°
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student 360 Drawer Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 p-6 md:p-8 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                    <p className="text-xs text-slate-400">{selectedStudent.email} · {selectedStudent.phone}</p>
                    <p className="text-xs text-purple-300 font-medium mt-1">Mentor: {selectedStudent.mentor}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Status and Metric Badges */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Attendance</p>
                  <p className="text-base font-black text-emerald-400">{selectedStudent.attendancePercent}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">LMS Progress</p>
                  <p className="text-base font-black text-purple-400">{selectedStudent.progress}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Mastery Score</p>
                  <p className="text-base font-black text-cyan-400">{selectedStudent.masteryScore}/100</p>
                </div>
              </div>

              {/* Lifecycle Stage Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Update Lifecycle Stage:</label>
                <div className="flex flex-wrap gap-2">
                  {(["Lead", "Enrolled", "In Training", "Industry Ready", "Certified", "At Risk"] as const).map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => handleStatusChange(selectedStudent.id, stage)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedStudent.stage === stage
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40"
                          : "bg-slate-800/80 text-slate-400 hover:text-white"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Counselor Notes */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">Counselor & Mentor Notes:</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedStudent.notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400">📌</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add student intervention or interview note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                    className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Sending WhatsApp check-in to ${selectedStudent.phone}...`);
                  }}
                  className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <span>💬</span> WhatsApp Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
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
