import { Link } from "react-router-dom";
import { I } from "./Icons";
import VerifiedBadges from "./VerifiedBadges";

export default function Hero({ onOpenDemoModal }: { onOpenDemoModal?: () => void }) {
  const chips = [
    { label: "Java & Microservices", query: "Java" },
    { label: "React & Next.js", query: "MERN" },
    { label: "AI & GenAI Systems", query: "AI" },
    { label: "AWS & Cloud Architecture", query: "Cloud" },
    { label: "DSA & Problem Solving", query: "DSA" },
    { label: "System Design", query: "Enterprise" },
    { label: "Cyber Security", query: "Cyber" },
    { label: "DevOps & Kubernetes", query: "DevOps" },
  ];

  return (
    <section className="relative overflow-hidden bg-hero pt-28 pb-20 sm:pb-28 border-b border-slate-200/80" style={{ minHeight: "94vh", display: "flex", flexDirection: "column" }}>
      {/* Cool ambient floating gradients */}
      <div className="orb" style={{ width: 620, height: 620, top: -160, left: -120, background: "rgba(37,99,235,0.12)" }} />
      <div className="orb" style={{ width: 520, height: 520, top: 40, right: -120, background: "rgba(79,70,229,0.10)" }} />
      <div className="orb" style={{ width: 440, height: 440, bottom: -80, left: "32%", background: "rgba(6,182,212,0.10)" }} />

      <div className="container-xl relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        {/* Top Live Training Pill Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-6 fade-up-1 shadow-xs"
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            backdropFilter: "blur(16px)",
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, fontWeight: 700, color: "#1D4ED8" }}>
            ONE-ON-ONE LIVE TRAINING · TECHNOLOGY COURSES · PERSONALIZED MENTORSHIP
          </span>
        </div>

        {/* Hero Headline */}
        <h1
          className="fade-up-2 font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(2.5rem, 6vw, 4.6rem)",
            lineHeight: 1.12,
            color: "#0F172A",
            maxWidth: 960,
            marginBottom: 20,
            letterSpacing: "-0.035em",
          }}
        >
          Master Modern Technology with{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            One-on-One Live Mentorship.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p
          className="fade-up-3"
          style={{
            fontFamily: "Inter,sans-serif",
            fontSize: "clamp(15px, 1.8vw, 18px)",
            lineHeight: 1.75,
            color: "#475569",
            maxWidth: 820,
            marginBottom: 34,
            letterSpacing: "0.01em",
          }}
        >
          Accelerate your technology career with personalized One-on-One learning. Industry-aligned technology training, official certification preparation, hands-on practical projects, AI learning, and dedicated mentor support.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10 fade-up-4">
          <button
            type="button"
            onClick={() => onOpenDemoModal && onOpenDemoModal()}
            className="btn-primary"
            style={{
              padding: "16px 36px",
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 16,
              cursor: "pointer",
              background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
            }}
          >
            <I.Sparkles /> Book Free Consultation
          </button>
          <Link
            to="/courses"
            className="btn-ghost-white"
            style={{
              padding: "16px 34px",
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 16,
              textDecoration: "none",
              border: "1.5px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#0F172A",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
            }}
          >
            Explore 84 Courses <I.ArrowRight />
          </Link>
        </div>

        {/* Tech Focus Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 fade-up-5 max-w-4xl">
          {chips.map((c) => (
            <Link
              key={c.label}
              to={`/courses?category=${encodeURIComponent(c.query)}`}
              className="text-xs font-semibold px-4 py-2 rounded-full transition-all hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 shadow-2xs"
              style={{
                fontFamily: "Poppins,sans-serif",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#334155",
                textDecoration: "none",
              }}
            >
              ⚡ {c.label}
            </Link>
          ))}
        </div>

        {/* Verified Company Trust Badges */}
        <div className="mb-12 w-full max-w-4xl fade-up-5">
          <VerifiedBadges variant="pill" />
        </div>

        {/* Professional Technology Learning Platform Dashboard Showcase */}
        <div className="relative w-full max-w-5xl fade-up-5">
          {/* Floating Card 1 - Top Left: Senior Tech Mentors */}
          <div
            className="floating-card hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              top: -20,
              left: -28,
              zIndex: 30,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
              animation: "float-1 5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Users />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "#0F172A" }}>
                Senior Tech Mentors
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
                Enterprise Technical Architects
              </div>
            </div>
          </div>

          {/* Floating Card 2 - Top Right: One-on-One Live Sessions */}
          <div
            className="floating-card hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              top: -15,
              right: -24,
              zIndex: 30,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
              animation: "float-2 6s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #06B6D4, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Sparkles />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "#0F172A" }}>
                One-on-One Live Mentorship
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
                Dedicated Screen Share & Review
              </div>
            </div>
          </div>

          {/* Floating Card 3 - Bottom Left: 84 Courses */}
          <div
            className="floating-card hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              bottom: 24,
              left: -28,
              zIndex: 30,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
              animation: "float-3 5.5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #10B981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Award />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "#0F172A" }}>
                84 Active Technology Courses
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
                40–42 Hours Structured Curricula
              </div>
            </div>
          </div>

          {/* Floating Card 4 - Bottom Right: Global Certifications */}
          <div
            className="floating-card hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              bottom: 30,
              right: -24,
              zIndex: 30,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
              animation: "float-1 6.5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #2563EB, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Check />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "#0F172A" }}>
                Vendor Certification Prep
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
                AWS · Azure · Cisco · Kubernetes · SAP
              </div>
            </div>
          </div>

          {/* Main Dashboard Stage Card */}
          <div
            className="w-full rounded-3xl overflow-hidden text-left bg-white border border-slate-200 shadow-2xl"
            style={{
              boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 35px rgba(37, 99, 235, 0.08)",
            }}
          >
            {/* Stage Header */}
            <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                </div>
                <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />
                <span className="text-xs font-mono font-semibold text-slate-300">
                  KR GLOBAL LEARNING · Technology Training & Mentorship Platform
                </span>
              </div>

              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  LIVE ONE-ON-ONE SESSION
                </span>
                <span className="text-xs font-mono text-slate-400 hidden md:inline">
                  Interactive Cohort v12.0
                </span>
              </div>
            </div>

            {/* Stage Body Grid */}
            <div className="p-6 sm:p-8 bg-slate-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Module 1: Active Technology Program & Roadmap (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Active Course Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        Active Training Track
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        Duration: 42 Hours
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
                      Enterprise Cloud Architecture & Distributed Systems
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      Comprehensive One-on-One live curriculum covering microservices, multi-region high availability, Docker containerization, and AWS/Azure deployment.
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Curriculum Progression</span>
                        <span className="text-blue-600 font-bold">85% Completed</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
                          style={{ width: "85%" }}
                        />
                      </div>
                    </div>

                    {/* Checkpoints Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="text-slate-700 font-medium truncate">Domain Microservices</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="text-slate-700 font-medium truncate">Kafka Event Streams</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="text-slate-700 font-medium truncate">CI/CD Pipeline Design</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 font-bold">
                        <span className="text-blue-600 animate-pulse">●</span>
                        <span className="truncate">Capstone Architecture</span>
                      </div>
                    </div>
                  </div>

                  {/* Practical Project Delivery Metric */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-lg border border-indigo-200">
                        🚀
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Production Capstone Project Defense
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Multi-Region Kubernetes Deployment & Microservices Architecture
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Evaluated & Verified
                    </span>
                  </div>
                </div>

                {/* Module 2: Dedicated Mentor Advisory & Support (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Senior Mentor Interaction Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Dedicated Senior Mentor
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        One-on-One
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&auto=format"
                        alt="Senior Technical Architect Mentor"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-200 shadow-sm"
                      />
                      <div>
                        <div className="font-display font-bold text-sm text-slate-900">
                          Senior Technical Architect
                        </div>
                        <div className="text-xs text-slate-500">
                          10+ Years Enterprise Experience
                        </div>
                        <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">
                          Specialization: Cloud & Distributed Systems
                        </div>
                      </div>
                    </div>

                    {/* Mentor Feedback Box */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed italic">
                      "Your microservice resiliency pattern and idempotency handling are solid. In our next One-on-One live session, we'll verify container orchestration and prepare for official cloud certification."
                    </div>

                    {/* Upcoming Session Schedule */}
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] uppercase font-bold text-blue-700">Next Live Session</div>
                        <div className="text-xs font-bold text-slate-900">Tomorrow · Flexible Schedule</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold">
                        Confirmed
                      </span>
                    </div>
                  </div>

                  {/* 24x7 Academic Support Pill */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm border border-cyan-200">
                        ⚡
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">24×7 Student Support</div>
                        <div className="text-[11px] text-slate-500">Continuous doubt resolution & guidance</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                      Active
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Stage Footer Strip */}
            <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-blue-600 font-bold">✓</span> 84 Active Courses
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-blue-600 font-bold">✓</span> 100% Live One-on-One Mentorship
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-blue-600 font-bold">✓</span> Verified Project Capstones
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-blue-600 font-bold">✓</span> Official Certification Preparation
                </span>
              </div>

              <Link
                to="/courses"
                className="font-bold text-blue-700 hover:text-blue-800 no-underline flex items-center gap-1"
              >
                <span>View Complete Course Catalog</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
