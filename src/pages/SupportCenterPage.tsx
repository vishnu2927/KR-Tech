import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { adminSuiteService, SupportTicket } from "../services/adminSuiteService";

export default function SupportCenterPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState({
    total: 4,
    open: 2,
    inProgress: 1,
    resolved: 1,
    urgent: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    subject: "",
    description: "",
    category: "General Inquiry",
    priority: "Medium",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await adminSuiteService.getTickets({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
      });
      if (data && data.tickets) {
        setTickets(data.tickets);
        if (data.stats) setStats(data.stats);
        if (selectedTicket) {
          const current = data.tickets.find((t) => t.ticketId === selectedTicket.ticketId);
          if (current) setSelectedTicket(current);
        }
      }
    } catch (err: any) {
      console.error("Fetch tickets error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    try {
      await adminSuiteService.updateTicket(selectedTicket.ticketId, {
        replyMessage: replyText.trim(),
        status: "In Progress",
      });
      setReplyText("");
      showToast("✓ Support response sent and student notified via email");
      fetchTickets();
    } catch (err: any) {
      showToast(err.message || "Failed to submit response");
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await adminSuiteService.updateTicket(ticketId, { status: newStatus });
      showToast(`✓ Ticket ${ticketId} status updated to ${newStatus}`);
      fetchTickets();
    } catch (err: any) {
      showToast(err.message || "Failed to update status");
    }
  };

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.studentName || !newTicket.studentEmail || !newTicket.subject || !newTicket.description) {
      showToast("Please fill all required fields");
      return;
    }
    try {
      await adminSuiteService.createTicket(newTicket);
      showToast("✓ Support ticket logged successfully");
      setCreateModalOpen(false);
      setNewTicket({
        studentName: "",
        studentEmail: "",
        studentPhone: "",
        subject: "",
        description: "",
        category: "General Inquiry",
        priority: "Medium",
      });
      fetchTickets();
    } catch (err: any) {
      showToast(err.message || "Failed to create ticket");
    }
  };

  const filteredTickets = tickets.filter((t) =>
    t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Support Center & Helpdesk — KR Global Learning Admin Suite"
        description="Multi-tier support ticketing system, SLA response tracking, and student resolution portal."
      />

      <DashboardSidebar role="admin" activeTab="support" onTabChange={() => {}} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30">
                  Customer Operations · SLA Desk
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                  Avg SLA: 3.4 Hours
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Support <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Ticketing Center</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Multi-tier triage for LMS technical hurdles, billing inquiries, personalized learning support, and live session conflict escalations.
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
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>+</span> Log Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Support Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Total Tickets</p>
            <h4 className="text-2xl font-black text-white mt-1">{stats.total}</h4>
            <span className="text-[11px] text-slate-400 font-semibold">Lifetime logged</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Open & Pending</p>
            <h4 className="text-2xl font-black text-amber-400 mt-1">{stats.open}</h4>
            <span className="text-[11px] text-amber-300 font-semibold">Under active SLA</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Urgent Priority</p>
            <h4 className="text-2xl font-black text-rose-400 mt-1">{stats.urgent}</h4>
            <span className="text-[11px] text-rose-300 font-semibold">&lt; 4 Hours Response</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Resolved & Closed</p>
            <h4 className="text-2xl font-black text-emerald-400 mt-1">{stats.resolved}</h4>
            <span className="text-[11px] text-emerald-300 font-semibold">98.4% Satisfaction</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search by ticket ID (TICK-2026-...), student name, or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Tickets Layout (Split Screen Table and Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tickets Queue Table */}
          <div className={`${selectedTicket ? "lg:col-span-7" : "lg:col-span-12"} rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-2xl transition-all`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="py-3.5 px-4">Ticket</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Priority</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTickets.map((t) => (
                    <tr
                      key={t._id}
                      onClick={() => setSelectedTicket(t)}
                      className={`hover:bg-slate-800/40 transition-all cursor-pointer ${
                        selectedTicket?.ticketId === t.ticketId ? "bg-slate-800/60 border-l-4 border-blue-500" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-400 text-xs">
                            {t.ticketId}
                          </span>
                        </div>
                        <p className="font-bold text-white text-xs mt-0.5 line-clamp-1">{t.subject}</p>
                        <p className="text-[11px] text-slate-400">{t.studentName} · {t.studentEmail}</p>
                      </td>

                      <td className="py-3.5 px-3 text-slate-300 font-medium">
                        {t.category}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            t.priority === "Urgent"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : t.priority === "High"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === "Resolved" || t.status === "Closed"
                              ? "text-emerald-400 bg-emerald-950/60 border border-emerald-800"
                              : t.status === "In Progress"
                              ? "text-cyan-300 bg-cyan-950/60 border border-cyan-800"
                              : "text-amber-300 bg-amber-950/60 border border-amber-800"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold"
                        >
                          View Thread
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Ticket Conversation & Resolution Thread */}
          {selectedTicket && (
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400 text-sm">
                        {selectedTicket.ticketId}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded-full text-[10px] text-slate-300">
                        {selectedTicket.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-1">{selectedTicket.subject}</h3>
                    <p className="text-xs text-slate-400">
                      Logged by {selectedTicket.studentName} ({selectedTicket.studentEmail})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <div className="flex gap-1.5">
                    {["Open", "In Progress", "Resolved"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedTicket.ticketId, st)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                          selectedTicket.status === st
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation Timeline */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedTicket.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        m.senderRole === "admin"
                          ? "bg-blue-950/50 border border-blue-800/60 ml-4 text-blue-100"
                          : "bg-slate-950/70 border border-slate-800 mr-4 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-300">{m.sender}</span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <textarea
                  rows={3}
                  placeholder="Type official support resolution reply to student..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Student receives instant email notification</span>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Log Ticket Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Log Support Ticket</h3>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newTicket.studentName}
                    onChange={(e) => setNewTicket({ ...newTicket, studentName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Student Email *</label>
                    <input
                      type="email"
                      required
                      value={newTicket.studentEmail}
                      onChange={(e) => setNewTicket({ ...newTicket, studentEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newTicket.studentPhone}
                      onChange={(e) => setNewTicket({ ...newTicket, studentPhone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Billing & Refunds">Billing & Refunds</option>
                      <option value="Course Access & LMS">Course Access & LMS</option>
                      <option value="Live Class Issue">Live Class Issue</option>
                      <option value="Certificate">Certificate</option>
                      <option value="Learning Resources & Certifications">Learning Resources & Certifications</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Low">Low (48h SLA)</option>
                      <option value="Medium">Medium (24h SLA)</option>
                      <option value="High">High (12h SLA)</option>
                      <option value="Urgent">Urgent (4h SLA)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Subject / Issue Summary *</label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
