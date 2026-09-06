import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "Services", to: "/#services" },
    { label: "Mentors", to: "/#mentors" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Admin", to: "/admin" },
  ];

  const isSolid = scrolled || !isHomePage;

  return (
    <header className={`navbar ${isSolid ? "navbar-solid" : "navbar-transparent"}`}>
      <div className="container-xl">
        <div className="nav-inner">
          {/* Logo Left */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0" style={{ textDecoration: "none" }}>
            <I.Logo />
            <div>
              <div
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: isSolid ? "#0F0A1E" : "white",
                  lineHeight: 1.1,
                }}
              >
                KR Tech
              </div>
              <div
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 500,
                  fontSize: 10,
                  color: isSolid ? "#7C3AED" : "rgba(167,139,250,0.95)",
                  lineHeight: 1,
                }}
              >
                Learn. Build. Grow.
              </div>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => {
              if (l.to.startsWith("/#")) {
                return (
                  <a
                    key={l.label}
                    href={l.to}
                    className={`nav-link ${!isSolid ? "nav-link-hero" : ""}`}
                    style={{
                      color: isSolid ? "#374151" : "rgba(255,255,255,0.92)",
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
                  className={`nav-link ${!isSolid ? "nav-link-hero" : ""}`}
                  style={{
                    color: isActive ? "#7C3AED" : isSolid ? "#374151" : "rgba(255,255,255,0.92)",
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
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: isSolid ? "#F5F3FF" : "rgba(255,255,255,0.14)",
                color: isSolid ? "#7C3AED" : "rgba(255,255,255,0.9)",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Search"
            >
              <I.Search />
            </button>

            <button
              onClick={() => onOpenDemoModal && onOpenDemoModal()}
              className={isSolid ? "btn-ghost" : "btn-ghost-white"}
              style={{ padding: "9px 18px", fontSize: 13 }}
            >
              Login
            </button>

            <button
              onClick={() => {
                if (onOpenDemoModal) onOpenDemoModal();
                else navigate("/free-demo");
              }}
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: 13 }}
            >
              <I.Sparkles /> Book Free Demo
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: isSolid ? "#F5F3FF" : "rgba(255,255,255,0.15)",
              color: isSolid ? "#7C3AED" : "white",
              border: "none",
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
          <div className="flex gap-3 pt-6">
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onOpenDemoModal) onOpenDemoModal();
              }}
              className="btn-ghost flex-1"
              style={{ justifyContent: "center" }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onOpenDemoModal) onOpenDemoModal();
                else navigate("/free-demo");
              }}
              className="btn-primary flex-1"
              style={{ justifyContent: "center" }}
            >
              Book Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
