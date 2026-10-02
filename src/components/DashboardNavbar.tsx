import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import { I } from "./Icons";

interface DashboardNavbarProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onTabSelect?: (tab: string) => void;
}

export default function DashboardNavbar({
  onToggleSidebar,
  sidebarCollapsed = false,
  searchQuery: externalSearchQuery,
  onSearchChange,
  onTabSelect,
}: DashboardNavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [internalQuery, setInternalQuery] = useState("");
  const [userDropdown, setUserDropdown] = useState(false);

  const query = externalSearchQuery !== undefined ? externalSearchQuery : internalQuery;
  const handleQueryChange = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else setInternalQuery(val);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Hamburger Toggle + Logo */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/60 transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h10M4 18h7"
                />
              )}
            </svg>
          </button>
        )}

        <Link
          to="/"
          title="KR GLOBAL LEARNING PRIVATE LIMITED"
          className="flex items-center gap-2.5 text-white no-underline group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-md shadow-purple-900/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-cyan-400 font-black text-sm">KR</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-sm tracking-tight text-white block leading-tight">
              KR Global Learning
            </span>
            <span className="text-[10px] text-cyan-400 font-mono block">
              STUDENT LMS
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search lectures, assignments, courses..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all font-sans"
          />
          <span className="absolute left-3 top-2.5 text-slate-500 text-xs">
            🔍
          </span>
        </div>
      </div>

      {/* Right side: Notifications Bell + User Profile */}
      <div className="flex items-center gap-3">
        {/* Live Notification Dropdown */}
        <NotificationDropdown isDark={true} />

        {/* User Pill / Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserDropdown((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 transition-all cursor-pointer"
          >
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format"
              }
              alt={user?.name || "Student"}
              className="w-7 h-7 rounded-xl object-cover ring-2 ring-purple-500/40"
            />
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-white truncate max-w-[110px]">
                {user?.name || "Student"}
              </span>
              <span className="block text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                {user?.role === "admin" ? "Admin" : "Student"}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-500 text-xs">▾</span>
          </button>

          {/* User Popover Menu */}
          {userDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-slate-800/80 mb-1">
                  <p className="text-xs font-bold text-white truncate">
                    {user?.name || "Student"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="space-y-0.5 text-xs">
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors no-underline"
                  >
                    <span>📊</span>
                    <span>Dashboard Home</span>
                  </Link>

                  <Link
                    to="/security"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors no-underline"
                  >
                    <span>🛡️</span>
                    <span>Security & Devices</span>
                  </Link>

                  <Link
                    to="/"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors no-underline"
                  >
                    <span>🌐</span>
                    <span>Public Platform</span>
                  </Link>

                  <div className="border-t border-slate-800/80 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer text-left"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
