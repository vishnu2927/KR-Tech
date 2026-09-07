import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { I } from "./Icons";

export interface SidebarItem {
  key: string;
  label: string;
  icon: string;
  count?: string;
}

interface DashboardSidebarProps {
  role: "student" | "admin";
  activeTab: string;
  onTabChange: (key: string) => void;
  items: SidebarItem[];
  collapsed?: boolean;
}

export default function DashboardSidebar({
  role,
  activeTab,
  onTabChange,
  items,
}: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-full md:w-64 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 min-h-[calc(100vh-80px)]">
      <div>
        {/* User Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 mb-6">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format"}
            alt={user?.name || "User"}
            className="w-11 h-11 rounded-xl object-cover border border-purple-500/40"
          />
          <div className="overflow-hidden">
            <h4 className="font-sans font-bold text-xs text-white truncate">{user?.name || "Aditya Sharma"}</h4>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 uppercase tracking-wide ${
              role === "admin" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
            }`}>
              {role === "admin" ? "Admin Lead" : "1:1 Student"}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === item.key
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.count && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    item.count === "Live"
                      ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30"
                      : "bg-slate-800 text-gray-300"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer / Switch Role / Logout */}
      <div className="pt-6 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between px-2 text-[11px] text-gray-400 mb-2">
          <span>Switch Mode:</span>
          {role === "student" ? (
            <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-bold no-underline">
              Admin View →
            </Link>
          ) : (
            <Link to="/dashboard" className="text-purple-400 hover:text-purple-300 font-bold no-underline">
              Student View →
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-colors cursor-pointer"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
