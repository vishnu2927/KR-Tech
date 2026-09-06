import { Link } from "react-router-dom";
import { I } from "./Icons";

export default function Hero({ onOpenDemoModal }: { onOpenDemoModal?: () => void }) {
  const chips = [
    "Java Backend",
    "MERN Stack",
    "AI & ML",
    "Data Science",
    "DSA & Algorithms",
    "1:1 Live Training",
    "Free Demo Class",
  ];

  return (
    <section className="relative overflow-hidden bg-hero" style={{ minHeight: "92vh", display: "flex", flexDirection: "column" }}>
      {/* Dynamic ambient floating gradients */}
      <div className="orb" style={{ width: 680, height: 680, top: -220, left: -180, background: "rgba(124,58,237,0.28)" }} />
      <div className="orb" style={{ width: 480, height: 480, top: 60, right: -140, background: "rgba(6,182,212,0.22)" }} />
      <div className="orb" style={{ width: 360, height: 360, bottom: -90, left: "35%", background: "rgba(167,139,250,0.18)" }} />

      <div className="container-xl relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-28 pb-16">
        {/* Top Pill Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8 fade-up-1"
          style={{
            background: "rgba(124,58,237,0.22)",
            border: "1px solid rgba(167,139,250,0.4)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 24px rgba(124,58,237,0.2)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: "pulse-slow 2s infinite" }} />
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, fontWeight: 600, color: "#A5F3FC" }}>
            ⭐ 1:1 Live Training · 10+ Years Expert Mentors
          </span>
        </div>

        {/* Hero Headline */}
        <h1
          className="fade-up-2"
          style={{
            fontFamily: "Poppins,sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
            lineHeight: 1.12,
            color: "white",
            maxWidth: 920,
            marginBottom: 20,
            textShadow: "0 6px 30px rgba(124,58,237,0.35)",
            letterSpacing: "-0.03em",
          }}
        >
          Learn Live. Build Real Projects.{" "}
          <span className="gradient-text-warm">Grow with KR Tech.</span>
        </h1>

        {/* Hero Subtitle */}
        <p
          className="fade-up-3"
          style={{
            fontFamily: "Inter,sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.78)",
            maxWidth: 720,
            marginBottom: 36,
            letterSpacing: "0.01em",
          }}
        >
          Personalized One-on-One Live Training from mentors with{" "}
          <strong style={{ color: "white" }}>10+ years of industry experience</strong>. Build real-world projects,
          master system design, and learn at your own pace.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 fade-up-4">
          <button
            onClick={() => onOpenDemoModal && onOpenDemoModal()}
            className="btn-primary"
            style={{ padding: "14px 34px", fontSize: 15, borderRadius: 16, cursor: "pointer" }}
          >
            <I.Sparkles /> Book Free Demo
          </button>
          <Link
            to="/courses"
            className="btn-ghost-white"
            style={{ padding: "14px 34px", fontSize: 15, borderRadius: 16, textDecoration: "none" }}
          >
            Explore Courses <I.ArrowRight />
          </Link>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-14 fade-up-5">
          {chips.map((c) => (
            <Link
              key={c}
              to="/courses"
              className="text-sm font-medium px-4 py-1.5 rounded-full transition-all hover:bg-violet-600 hover:border-violet-600"
              style={{
                fontFamily: "Poppins,sans-serif",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.88)",
                textDecoration: "none",
              }}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Hero Visual Container with Apple/Framer-style Floating Cards */}
        <div className="relative w-full" style={{ maxWidth: 1040 }}>
          {/* Floating Stat Card 1 - 10+ Yrs Mentors (Top Left) */}
          <div
            className="floating-card hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              top: 15,
              left: -40,
              zIndex: 20,
              background: "rgba(15,10,30,0.88)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(167,139,250,0.35)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
              animation: "float-1 5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Award />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "white" }}>
                10+ Yrs Mentors
              </div>
              <div style={{ fontSize: 11, color: "#A5F3FC" }}>Ex-Amazon, Google, Razorpay</div>
            </div>
          </div>

          {/* Floating Stat Card 2 - 1:1 Live Coding (Top Right) */}
          <div
            className="floating-card hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              top: 35,
              right: -30,
              zIndex: 20,
              background: "rgba(15,10,30,0.88)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(6,182,212,0.4)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
              animation: "float-2 6s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg,#06B6D4,#3B82F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Code />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "white" }}>
                1:1 Live Coding
              </div>
              <div style={{ fontSize: 11, color: "#DDD6FE" }}>Personalized screen share</div>
            </div>
          </div>

          {/* Floating Stat Card 3 - 50K+ Learners (Bottom Left) */}
          <div
            className="floating-card hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              bottom: 80,
              left: -30,
              zIndex: 20,
              background: "rgba(15,10,30,0.88)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(124,58,237,0.4)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
              animation: "float-3 5.5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg,#10B981,#059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Users />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "white" }}>
                50,000+ Learners
              </div>
              <div style={{ fontSize: 11, color: "#A7F3D0" }}>4.9★ Average Rating</div>
            </div>
          </div>

          {/* Hero Image Frame with Glass Accent */}
          <div
            className="relative w-full rounded-3xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 40px 120px rgba(124,58,237,0.32)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1604872412583-53667c1a6fcf?w=1200&h=480&fit=crop&auto=format"
              alt="Students learning 1:1 with tech mentors"
              className="w-full object-cover"
              style={{ height: "clamp(220px,36vw,400px)", display: "block" }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(15,10,30,0.92) 0%, transparent 60%)" }}
            />

            {/* Bottom Stats Overlay */}
            <div className="absolute bottom-5 left-0 right-0 flex flex-wrap gap-3 justify-center px-4">
              {[
                { n: "50K+", l: "Students Trained" },
                { n: "10+", l: "Years Expert Mentors" },
                { n: "1:1", l: "Live Sessions" },
                { n: "500+", l: "Projects Shipped" },
                { n: "4.9★", l: "Learner Rating" },
              ].map((s) => (
                <div
                  key={s.n}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(18px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 18, color: "white" }}>
                    {s.n}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
