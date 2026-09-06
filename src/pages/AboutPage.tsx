import { Link } from "react-router-dom";
import { I } from "../components/Icons";
import StatsBar from "../components/StatsBar";
import Mentors from "../components/Mentors";

export default function AboutPage({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const values = [
    {
      title: "1:1 Live Personalization",
      desc: "We believe true mastery doesn't come from passive 500-person video lectures. Every student learns directly from an expert mentor with personal feedback on every line of code.",
      icon: <I.Users />,
      color: "#7C3AED",
      bg: "#EDE9FE",
    },
    {
      title: "10+ Years Industry Mentors",
      desc: "Our mentors are not junior teaching assistants. They are principal engineers and architects from Amazon, Google, Razorpay, and Paytm who bring authentic architectural wisdom.",
      icon: <I.Award />,
      color: "#0891B2",
      bg: "#CFFAFE",
    },
    {
      title: "Real-World Project Mastery",
      desc: "We don't teach toy todo-apps. You build enterprise-grade microservices, end-to-end full stack platforms, and real machine learning pipelines ready for production.",
      icon: <I.Code />,
      color: "#7C3AED",
      bg: "#EDE9FE",
    },
    {
      title: "Total Flexibility & Support",
      desc: "Learn according to your timezone and personal schedule. Lifetime access to recorded sessions, class notes, and 1:1 doubt-clearing ensures you never fall behind.",
      icon: <I.Clock />,
      color: "#0891B2",
      bg: "#CFFAFE",
    },
  ];

  return (
    <main style={{ paddingTop: 90, minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg,#0F0A1E 0%,#1B0E33 100%)",
          padding: "70px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="orb"
          style={{ width: 480, height: 480, top: -180, left: -100, background: "rgba(124,58,237,0.3)" }}
        />
        <div
          className="orb"
          style={{ width: 360, height: 360, bottom: -100, right: -50, background: "rgba(6,182,212,0.2)" }}
        />

        <div className="container-xl" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <span className="badge badge-dark" style={{ marginBottom: 16, display: "inline-block" }}>
            About KR Tech
          </span>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              color: "white",
              marginBottom: 20,
              lineHeight: 1.15,
            }}
          >
            Redefining Tech Education with <br />
            <span className="gradient-text-warm">1-on-1 Personalized Mentorship</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 720,
              margin: "0 auto 36px",
              lineHeight: 1.75,
            }}
          >
            KR Tech was founded on a simple premise: mass recorded video courses fail learners. By pairing passionate
            students and working professionals with industry veterans for 1:1 live sessions, we deliver lasting mastery.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={onOpenDemoModal}
              className="btn-primary"
              style={{ padding: "14px 32px", borderRadius: 16 }}
            >
              <I.Sparkles /> Book Free Live Demo
            </button>
            <Link
              to="/courses"
              className="btn-ghost-white"
              style={{ padding: "14px 32px", borderRadius: 16, textDecoration: "none" }}
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsBar />

      {/* Mission & Vision Section */}
      <section style={{ padding: "80px 0", background: "white" }}>
        <div className="container-xl">
          <div className="two-col items-center">
            <div>
              <span className="badge badge-purple" style={{ marginBottom: 16, display: "inline-block" }}>
                Our Mission
              </span>
              <h2 className="section-title">
                Democratizing <span className="gradient-text">Elite Mentorship</span> for Every Aspirant
              </h2>
              <p className="section-desc" style={{ marginTop: 16 }}>
                We believe anyone with dedication can build world-class software when guided by experienced engineers.
                Our tailored 1:1 curriculum bridges the gap between traditional college academics and real-world high-scale
                software architecture.
              </p>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Zero generic batch teaching — 100% personalized live sessions",
                  "Direct code reviews and project architecture guidance",
                  "ATS-friendly resume overhaul and portfolio development",
                  "Dedicated doubt-clearing sessions whenever you need help",
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#374151" }}>
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
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                border: "1px solid #EDE9FE",
                boxShadow: "0 24px 60px rgba(124,58,237,0.12)",
                position: "relative",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&h=480&fit=crop&auto=format"
                alt="Mentorship session"
                style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  background: "rgba(15,10,30,0.85)",
                  backdropFilter: "blur(14px)",
                  borderRadius: 18,
                  padding: "16px 20px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                }}
              >
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15 }}>
                  The KR Tech Difference
                </div>
                <div style={{ fontSize: 12, color: "#A5F3FC", marginTop: 2 }}>
                  Dedicated 1:1 Live Coding · 10+ Yrs Mentors · 50,000+ Alumni
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-lavender" style={{ padding: "80px 0" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span className="badge badge-purple">Core Pillars</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>
              What Makes <span className="gradient-text">KR Tech</span> Unique
            </h2>
            <p className="section-desc" style={{ margin: "12px auto 0" }}>
              Our pedagogical philosophy is engineered specifically around individual learner success.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 22,
            }}
          >
            {values.map((v, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 30,
                  background: "white",
                  borderRadius: 20,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: v.bg,
                    color: v.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#0F0A1E",
                    marginBottom: 10,
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6B7280" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors on about page */}
      <Mentors />
    </main>
  );
}
