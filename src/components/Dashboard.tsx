import { I } from "./Icons";
import { Link } from "react-router-dom";

export default function DashboardPreview({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const feats = [
    "One-on-One live class schedule & recording vault",
    "Notes & study materials instant download",
    "Direct mentor doubt-clearing channel",
    "Assignment submissions with line-by-line feedback",
    "Project milestone tracker & certificate verification",
  ];

  return (
    <section className="bg-lavender" style={{ padding: "80px 0" }}>
      <div className="container-xl">
        <div className="two-col items-center">
          <div>
            <span className="badge badge-purple" style={{ marginBottom: 16, display: "inline-block" }}>
              Student Portal
            </span>
            <h2 className="section-title">
              Your Dedicated <span className="gradient-text">Learning Dashboard</span>
            </h2>
            <p className="section-desc">
              Track your 1:1 progress, rewatch recorded sessions anytime, download class notes, submit project code,
              and resolve doubts directly with your mentor.
            </p>
            <ul style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {feats.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#4B5563" }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "#EDE9FE",
                      color: "#7C3AED",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <I.Check />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <Link
                to="/free-demo"
                onClick={onOpenDemo}
                className="btn-primary"
                style={{ textDecoration: "none" }}
              >
                Experience Live Demo
              </Link>
              <Link to="/courses" className="btn-outline-purple" style={{ textDecoration: "none" }}>
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Interactive Mock Dashboard */}
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              background: "linear-gradient(135deg,#0F0A1E 0%,#1B0E33 100%)",
              border: "1px solid rgba(124,58,237,0.3)",
              boxShadow: "0 32px 80px rgba(124,58,237,0.22)",
              padding: 22,
            }}
          >
            {/* Window bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 7 }}>
                {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  fontFamily: "Poppins,sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                KR Tech Learner Portal v2.0
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
              {[
                { l: "Completed", v: "74%", c: "#A78BFA" },
                { l: "Live Streak", v: "28 Days", c: "#67E8F9" },
                { l: "Recordings", v: "36 Videos", c: "#34D399" },
                { l: "Doubts Solved", v: "42 / 44", c: "#FBBF24" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 14,
                    padding: "12px 8px",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15, color: s.c }}>
                    {s.v}
                  </div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Active Modules Progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {[
                { t: "Spring Boot Microservices & Kafka", p: 85, c: "#7C3AED", date: "Last active: Today" },
                { t: "DSA Problem Solving: Dynamic Programming", p: 60, c: "#06B6D4", date: "Last active: Yesterday" },
                { t: "1:1 Capstone Project: E-Commerce Architecture", p: 40, c: "#A78BFA", date: "Milestone 2/4" },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 12,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "white", fontWeight: 500 }}>
                      {c.t}
                    </span>
                    <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 12, color: c.c }}>
                      {c.p}%
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginBottom: 4 }}>
                    <div
                      style={{
                        height: 5,
                        borderRadius: 99,
                        width: `${c.p}%`,
                        background: `linear-gradient(90deg,${c.c},${c.c}99)`,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>{c.date}</div>
                </div>
              ))}
            </div>

            {/* Next 1:1 Live Class Card */}
            <div
              style={{
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "linear-gradient(135deg,rgba(124,58,237,0.32),rgba(6,182,212,0.2))",
                border: "1px solid rgba(124,58,237,0.4)",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "#7C3AED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                <I.Play />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 12, color: "white" }}>
                  Next 1:1 Live Class
                </div>
                <div style={{ fontSize: 11, color: "#DDD6FE", marginTop: 2, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  Spring Security & JWT Auth · Today 7:30 PM IST
                </div>
              </div>
              <button
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 600,
                  fontSize: 11,
                  color: "white",
                  background: "#7C3AED",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Join Class
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
