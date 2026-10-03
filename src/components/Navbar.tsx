import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import { I } from "./Icons";

interface NavbarProps {
  onOpenDemoModal?: () => void;
}

export default function Navbar({ onOpenDemoModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "Courses", to: "/courses" },
    { label: "Live Classes", to: "/live" },
    { label: "AI Mentor", to: "/ai/mentor" },
    { label: "Mentors", to: "/mentors" },
    { label: "Certificates", to: "/certificates" },
    { label: "Achievements", to: "/achievements" },
    { label: "Free Resources", to: "/resources" },
    { label: "Blog", to: "/blogs" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const isSolid = scrolled || !isHomePage;

  return (
    <header className={`navbar ${isSolid ? "navbar-solid" : "navbar-transparent"}`}>
      <div className="container-xl">
        <div className="nav-inner">
          {/* Logo Left */}
          <Link
            to="/"
            title="KR GLOBAL LEARNING PRIVATE LIMITED"
            className="flex items-center gap-3 flex-shrink-0"
            style={{ textDecoration: "none" }}
          >
            <I.Logo />
            <div>
              <div
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#0F172A",
                  lineHeight: 1.1,
                }}
              >
                KR Global Learning
              </div>
              <div
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  color: "#2563EB",
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                Learn. Build. Grow. Globally.
              </div>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((l) => {
              if (l.to.startsWith("/#")) {
                return (
                  <a
                    key={l.label}
                    href={l.to}
                    className="nav-link"
                    style={{
                      color: "#334155",
                      textDecoration: "none",
                    }}
                  >
                    {l.label}
                  </a>
                );
              }
              const isActive = location.pathname === l.to;
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  className="nav-link"
                  style={{
                    color: isActive ? "#2563EB" : "#334155",
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:bg-blue-100"
              style={{
                background: "#EFF6FF",
                color: "#2563EB",
                border: "1px solid #DBEAFE",
              }}
              aria-label="Search"
            >
              <I.Search />
            </button>

            {/* Notification Bell - only visible when authenticated */}
            {user && <NotificationDropdown isDark={false} />}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 transition-all text-xs font-bold no-underline text-indigo-700"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format"}
                    alt={user.name}
                    className="w-6 h-6 rounded-lg object-cover"
                  />
                  <span className="truncate max-w-[100px]">{user.name.split(" ")[0]}</span>
                </Link>
                <Link
                  to="/security"
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 text-xs font-medium transition-all text-slate-600 no-underline"
                  title="Security & Active Devices"
                >
                  🛡️ Security
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-xs font-medium transition-all text-slate-600 cursor-pointer"
                  title="Sign Out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="btn-ghost"
                  style={{ padding: "8px 14px", fontSize: 13, textDecoration: "none" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-ghost"
                  style={{
                    padding: "8px 14px",
                    fontSize: 13,
                    textDecoration: "none",
                    color: "#2563EB",
                    background: "#EFF6FF",
                    borderColor: "#BFDBFE",
                  }}
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => {
                if (onOpenDemoModal) onOpenDemoModal();
                else navigate("/free-demo");
              }}
              className="btn-primary header-glow-btn"
              style={{ padding: "9px 18px", fontSize: 13 }}
            >
              <I.Sparkles /> Book Free Consultation
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: "#EFF6FF",
              color: "#1E293B",
              border: "1px solid #E2E8F0",
              cursor: "pointer",
            }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <I.Close /> : <I.Menu />}
          </button>
        </div>

        {/* Search dropdown bar */}
        {searchOpen && (
          <div className="pb-4 hidden md:block search-dropdown">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-3 rounded-2xl px-5 py-3"
              style={{
                background: "white",
                border: "1.5px solid #DDD6FE",
                boxShadow: "0 10px 30px rgba(124,58,237,0.12)",
              }}
            >
              <I.Search />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses (Java, MERN, AI, Python, DSA), mentors, or topics…"
                className="flex-1 outline-none text-sm"
                style={{ fontFamily: "Inter,sans-serif", color: "#374151", background: "transparent" }}
              />
              <button type="submit" className="btn-primary text-xs py-2 px-4" style={{ borderRadius: 10 }}>
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden mobile-drawer"
          style={{
            background: "rgba(255,255,255,0.98)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            padding: "20px 24px 28px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="mobile-nav-link"
                style={{ textDecoration: "none" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-2.5 pt-6">
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1 no-underline text-xs"
                  style={{ justifyContent: "center" }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/security"
                  onClick={() => setMobileOpen(false)}
                  className="btn-ghost flex-1 no-underline text-xs text-center"
                  style={{ justifyContent: "center" }}
                >
                  🛡️ Security
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="btn-ghost flex-1 text-xs"
                  style={{ justifyContent: "center" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-ghost flex-1 no-underline text-xs"
                  style={{ justifyContent: "center" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1 no-underline text-xs"
                  style={{ justifyContent: "center" }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Official Social Links in Mobile Drawer */}
          <div className="pt-4 mt-4 border-t border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
              Connect With Us
            </div>
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://youtube.com/@krgloballeaning?si=ZuFhhdkJl0HR9zQ5"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-slate-200 transition"
              >
                <I.Youtube />
              </a>
              <a
                href="https://t.me/krglobal0713"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-cyan-600 hover:bg-slate-200 transition"
              >
                <I.Telegram />
              </a>
              <a
                href="https://www.instagram.com/krglobal0713?utm_source=qr&stkn=bzJhYWIzemRnZ212"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-pink-600 hover:bg-slate-200 transition"
              >
                <I.Instagram />
              </a>
              <a
                href="https://x.com/KRGlobal1307"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200 transition"
              >
                <I.Twitter />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
