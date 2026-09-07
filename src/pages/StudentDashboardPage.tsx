import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar, { SidebarItem } from "../components/DashboardSidebar";
import NotificationDropdown from "../components/NotificationDropdown";
import { I } from "../components/Icons";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [playingVideo, setPlayingVideo] = useState<{ title: string; mentor: string; date: string } | null>(null);
  const [doubtText, setDoubtText] = useState("");
  const [doubtSent, setDoubtSent] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "courses", label: "My Courses", icon: "📚", count: "2" },
    { key: "classes", label: "Live Classes", icon: "🔴", count: "Live" },
    { key: "recordings", label: "Recorded Lectures", icon: "🎥", count: "28" },
    { key: "notes", label: "Notes", icon: "📝", count: "16" },
    { key: "assignments", label: "Assignments", icon: "💻", count: "1 Due" },
    { key: "certificates", label: "Certificates", icon: "🏆", count: "1" },
    { key: "profile", label: "Profile", icon: "👤" },
  ];

  const upcomingAssignment = {
    title: "Kafka Event Producer & Dead Letter Queue Architecture",
    course: "Java Backend & Spring Boot Track",
    dueDate: "Tomorrow, 11:59 PM IST",
    status: "In Progress",
    progress: 70,
  };

  const recentNotes = [
    { title: "Kafka Event-Driven Architecture Handbook.pdf", size: "4.8 MB", date: "Sep 06" },
    { title: "Spring Boot 3.x Production Properties & Security.pdf", size: "2.4 MB", date: "Sep 04" },
    { title: "Distributed Microservices Architecture Diagrams.zip", size: "12.1 MB", date: "Aug 29" },
  ];

  const handleSendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    setDoubtSent(true);
    setTimeout(() => {
      setDoubtText("");
      setDoubtSent(false);
    }, 4000);
  };

  return (
    <main className="pt-20 min-h-screen bg-slate-900 text-gray-100 flex flex-col md:flex-row">
      {/* Reusable Sidebar */}
      <DashboardSidebar
        role="student"
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key)}
        items={sidebarItems}
      />

      {/* Main Content Area */}
      <section className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-80px)]">
        {/* Top Bar with Notifications */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-white">
              Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Dashboard</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Active Track: <strong className="text-gray-200">{user?.enrolledTrack || "Java Backend & Spring Boot Track"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown isDark={true} />
            <Link
              to="/courses"
              className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold rounded-xl border border-purple-500/30 transition-all no-underline flex items-center gap-1.5"
            >
              <I.Code /> Browse Courses
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: DASHBOARD (All 7 Widgets)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Widget 1: Today's Live Class */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-slate-900 border border-purple-500/30 overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                    Today's Live Class · 7:00 PM IST
                  </span>
                  <h2 className="font-sans font-extrabold text-xl text-white mt-1">
                    Distributed Microservices & Kafka Event Stream Pipeline
                  </h2>
                  <p className="text-xs text-purple-200/90 mt-1 max-w-xl">
                    1:1 Live Coding Session with Mentor <strong>Rajesh Kumar</strong> (Ex-Amazon). Reviewing Consumer Group rebalancing & partition offsets.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md transition-all flex items-center gap-2 no-underline"
                  >
                    <span>🔴</span> Join Live Class Room
                  </a>
                </div>
              </div>
            </div>

            {/* Top 3 Stat Widgets: Enrolled Courses, Weekly Progress, Attendance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Widget 2: Enrolled Courses */}
              <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                  <span>Enrolled Courses</span>
                  <span className="text-purple-400 font-bold">2 Active</span>
                </div>
                <div className="text-xl font-extrabold text-white font-sans mb-1">
                  Java Backend (Spring Boot 3.x)
                </div>
                <div className="text-xs text-gray-400 mb-3">Overall Completion: 78%</div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" style={{ width: "78%" }} />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("courses")}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All Enrolled Courses →
                </button>
              </div>

              {/* Widget 3: Weekly Progress */}
              <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                  <span>Weekly Progress</span>
                  <span className="text-cyan-400 font-bold">+3.5 hrs</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-sans mb-1">
                  18.5 <span className="text-xs font-normal text-gray-400">Hours Studied</span>
                </div>
                <div className="flex items-end gap-1.5 h-7 pt-1 mb-2">
                  {[45, 60, 80, 50, 95, 100, 75].map((h, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-cyan-500/30 hover:bg-cyan-400 rounded-xs transition-colors"
                      style={{ height: `${h}%` }}
                      title={`Day ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-gray-400">Target: 20 hrs / week (92% goal met)</div>
              </div>

              {/* Widget 4: Attendance */}
              <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                  <span>1:1 Attendance</span>
                  <span className="text-emerald-400 font-bold">96% Rate</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-sans mb-1">
                  24 / 25 <span className="text-xs font-normal text-gray-400">Sessions</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }} />
                </div>
                <div className="text-[11px] text-emerald-400">🔥 12-session consecutive streak</div>
              </div>
            </div>

            {/* Split Row: Upcoming Assignment + Recent Notes + Mentor Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Widget 5: Upcoming Assignment (1 col) */}
              <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      💻 Upcoming Assignment
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Due Soon
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-sm text-white mb-1.5">
                    {upcomingAssignment.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{upcomingAssignment.course}</p>
                  <div className="text-xs text-gray-300 mb-2">Deadline: <strong className="text-red-400">{upcomingAssignment.dueDate}</strong></div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${upcomingAssignment.progress}%` }} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Submit GitHub repository for mentor evaluation")}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Submit Assignment
                </button>
              </div>

              {/* Widget 6: Recent Notes (1 col) */}
              <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
                      <span>📥</span> Recent Notes
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("notes")}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {recentNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{note.title}</h4>
                          <span className="text-[10px] text-gray-400">{note.size} · {note.date}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading ${note.title}`)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 text-cyan-400 hover:text-white text-[11px] font-bold rounded-lg transition-colors shrink-0"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-gray-400">
                  16 total handbooks in student repository
                </div>
              </div>

              {/* Widget 7: Mentor Chat / Doubt Portal (1 col) */}
              <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
                      <span>💬</span> 1:1 Mentor Chat
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Online
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mb-3">
                    Mentor: <strong>Rajesh Kumar</strong> (Ex-Amazon)
                  </p>

                  <form onSubmit={handleSendDoubt}>
                    <textarea
                      rows={3}
                      value={doubtText}
                      onChange={(e) => setDoubtText(e.target.value)}
                      placeholder="Ask Rajesh a technical question or share your code error…"
                      className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-500 resize-none mb-2"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Send Message to Mentor
                    </button>
                  </form>

                  {doubtSent && (
                    <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg text-center">
                      ✓ Message sent! Rajesh will reply in ~25m.
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 text-[10px] text-gray-400">
                  Direct Slack/Portal integration enabled
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            OTHER TABS (COURSES, RECORDINGS, NOTES, CERTIFICATES, PROFILE)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white font-sans">Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  78% Complete
                </span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">
                  Complete Java Backend Development (Spring Boot 3.x)
                </h3>
                <p className="text-xs text-gray-400 mb-4">Mentor: Rajesh Kumar · 6 Months 1:1 Live Track</p>
                <div className="w-full h-2 bg-slate-800 rounded-full mb-4">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "78%" }} />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("classes")}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                >
                  Join Live Class Room →
                </button>
              </div>

              <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  100% Certified
                </span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">
                  AWS Cloud Practitioner & Cloud Foundations
                </h3>
                <p className="text-xs text-gray-400 mb-4">Mentor: Amitav Sengupta · Certified Complete</p>
                <div className="w-full h-2 bg-slate-800 rounded-full mb-4">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: "100%" }} />
                </div>
                <Link
                  to="/certificates"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl no-underline inline-block"
                >
                  View Certificate 🏆
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "classes" && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white font-sans">Live 1:1 Classes Schedule</h2>
            <div className="p-5 bg-slate-950/80 rounded-2xl border border-purple-500/30 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">TODAY</span>
                <h3 className="text-sm font-bold text-white mt-1">Distributed Microservices & Kafka Event Stream</h3>
                <p className="text-xs text-gray-400">Today, 7:00 PM - 8:30 PM IST · Trainer: Rajesh Kumar</p>
              </div>
              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl no-underline"
              >
                Join Live Room
              </a>
            </div>
          </div>
        )}

        {activeTab === "recordings" && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white font-sans">Recorded Lecture Archive (28 Classes)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Class #14: Spring Security 6 with JWT Filters", date: "Sep 05", duration: "1h 32m" },
                { title: "Class #13: Hibernate Second-Level Caching", date: "Sep 03", duration: "1h 24m" },
                { title: "Class #12: RESTful Clean Architecture", date: "Sep 01", duration: "1h 40m" },
              ].map((rec, i) => (
                <div key={i} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="w-full h-28 bg-purple-950/60 rounded-xl mb-3 flex items-center justify-center text-2xl text-purple-400">
                    ▶
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{rec.title}</h4>
                  <div className="text-[11px] text-gray-400 flex justify-between mb-3">
                    <span>{rec.duration}</span>
                    <span>{rec.date}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlayingVideo({ title: rec.title, mentor: "Rajesh Kumar", date: rec.date })}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg"
                  >
                    Play Recording
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 max-w-xl space-y-4">
            <h2 className="text-xl font-extrabold text-white font-sans">Student Profile</h2>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Full Name</label>
              <input defaultValue={user?.name || "Aditya Sharma"} className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Email</label>
              <input defaultValue={user?.email || "aditya.sharma@krtech.edu"} className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Phone</label>
              <input defaultValue={user?.phone || "+91 98765 43210"} className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white" />
            </div>
            <button
              type="button"
              onClick={() => alert("Profile updated successfully!")}
              className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl"
            >
              Save Changes
            </button>
          </div>
        )}
      </section>

      {/* Video Modal */}
      {playingVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPlayingVideo(null)}
        >
          <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border border-purple-500/30 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">{playingVideo.title}</h3>
              <button type="button" onClick={() => setPlayingVideo(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="aspect-video bg-black rounded-2xl flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl mb-2">▶</div>
              <div className="text-xs text-gray-300">Playing 1:1 HD Session with {playingVideo.mentor}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
