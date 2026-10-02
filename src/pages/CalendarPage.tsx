import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { pwaService, CalendarEventItem } from "../services/pwaService";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    pwaService.getCalendar().then((data) => {
      if (data && data.events) {
        setEvents(data.events);
      }
      setIsLoading(false);
    });
  }, []);

  const handleDownloadICS = (event: CalendarEventItem) => {
    // Generate .ics standard file content
    const startDate = new Date(event.startTime).toISOString().replace(/-|:|\.\d+/g, "");
    const endDate = new Date(event.endTime).toISOString().replace(/-|:|\.\d+/g, "");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//KR Global Learning//Academic Calendar v10.0//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DESCRIPTION:Mentor: ${event.mentor} | Course: ${event.course}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `LOCATION:Online Interactive Class`,
      `URL:${event.meetingLink || "https://krtech.in/live"}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.id}_krtech.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ .ics calendar file downloaded for Google / Apple Calendar");
  };

  const filteredEvents = events.filter((ev) =>
    filterType === "all" ? true : ev.type === filterType
  );

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Academic Calendar & Live Schedule — KR Global Learning"
        description="View your upcoming live classes, mentorship One-on-Ones, contest dates, and assignment deadlines."
      />

      <DashboardSidebar role="student" activeTab="calendar" onTabChange={() => {}} />

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
                  Interactive Academic Schedule
                </span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/30">
                  Google & Apple Sync (.ics)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Class Calendar</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Upcoming live interactive sessions, One-on-One mentor syncs, coding contests, and project capstone review deadlines.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/live"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-2"
              >
                <span>🔴</span> Live Classes
              </Link>
              <Link
                to="/attendance"
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <span>🔥</span> Attendance Streak
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "All Events" },
              { key: "live_class", label: "Live Classes" },
              { key: "assignment_due", label: "Assignments" },
              { key: "contest", label: "Contests" },
              { key: "mentorship_1on1", label: "One-on-One Expert Mentorship" },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === f.key
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            Showing {filteredEvents.length} scheduled events
          </span>
        </div>

        {/* Events Timeline / Grid */}
        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const start = new Date(ev.startTime);
            const timeStr = start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            const dateStr = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

            return (
              <div
                key={ev.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/40 transition-all shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shrink-0 shadow-inner">
                    <span className="text-xs font-bold text-purple-300 uppercase">
                      {start.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-xl font-black text-white">{start.getDate()}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase"
                        style={{ backgroundColor: `${ev.color}20`, color: ev.color, borderColor: `${ev.color}40`, borderWidth: 1 }}
                      >
                        {ev.type.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {dateStr} · {timeStr}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Faculty: <strong className="text-slate-200">{ev.mentor}</strong> · Course: {ev.course}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {ev.meetingLink && (
                    <a
                      href={ev.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all"
                    >
                      Join Class 🔴
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDownloadICS(ev)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                    title="Export .ics file for Google or Apple Calendar"
                  >
                    <span>📅</span> Add to Cal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
