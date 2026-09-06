import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function LearningJourney({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const steps = [
    {
      num: "01",
      title: "Book Free 1:1 Live Demo",
      desc: "Experience our teaching methodology first-hand. Meet with a senior advisor, understand the curriculum, and set your career goals with zero commitment.",
      icon: <I.Sparkles />,
      badge: "Step 1",
      color: "#7C3AED",
    },
    {
      num: "02",
      title: "Meet Your Dedicated Mentor",
      desc: "Get paired with an industry engineer (10+ years exp at Amazon, Google, Razorpay). They evaluate your skill level and craft a custom syllabus tailored to you.",
      icon: <I.Users />,
      badge: "Step 2",
      color: "#0891B2",
    },
    {
      num: "03",
      title: "Personalized Live 1:1 Classes",
      desc: "Interactive live screen-sharing classes scheduled around your availability. Write code together, debug in real-time, and get immediate feedback on architectural patterns.",
      icon: <I.Play />,
      badge: "Step 3",
      color: "#7C3AED",
    },
    {
      num: "04",
      title: "Hands-on Assignments & Code Review",
      desc: "Build muscle memory with real programming challenges. Submit PRs on GitHub and receive line-by-line code reviews and refactoring suggestions from your mentor.",
      icon: <I.Code />,
      badge: "Step 4",
      color: "#0891B2",
    },
    {
      num: "05",
      title: "Enterprise-Grade Capstone Project",
      desc: "Architect and build high-scale production projects (Microservices, Full Stack Apps, AI Pipelines) ready to showcase on your portfolio and GitHub.",
      icon: <I.Award />,
      badge: "Step 5",
      color: "#7C3AED",
    },
    {
      num: "06",
      title: "Verified Certificate & Resume Support",
      desc: "Earn a globally verifiable KR Tech course completion certificate. Receive 1:1 ATS-friendly resume review and LinkedIn profile optimization from industry mentors.",
      icon: <I.Check />,
      badge: "Step 6",
      color: "#10B981",
    },
  ];

  return (
    <section id="journey" className="bg-lavender" style={{ padding: "80px 0" }}>
      <div className="container-xl">
        <div style={{ marginBottom: 52 }}>
          <SectionHeading
            badge="Your Roadmap"
            badgeClass="badge-purple"
            title="Your 6-Step"
            accent="Learning Journey"
            desc="From your very first free demo class to building enterprise applications with 10+ years mentors."
          />
        </div>

        <div style={{ maxWidth: 840, margin: "0 auto", position: "relative" }}>
          {/* Vertical glowing purple line */}
          <div className="timeline-line hidden sm:block" />

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {steps.map((s, i) => (
              <div
                key={i}
                className="timeline-item"
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                {/* Node icon */}
                <div className="timeline-node hidden sm:flex" style={{ color: s.color }}>
                  {s.icon}
                </div>

                {/* Card */}
                <div
                  className="card"
                  style={{
                    flex: 1,
                    padding: "26px 28px",
                    background: "white",
                    borderRadius: 24,
                    border: "1.5px solid #EDE9FE",
                    boxShadow: "0 6px 24px rgba(124,58,237,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: s.color,
                        background: "#F5F3FF",
                        padding: "3px 10px",
                        borderRadius: 99,
                      }}
                    >
                      {s.badge}
                    </span>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 16, color: "#C4B5FD" }}>
                      {s.num}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "#0F0A1E",
                      marginBottom: 8,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA trigger */}
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <button
              onClick={onOpenDemo}
              className="btn-primary"
              style={{ padding: "14px 34px", fontSize: 15, borderRadius: 16 }}
            >
              <I.Sparkles /> Start Your Learning Journey Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
