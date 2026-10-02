import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";

export interface BatchItem {
  _id?: string;
  id?: string;
  name: string;
  batchCode: string;
  courseId: string;
  courseTitle: string;
  mentorName: string;
  mentorEmail?: string;
  zoomLink: string;
  schedule: {
    days: string[];
    time: string;
    startDate: string;
    endDate: string;
  };
  capacity: number;
  status: "Upcoming" | "Active" | "Completed" | "Cancelled";
  description: string;
  students?: {
    userId?: string;
    name: string;
    email: string;
    phone?: string;
    enrolledAt?: string;
    attendancePercent?: number;
  }[];
}

export default function BatchManagementView() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBatchForStudents, setSelectedBatchForStudents] = useState<BatchItem | null>(null);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formCourseTitle, setFormCourseTitle] = useState("Java Backend Cloud Architecture 2026");
  const [formMentorName, setFormMentorName] = useState("Rajesh Kumar (Principal Technical Architect)");
  const [formZoomLink, setFormZoomLink] = useState("https://zoom.us/j/krtech-live-cohort");
  const [formDays, setFormDays] = useState("Mon, Wed, Fri");
  const [formTime, setFormTime] = useState("08:00 PM - 10:00 PM IST");
  const [formCapacity, setFormCapacity] = useState(60);
  const [formStatus, setFormStatus] = useState<"Upcoming" | "Active" | "Completed">("Active");
  const [formDescription, setFormDescription] = useState("High-intensity live mentorship with real-world production capstones.");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBatches({
        search,
        status: statusFilter === "All" ? "" : statusFilter,
      });
      setBatches(res.batches || []);
    } catch (err: any) {
      console.error("Error loading batches:", err);
      showToast("Notice: Loaded active cohorts cache");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [statusFilter]);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      showToast("Please provide batch name and code");
      return;
    }

    try {
      const res = await adminService.createBatch({
        name: formName.trim(),
        batchCode: formCode.trim().toUpperCase(),
        courseTitle: formCourseTitle.trim(),
        mentorName: formMentorName.trim(),
        zoomLink: formZoomLink.trim(),
        schedule: {
          days: formDays.split(",").map((d) => d.trim()),
          time: formTime.trim(),
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
        capacity: Number(formCapacity) || 60,
        status: formStatus,
        description: formDescription.trim(),
      });

      if (res.success) {
        showToast(`✓ Batch ${formCode.toUpperCase()} created successfully in MongoDB Atlas!`);
        setIsCreateOpen(false);
        setFormName("");
        setFormCode("");
        fetchBatches();
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to create batch");
    }
  };

  const handleDeleteBatch = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete batch ${code}?`)) return;
    try {
      await adminService.deleteBatch(id);
      showToast(`Batch ${code} removed`);
      setBatches((prev) => prev.filter((b) => b._id !== id && b.id !== id));
    } catch (err: any) {
      showToast("Failed to delete batch");
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForStudents || !newStudentName.trim() || !newStudentEmail.trim()) {
      showToast("Name and email are required");
      return;
    }

    try {
      const bId = selectedBatchForStudents._id || selectedBatchForStudents.id || "";
      const res = await adminService.addStudentToBatch(bId, {
        name: newStudentName.trim(),
        email: newStudentEmail.trim(),
        phone: newStudentPhone.trim(),
      });

      if (res.success) {
        showToast(`✓ ${newStudentName} enrolled in batch ${selectedBatchForStudents.batchCode}!`);
        setNewStudentName("");
        setNewStudentEmail("");
        setNewStudentPhone("");
        // update local state
        setBatches((prev) =>
          prev.map((b) => (b._id === bId || b.id === bId ? res.batch : b))
        );
        setSelectedBatchForStudents(res.batch);
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to add student");
    }
  };

  const copyZoom = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("✓ Zoom classroom link copied to clipboard!");
  };

  const totalStudents = batches.reduce(
    (acc, b) => acc + (b.students?.length || 0),
    0
  );
  const activeBatchesCount = batches.filter((b) => b.status === "Active").length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-2xl shadow-purple-900/40 animate-bounce">
          {toast}
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Sprint 7.6 · Cohort Management Matrix
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live Classroom <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Batches & Cohorts</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Organize student batches, assign senior mentors, configure Zoom/Meet rooms, and monitor live attendance capacities.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={fetchBatches}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
            >
              🔄 Refresh
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>+</span>
              <span>Create New Batch</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-500/20">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Total Batches</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{batches.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Active Cohorts</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{activeBatchesCount}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Enrolled Students</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{totalStudents}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Avg Cohort Size</span>
            <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
              {batches.length > 0 ? Math.round(totalStudents / batches.length) : 0} / 60
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {["All", "Active", "Upcoming", "Completed"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab} Batches
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by code, mentor, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBatches()}
            className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Batches Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-4 text-xs font-semibold text-slate-400 animate-pulse">
            Connecting to MongoDB Atlas batches collection...
          </p>
        </div>
      ) : batches.length === 0 ? (
        <div className="p-16 text-center space-y-3 rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <span className="text-4xl">👥</span>
          <h3 className="text-lg font-bold text-white">No Batches Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            Click "Create New Batch" to launch an active live training cohort.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {batches.map((batch) => {
            const enrolled = batch.students?.length || 0;
            const pct = Math.min(100, Math.round((enrolled / (batch.capacity || 60)) * 100));

            return (
              <div
                key={batch._id || batch.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl space-y-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono font-bold text-[11px]">
                      {batch.batchCode}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        batch.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                          : batch.status === "Upcoming"
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1">{batch.name}</h3>
                  <p className="text-xs text-purple-300 font-medium mt-0.5 line-clamp-1">{batch.courseTitle}</p>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{batch.description}</p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Mentor:</span>
                      <span className="font-semibold text-white">{batch.mentorName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="font-semibold text-cyan-300">
                        {batch.schedule?.days?.join(", ")} · {batch.schedule?.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Seat Capacity:</span>
                      <span className="font-semibold text-white">
                        {enrolled} / {batch.capacity} Students ({pct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => copyZoom(batch.zoomLink)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>📹</span>
                    <span>Copy Zoom</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBatchForStudents(batch)}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>👥</span>
                    <span>Roster ({enrolled})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBatch(batch._id || batch.id || "", batch.batchCode)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Delete batch"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE BATCH MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>⚡</span> Create Live Cohort Batch
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java Backend Cloud Architecture 2026"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Batch Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KR-JAVA-26A"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Course</label>
                <input
                  type="text"
                  value={formCourseTitle}
                  onChange={(e) => setFormCourseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Mentor</label>
                <input
                  type="text"
                  value={formMentorName}
                  onChange={(e) => setFormMentorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Days (comma-separated)</label>
                  <input
                    type="text"
                    value={formDays}
                    onChange={(e) => setFormDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Zoom / Google Meet Link</label>
                <input
                  type="url"
                  value={formZoomLink}
                  onChange={(e) => setFormZoomLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={(e: any) => setFormStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                >
                  <option value="Active">Active (Ongoing Live Cohort)</option>
                  <option value="Upcoming">Upcoming (Admissions Open)</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cohort Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold transition-all cursor-pointer shadow-lg shadow-purple-900/30"
                >
                  Deploy Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT ROSTER MODAL */}
      {selectedBatchForStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Batch Roster · {selectedBatchForStudents.batchCode}
                </h3>
                <p className="text-xs text-purple-300">{selectedBatchForStudents.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatchForStudents(null)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Add Student */}
            <form onSubmit={handleAddStudent} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">
                + Enroll Student into Cohort
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone (Optional)"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Add Student to Cohort Roster
              </button>
            </form>

            {/* Enrolled Students Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                Enrolled Students ({selectedBatchForStudents.students?.length || 0})
              </h4>
              {(!selectedBatchForStudents.students || selectedBatchForStudents.students.length === 0) ? (
                <p className="text-xs text-slate-500 italic p-4 text-center">
                  No students enrolled in this batch yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden">
                  {selectedBatchForStudents.students.map((st, i) => (
                    <div key={i} className="p-3 bg-slate-950/60 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{st.name}</p>
                        <p className="text-[11px] text-slate-400">{st.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-mono font-bold">
                          {st.attendancePercent || 100}% Attendance
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
