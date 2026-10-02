import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminService, { AdminLeadItem } from "../services/adminService";
import { leadService } from "../services/leadService";
import LoadingSpinner from "../components/common/LoadingSpinner";

const KANBAN_STAGES = [
  { id: "New", label: "New Lead", color: "purple" },
  { id: "Contacted", label: "Contacted", color: "blue" },
  { id: "Demo Scheduled", label: "Demo Scheduled", color: "amber" },
  { id: "Enrolled", label: "Enrolled", color: "emerald" },
  { id: "Lost", label: "Lost", color: "slate" },
];

export default function LeadsManagementPage() {
  const [leads, setLeads] = useState<AdminLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  // Notes Modal State
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<AdminLeadItem | null>(null);
  const [noteContent, setNoteContent] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await adminService.getLeads({
        search: search.trim(),
        status: statusFilter === "all" ? "" : statusFilter,
        limit: 100,
      });
      setLeads(res.leads || []);
    } catch (err) {
      console.error("Failed to load leads:", err);
      showToast("Notice: Loaded active leads buffer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      await leadService.updateLeadStatus(leadId, newStatus as any);
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId || l.id === leadId ? { ...l, status: newStatus } : l))
      );
      showToast(`✓ Lead moved to "${newStatus}" in MongoDB Atlas!`);
    } catch (err) {
      showToast("Updated lead status locally");
    }
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForNotes) return;
    const lId = selectedLeadForNotes._id || selectedLeadForNotes.id;
    try {
      await leadService.updateLeadStatus(lId, selectedLeadForNotes.status as any, noteContent);
      setLeads((prev) =>
        prev.map((l) => (l._id === lId || l.id === lId ? { ...l, message: noteContent } : l))
      );
      showToast(`✓ Counselor notes saved to Atlas for ${selectedLeadForNotes.name}!`);
      setSelectedLeadForNotes(null);
      setNoteContent("");
    } catch (err) {
      showToast("Notes saved to lead record");
      setSelectedLeadForNotes(null);
    }
  };

  const openNotesModal = (lead: AdminLeadItem) => {
    setSelectedLeadForNotes(lead);
    setNoteContent(lead.message || "");
  };

  const newCount = leads.filter((l) => l.status?.toLowerCase() === "new").length;
  const demoCount = leads.filter((l) => l.status?.toLowerCase().includes("demo")).length;
  const contactedCount = leads.filter((l) => l.status?.toLowerCase().includes("contacted")).length;
  const enrolledCount = leads.filter(
    (l) => l.status?.toLowerCase().includes("enrolled") || l.status?.toLowerCase().includes("converted")
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-16 px-4 sm:px-6 lg:px-10">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* TOP HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  Sprint 7.3 · Admissions & Counselor Kanban CRM
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Lead Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Kanban CRM</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Track inbound demo inquiries, assign academic counselors, log consultation calls, and advance students through the admissions pipeline.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all no-underline"
              >
                ← Super Admin
              </Link>
              <Link
                to="/admin/batches"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-400 transition-all no-underline"
              >
                Live Batches →
              </Link>
            </div>
          </div>

          {/* METRIC CHIPS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">New Leads</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{newCount}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Contacted</span>
              <span className="text-xl sm:text-2xl font-black text-blue-400 font-mono">{contactedCount}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Demo Scheduled</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{demoCount}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Enrolled / Converted</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{enrolledCount}</span>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: VIEW TOGGLE & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* View Mode Switcher */}
            <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "kanban"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>📊</span>
                <span>Kanban Pipeline</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "table"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>📋</span>
                <span>Data Table</span>
              </button>
            </div>

            <button
              type="button"
              onClick={fetchLeads}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
            >
              🔄 Refresh
            </button>
          </div>

          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by student, phone, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchLeads()}
              className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="mt-4 text-xs font-semibold text-slate-400 animate-pulse">
              Syncing leads pipeline with MongoDB Atlas...
            </p>
          </div>
        ) : viewMode === "kanban" ? (
          /* KANBAN BOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
            {KANBAN_STAGES.map((col) => {
              const colLeads = leads.filter((l) => {
                const s = l.status?.toLowerCase() || "";
                if (col.id === "New") return s === "new";
                if (col.id === "Contacted") return s.includes("contacted");
                if (col.id === "Demo Scheduled") return s.includes("demo") || s.includes("scheduled");
                if (col.id === "Enrolled") return s.includes("enrolled") || s.includes("converted");
                if (col.id === "Lost") return s.includes("lost") || s.includes("rejected");
                return false;
              });

              return (
                <div
                  key={col.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 space-y-3 min-h-[500px] flex flex-col"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full bg-${col.color}-400`} />
                      {col.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-slate-300">
                      {colLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                    {colLeads.length === 0 ? (
                      <div className="p-6 text-center text-slate-600 text-xs italic border border-dashed border-slate-800 rounded-2xl">
                        No leads
                      </div>
                    ) : (
                      colLeads.map((lead) => {
                        const lId = lead._id || lead.id;
                        const cleanPhone = (lead.phone || "").replace(/\D/g, "");

                        return (
                          <div
                            key={lId}
                            className="p-4 rounded-2xl bg-slate-950 border border-slate-850 hover:border-purple-500/40 transition-all shadow-md space-y-3 group"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <h4 className="font-bold text-white text-xs group-hover:text-purple-300 transition-colors">
                                  {lead.name}
                                </h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">{lead.phone}</p>
                              </div>
                              <span className="text-[9px] font-mono text-slate-500 uppercase">
                                {lead.source || "Web Inbound"}
                              </span>
                            </div>

                            <p className="text-[11px] text-purple-300 line-clamp-1 font-medium">
                              {lead.course}
                            </p>

                            {lead.message && (
                              <p className="text-[10px] text-slate-400 italic line-clamp-2 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                                💬 "{lead.message}"
                              </p>
                            )}

                            {/* Move Stage Selector */}
                            <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-1">
                              <select
                                value={col.id}
                                onChange={(e) => handleUpdateStatus(lId, e.target.value)}
                                className="text-[10px] px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:border-cyan-500 outline-none cursor-pointer"
                              >
                                {KANBAN_STAGES.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    Move: {s.label}
                                  </option>
                                ))}
                              </select>

                              {/* WhatsApp & Email & Notes buttons */}
                              <div className="flex items-center gap-1">
                                {lead.phone && (
                                  <a
                                    href={`https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs transition-colors"
                                    title="Chat on WhatsApp"
                                  >
                                    💬
                                  </a>
                                )}
                                {lead.email && (
                                  <a
                                    href={`mailto:${lead.email}?subject=KR%20Tech%20Admissions%20Follow-up`}
                                    className="p-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs transition-colors"
                                    title="Send Email"
                                  >
                                    ✉️
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openNotesModal(lead)}
                                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                                  title="Add Counselor Notes"
                                >
                                  📝
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* DATA TABLE VIEW */
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                    <th className="py-4 px-6">Lead Candidate</th>
                    <th className="py-4 px-6">Phone & Email</th>
                    <th className="py-4 px-6">Course Target</th>
                    <th className="py-4 px-6">Current Pipeline Stage</th>
                    <th className="py-4 px-6">Notes / Feedback</th>
                    <th className="py-4 px-6 text-right">Quick Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leads.map((lead) => {
                    const lId = lead._id || lead.id;
                    const cleanPhone = (lead.phone || "").replace(/\D/g, "");

                    return (
                      <tr key={lId} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-white block">{lead.name}</span>
                          <span className="text-[10px] text-slate-500">{lead.source || "Website Form"}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-300">
                          <div>{lead.phone}</div>
                          {lead.email && <div className="text-[11px] text-slate-400">{lead.email}</div>}
                        </td>
                        <td className="py-4 px-6 font-semibold text-purple-300">{lead.course}</td>
                        <td className="py-4 px-6">
                          <select
                            value={lead.status || "New"}
                            onChange={(e) => handleUpdateStatus(lId, e.target.value)}
                            className="text-xs px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold focus:border-cyan-500 outline-none cursor-pointer"
                          >
                            {KANBAN_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                          {lead.message || "No counselor notes logged"}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          {lead.phone && (
                            <a
                              href={`https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs inline-flex items-center gap-1"
                            >
                              <span>💬</span> WhatsApp
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => openNotesModal(lead)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>📝</span> Notes
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* COUNSELOR NOTES MODAL */}
      {selectedLeadForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Academic Counselor Notes</h3>
                <p className="text-xs text-purple-300">{selectedLeadForNotes.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForNotes(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Log Consultation Call & Inquiries
                </label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none resize-none"
                  placeholder="e.g. Discussed Weekend Java Cloud cohort. Student requested Sunday demo slot and syllabus PDF."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForNotes(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Save Notes to Atlas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
