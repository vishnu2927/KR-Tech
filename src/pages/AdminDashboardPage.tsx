import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { I } from "../components/Icons";
import { leadService, Lead, LeadStatus, LeadStats } from "../services/leadService";

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    totalLeads: 0,
    todayLeads: 0,
    demoScheduled: 0,
    followUpsPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getAllLeads();
      const currentStats = await leadService.getLeadStats();
      setLeads(data);
      setStats(currentStats);
    } catch (e) {
      console.error("Error fetching leads", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    const updated = await leadService.updateLeadStatus(id, newStatus);
    if (updated) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      const currentStats = await leadService.getLeadStats();
      setStats(currentStats);
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    }
  };

  // Filter & Search Logic
  const filteredLeads = leads.filter((l) => {
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.course.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" };
      case "Contacted":
        return { bg: "#FEF3C7", color: "#B45309", border: "#FDE68A", dot: "#F59E0B" };
      case "Scheduled":
        return { bg: "#EDE9FE", color: "#6D28D9", border: "#DDD6FE", dot: "#7C3AED" };
      case "Completed":
        return { bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0", dot: "#22C55E" };
      default:
        return { bg: "#F3F4F6", color: "#4B5563", border: "#E5E7EB", dot: "#9CA3AF" };
    }
  };

  return (
    <main style={{ paddingTop: 90, minHeight: "100vh", background: "#F8F7FC", paddingBottom: 80 }}>
      <div className="container-xl">
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
            paddingBottom: 20,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="badge badge-purple">Admin Control Panel</span>
              <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>● Live Backend Store</span>
            </div>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#0F0A1E",
                marginTop: 6,
              }}
            >
              Demo Leads & Inquiries Dashboard
            </h1>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={fetchLeads}
              className="btn-ghost"
              style={{ fontSize: 13, padding: "9px 16px", borderRadius: 12 }}
            >
              ↻ Refresh Data
            </button>
            <Link
              to="/free-demo"
              className="btn-primary"
              style={{ fontSize: 13, padding: "9px 18px", borderRadius: 12, textDecoration: "none" }}
            >
              <I.Plus /> New Demo Booking
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            1. Stats Cards
        ───────────────────────────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 18,
            marginBottom: 36,
          }}
        >
          {[
            { label: "Total Leads", val: stats.totalLeads, icon: <I.Users />, color: "#7C3AED", bg: "#EDE9FE" },
            { label: "Today's Leads", val: stats.todayLeads, icon: <I.Sparkles />, color: "#0891B2", bg: "#CFFAFE" },
            { label: "Demo Scheduled", val: stats.demoScheduled, icon: <I.Calendar />, color: "#10B981", bg: "#D1FAE5" },
            { label: "Follow Ups Pending", val: stats.followUpsPending, icon: <I.Clock />, color: "#F59E0B", bg: "#FEF3C7" },
          ].map((s, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: "22px 24px",
                borderRadius: 20,
                background: "white",
                border: "1.5px solid #EDE9FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 20px rgba(124,58,237,0.04)",
              }}
            >
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>{s.label}</span>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: 28,
                    color: "#0F0A1E",
                    marginTop: 4,
                  }}
                >
                  {s.val}
                </div>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: s.bg,
                  color: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            2. Search & Status Filter Controls
        ───────────────────────────────────────────────────────────────────────────── */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "20px 24px",
            border: "1.5px solid #EDE9FE",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 4px 20px rgba(124,58,237,0.04)",
          }}
        >
          {/* Search bar */}
          <div
            style={{
              flex: 1,
              minWidth: 280,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: 12,
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
            }}
          >
            <I.Search />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Course, Phone, or Email..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 14,
                fontFamily: "Inter, sans-serif",
                background: "transparent",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9CA3AF" }}
              >
                <I.Close />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
            {["All", "New", "Contacted", "Scheduled", "Completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: statusFilter === st ? 700 : 500,
                  cursor: "pointer",
                  border: statusFilter === st ? "1.5px solid #7C3AED" : "1px solid #E5E7EB",
                  background: statusFilter === st ? "#EDE9FE" : "white",
                  color: statusFilter === st ? "#7C3AED" : "#4B5563",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. Leads Table
        ───────────────────────────────────────────────────────────────────────────── */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            border: "1.5px solid #EDE9FE",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(124,58,237,0.06)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8F7FF", borderBottom: "1.5px solid #EDE9FE", color: "#6B7280" }}>
                  <th style={{ padding: "16px 20px", fontWeight: 700 }}>Lead Name</th>
                  <th style={{ padding: "16px 20px", fontWeight: 700 }}>Contact Info</th>
                  <th style={{ padding: "16px 20px", fontWeight: 700 }}>Interested Course</th>
                  <th style={{ padding: "16px 20px", fontWeight: 700 }}>Preferred Slot</th>
                  <th style={{ padding: "16px 20px", fontWeight: 700 }}>Status</th>
                  <th style={{ padding: "16px 20px", fontWeight: 700 }}>Date</th>
                  <th style={{ padding: "16px 20px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: "#6B7280" }}>
                      Loading lead data from backend service...
                    </td>
                  </tr>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const stStyle = getStatusBadge(lead.status);
                    return (
                      <tr
                        key={lead.id}
                        style={{
                          borderBottom: "1px solid #F3F4F6",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {/* Name */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#0F0A1E" }}>
                            {lead.name}
                          </div>
                          {lead.message && (
                            <div
                              style={{
                                fontSize: 11,
                                color: "#6B7280",
                                marginTop: 2,
                                maxWidth: 180,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              💬 {lead.message}
                            </div>
                          )}
                        </td>

                        {/* Phone & Email */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ fontWeight: 600, color: "#374151" }}>{lead.phone}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.email}</div>
                        </td>

                        {/* Course */}
                        <td style={{ padding: "16px 20px" }}>
                          <span
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#7C3AED",
                              background: "#EDE9FE",
                              padding: "4px 10px",
                              borderRadius: 8,
                            }}
                          >
                            {lead.course}
                          </span>
                        </td>

                        {/* Preferred Time */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ color: "#374151" }}>{lead.timeSlot}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.timezone}</div>
                        </td>

                        {/* Status dropdown */}
                        <td style={{ padding: "16px 20px" }}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 99,
                              fontSize: 12,
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                              background: stStyle.bg,
                              color: stStyle.color,
                              border: `1px solid ${stStyle.border}`,
                              outline: "none",
                              cursor: "pointer",
                            }}
                          >
                            <option value="New">● New</option>
                            <option value="Contacted">● Contacted</option>
                            <option value="Scheduled">● Scheduled</option>
                            <option value="Completed">● Completed</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td style={{ padding: "16px 20px", color: "#6B7280", fontSize: 12 }}>
                          {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(lead.name)}%2C%20regarding%20your%20KR%20Tech%20demo%20for%20${encodeURIComponent(lead.course)}...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: "6px 10px",
                                borderRadius: 8,
                                background: "#DCFCE7",
                                color: "#16A34A",
                                fontSize: 11,
                                fontWeight: 700,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <I.MessageCircle /> WhatsApp
                            </a>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 8,
                                background: "#F3F4F6",
                                color: "#374151",
                                fontSize: 11,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: "#6B7280" }}>
                      No leads found matching your search or status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. Quick View Lead Modal
      ───────────────────────────────────────────────────────────────────────────── */}
      {selectedLead && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15,10,30,0.75)",
            backdropFilter: "blur(10px)",
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLead(null);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: "white",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              animation: "scaleIn 0.25s ease-out",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 99 }}>
                  Lead Details #{selectedLead.id}
                </span>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 18, marginTop: 4 }}>
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 10,
                  width: 32,
                  height: 32,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <I.Close />
              </button>
            </div>

            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700 }}>Contact Info</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0F0A1E", marginTop: 2 }}>
                  📞 {selectedLead.phone} · ✉️ {selectedLead.email}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700 }}>Course & Schedule</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#7C3AED", marginTop: 2 }}>
                  {selectedLead.course}
                </div>
                <div style={{ fontSize: 12, color: "#4B5563", marginTop: 2 }}>
                  Slot: {selectedLead.timeSlot} ({selectedLead.timezone})
                </div>
              </div>

              {selectedLead.message && (
                <div style={{ background: "#F9FAFB", padding: "12px 14px", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                  <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 700 }}>Message / Goals:</span>
                  <p style={{ fontSize: 13, color: "#374151", margin: "4px 0 0" }}>{selectedLead.message}</p>
                </div>
              )}

              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700 }}>Status</span>
                <div style={{ marginTop: 6 }}>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #DDD6FE",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      outline: "none",
                    }}
                  >
                    <option value="New">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Scheduled">Demo Scheduled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="btn-ghost flex-1"
                  style={{ justifyContent: "center", textDecoration: "none" }}
                >
                  <I.Phone /> Call Lead
                </a>
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1"
                  style={{
                    justifyContent: "center",
                    textDecoration: "none",
                    background: "linear-gradient(135deg,#16A34A 0%,#15803D 100%)",
                  }}
                >
                  <I.MessageCircle /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
