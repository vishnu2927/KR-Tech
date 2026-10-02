import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export interface SidebarItem {
  key: string;
  label: string;
  icon: string;
  count?: string;
  path?: string;
}

export const DEFAULT_STUDENT_SIDEBAR_ITEMS: SidebarItem[] = [
  { key: "dashboard", label: "AI Dashboard", icon: "📊", path: "/dashboard" },
  { key: "ai_assistant", label: "AI Assistant", icon: "🤖", count: "GPT-4o", path: "/ai-assistant" },
  { key: "ai_notes", label: "AI Notes Generator", icon: "📝", count: "New", path: "/ai-notes" },
  { key: "ai_quiz", label: "AI Quiz Arena", icon: "⚡", path: "/ai-quiz" },
  { key: "study_planner", label: "Study Planner & Pomodoro", icon: "⏱️", count: "Goal", path: "/study-planner" },
  { key: "notes_library", label: "Smart Notes Library", icon: "📚", path: "/notes-library" },
  { key: "course_player", label: "Course Player", icon: "▶️", path: "/course-player" },
  { key: "assignments", label: "Assignment Portal", icon: "📌", count: "Active", path: "/assignments" },
  { key: "live_classes", label: "Live Classes", icon: "🔴", count: "Live", path: "/live-classes" },
  { key: "pdf_summary", label: "AI PDF Summarizer", icon: "📄", path: "/pdf-summary" },
  { key: "flashcards", label: "AI Flashcards (Anki)", icon: "🃏", path: "/flashcards" },
  { key: "code_lab", label: "AI Code Compiler", icon: "💻", path: "/code-lab" },
  { key: "doubt_center", label: "AI Doubt Solver", icon: "❓", count: "24x7", path: "/doubt-center" },
  { key: "gamification", label: "Gamification & XP", icon: "🏆", count: "Lv 7", path: "/gamification" },
  { key: "notifications", label: "Notifications", icon: "🔔", path: "/notifications" },
  { key: "certificates", label: "Certificates", icon: "🎓", path: "/certificates" },
  { key: "analytics", label: "Learning Analytics", icon: "📈", path: "/analytics" },
  { key: "calendar", label: "Academic Calendar", icon: "🗓️", path: "/calendar" },
  { key: "downloads", label: "Offline Downloads", icon: "📥", path: "/downloads" },
  { key: "profile", label: "Profile Settings", icon: "👤" },
];

export const DEFAULT_ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  { key: "dashboard", label: "Executive Suite", icon: "👑", path: "/admin" },
  { key: "students", label: "Student CRM", icon: "🎓", count: "15.4k", path: "/admin/students" },
  { key: "mentors", label: "Mentor CRM", icon: "⚡", path: "/admin/mentors" },
  { key: "finance", label: "Finance & GST", icon: "💳", count: "₹5.8Cr", path: "/admin/finance" },
  { key: "support", label: "Support Desk", icon: "🎧", count: "8 Open", path: "/admin/support" },
  { key: "community", label: "Community Moderation", icon: "🌐", path: "/community" },
  { key: "marketing", label: "Marketing Intel", icon: "📈", path: "/admin/marketing" },
  { key: "notifications", label: "Broadcast Hub", icon: "📢", path: "/admin/notifications" },
  { key: "courses", label: "Course Catalog", icon: "📚", path: "/admin/courses" },
  { key: "leads", label: "Demo Inquiries", icon: "📋", path: "/admin/leads" },
  { key: "live_scheduler", label: "Live Scheduler", icon: "🔴", path: "/admin/live" },
  { key: "certificates", label: "Certificates", icon: "🎓", path: "/certificates" },
];

interface DashboardSidebarProps {
  role?: "student" | "admin";
  activeTab: string;
  onTabChange: (key: string) => void;
  items?: SidebarItem[];
  collapsed?: boolean;
  onCloseMobile?: () => void;
}

export default function DashboardSidebar({
  role = "student",
  activeTab,
  onTabChange,
  items,
  collapsed = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const currentItems = items || (role === "admin" ? DEFAULT_ADMIN_SIDEBAR_ITEMS : DEFAULT_STUDENT_SIDEBAR_ITEMS);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onCloseMobile) onCloseMobile();
    logout();
    navigate("/login");
  };

  const handleItemClick = (item: SidebarItem) => {
    if (onCloseMobile) onCloseMobile();
    if (item.path) {
      navigate(item.path);
    } else {
      onTabChange(item.key);
    }
  };

  return (
    <aside
      className={`bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0 transition-all duration-300 z-30 ${
        collapsed ? "w-20 p-3" : "w-64 p-5"
      } min-h-[calc(100vh-64px)]`}
    >
      <div>
        {/* Mobile Close Button */}
        {onCloseMobile && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 md:hidden">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Branding */}
        <Link
          to="/"
          title="KR GLOBAL LEARNING PRIVATE LIMITED"
          className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800/80 no-underline group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-900/30 flex-shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center font-extrabold text-sm text-cyan-300">
              KR
            </div>
          </div>
          {!collapsed && (
            <div className="overflow-hidden min-w-0">
              <div className="font-extrabold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                {role === "admin" ? "KR Global Learning CRM" : "KR Global Learning"}
              </div>
              <div className="text-[10px] text-purple-400 font-medium truncate">
                {role === "admin" ? "Super Admin Executive" : "One-on-One Live Tech Academy"}
              </div>
            </div>
          )}
        </Link>

        {/* User Card */}
        <div
          className={`flex items-center gap-3 p-3 bg-slate-900/80 rounded-2xl border border-slate-800/90 mb-6 transition-all ${
            collapsed ? "justify-center p-2" : ""
          }`}
        >
          <img
            src={
              user?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format"
            }
            alt={user?.name || "Student"}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/30 shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-white truncate">
                {user?.name || "Aditya Sharma"}
              </h4>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 uppercase tracking-wide ${
                  role === "admin"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                }`}
              >
                {role === "admin" ? "Admin Lead" : "One-on-One Student"}
              </span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {currentItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleItemClick(item)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  collapsed ? "p-3 justify-center" : "px-3.5 py-2.5"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-purple-900/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                  <span className="text-base leading-none">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.count && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.count === "Active" || item.count === "1 Due"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Switch Role / Logout */}
      <div className="pt-6 border-t border-slate-800/80 space-y-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 mb-2">
            <span>Quick Link:</span>
            {role === "student" ? (
              <Link
                to="/security"
                className="text-cyan-400 hover:text-cyan-300 font-bold no-underline"
              >
                Active Devices →
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="text-purple-400 hover:text-purple-300 font-bold no-underline"
              >
                Student View →
              </Link>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/20 transition-colors cursor-pointer ${
            collapsed ? "p-2" : ""
          }`}
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
