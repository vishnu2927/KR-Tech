import { Link } from "react-router-dom";
import { I } from "./Icons";
import VerifiedBadges from "./VerifiedBadges";

export default function Hero({ onOpenDemoModal }: { onOpenDemoModal?: () => void }) {
  const chips = [
    { label: "Java 21 & Spring Boot", query: "Java" },
    { label: "React 19 & Next.js", query: "MERN" },
    { label: "AI & LLMs", query: "AI" },
    { label: "AWS & Kubernetes", query: "Cloud" },
    { label: "DSA 250 Patterns", query: "DSA" },
    { label: "System Design", query: "Enterprise" },
    { label: "Cyber Security", query: "Cyber" },
    { label: "SAP & Salesforce", query: "Enterprise" },
  ];

  return (
    <section className="relative overflow-hidden bg-hero pt-28 pb-20 sm:pb-28" style={{ minHeight: "94vh", display: "flex", flexDirection: "column" }}>
      {/* Dynamic ambient floating gradients */}
      <div className="orb" style={{ width: 720, height: 720, top: -200, left: -160, background: "rgba(124,58,237,0.32)" }} />
      <div className="orb" style={{ width: 560, height: 560, top: 40, right: -160, background: "rgba(6,182,212,0.26)" }} />
      <div className="orb" style={{ width: 440, height: 440, bottom: -80, left: "32%", background: "rgba(99,102,241,0.22)" }} />

      <div className="container-xl relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        {/* Top Live Training Pill Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-6 fade-up-1"
          style={{
            background: "rgba(15, 10, 35, 0.8)",
            border: "1px solid rgba(6, 182, 212, 0.4)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 25px rgba(6, 182, 212, 0.25)",
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, fontWeight: 700, color: "#67E8F9" }}>
            ONE-ON-ONE LIVE TRAINING · 55+ COURSES · 10+ MENTORS
          </span>
        </div>

        {/* Hero Headline */}
        <h1
          className="fade-up-2 font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(2.5rem, 6vw, 4.6rem)",
            lineHeight: 1.1,
            color: "white",
            maxWidth: 960,
            marginBottom: 20,
            textShadow: "0 8px 40px rgba(124,58,237,0.45)",
            letterSpacing: "-0.035em",
          }}
        >
          Master Software Engineering with{" "}
          <span className="gradient-text-warm">1-on-1 Live Mentorship.</span>
        </h1>

        {/* Hero Subtitle */}
        <p
          className="fade-up-3"
          style={{
            fontFamily: "Inter,sans-serif",
            fontSize: "clamp(15px, 1.8vw, 18px)",
            lineHeight: 1.75,
            color: "rgba(243, 244, 246, 0.85)",
            maxWidth: 820,
            marginBottom: 34,
            letterSpacing: "0.01em",
          }}
        >
          Master Future-Ready Technology Skills with Personalized One-on-One Learning. Learn through live mentorship, practical projects, AI-powered study tools, certification preparation, and industry-focused training.
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
              background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
              boxShadow: "0 10px 35px rgba(124, 58, 237, 0.45)",
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
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            Explore Courses <I.ArrowRight />
          </Link>
        </div>

        {/* Tech Focus Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 fade-up-5 max-w-4xl">
          {chips.map((c) => (
            <Link
              key={c.label}
              to={`/courses?category=${encodeURIComponent(c.query)}`}
              className="text-xs font-semibold px-4 py-2 rounded-full transition-all hover:border-cyan-400 hover:text-cyan-200"
              style={{
                fontFamily: "Poppins,sans-serif",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.88)",
                textDecoration: "none",
                backdropFilter: "blur(10px)",
              }}
            >
              ⚡ {c.label}
            </Link>
          ))}
        </div>

        {/* Verified Company Trust Badges (Phase 13 Section 1) */}
        <div className="mb-10 w-full max-w-4xl fade-up-5">
          <VerifiedBadges variant="pill" />
        </div>

        {/* Software Learning Pair-Programming Hero Stage (IDE Mockup + Live Screen Share) */}
        <div className="relative w-full max-w-5xl fade-up-5">
          {/* Floating Glass Stat 1 - Top Left: 10+ Expert Mentors */}
          <div
            className="floating-card hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              top: -24,
              left: -32,
              zIndex: 30,
              background: "rgba(18, 12, 38, 0.88)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(167, 139, 250, 0.35)",
              boxShadow: "0 20px 45px rgba(0,0,0,0.6)",
              animation: "float-1 5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
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
                10+ Senior Mentors
              </div>
              <div style={{ fontSize: 11, color: "#A5F3FC", fontWeight: 500 }}>
                Enterprise Architects & Technical Mentors
              </div>
            </div>
          </div>

          {/* Floating Glass Stat 2 - Top Right: One-on-One Live Screen-Share */}
          <div
            className="floating-card hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              top: -15,
              right: -28,
              zIndex: 30,
              background: "rgba(18, 12, 38, 0.88)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(6, 182, 212, 0.4)",
              boxShadow: "0 20px 45px rgba(0,0,0,0.6)",
              animation: "float-2 6s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
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
                One-on-One Live Coding
              </div>
              <div style={{ fontSize: 11, color: "#DDD6FE", fontWeight: 500 }}>
                Screen share & Line-by-Line PRs
              </div>
            </div>
          </div>

          {/* Floating Glass Stat 3 - Bottom Left: 55+ Courses */}
          <div
            className="floating-card hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              bottom: 24,
              left: -35,
              zIndex: 30,
              background: "rgba(18, 12, 38, 0.88)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(124, 58, 237, 0.4)",
              boxShadow: "0 20px 45px rgba(0,0,0,0.6)",
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
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "white" }}>
                55+ Certified Courses
              </div>
              <div style={{ fontSize: 11, color: "#A7F3D0", fontWeight: 500 }}>
                MongoDB Atlas Synced Catalog
              </div>
            </div>
          </div>

          {/* Floating Glass Stat 4 - Bottom Right: 100+ Certifications */}
          <div
            className="floating-card hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl"
            style={{
              position: "absolute",
              bottom: 30,
              right: -32,
              zIndex: 30,
              background: "rgba(18, 12, 38, 0.88)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              boxShadow: "0 20px 45px rgba(0,0,0,0.6)",
              animation: "float-1 6.5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Sparkles />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 13, color: "white" }}>
                100+ Certifications
              </div>
              <div style={{ fontSize: 11, color: "#FDE68A", fontWeight: 500 }}>
                98% Practical Mastery
              </div>
            </div>
          </div>

          {/* Interactive IDE Stage Mockup */}
          <div
            className="w-full rounded-3xl overflow-hidden text-left"
            style={{
              background: "rgba(11, 7, 24, 0.95)",
              border: "1px solid rgba(167, 139, 250, 0.25)",
              boxShadow: "0 30px 100px rgba(124, 58, 237, 0.35), 0 0 40px rgba(6, 182, 212, 0.2)",
            }}
          >
            {/* macOS Window Controls & Tabs Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                background: "rgba(22, 15, 45, 0.9)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-3 text-xs font-mono text-gray-400 hidden sm:inline">
                  kr-global-live-session · OrderProcessingService.java
                </span>
              </div>

              {/* IDE Tabs */}
              <div className="flex items-center gap-1">
                <span
                  className="text-xs px-3 py-1 rounded-t-lg font-mono text-cyan-300 font-semibold flex items-center gap-1.5"
                  style={{ background: "rgba(11, 7, 24, 0.9)", borderBottom: "2px solid #06B6D4" }}
                >
                  ☕ OrderService.java
                </span>
                <span className="text-xs px-3 py-1 rounded-t-lg font-mono text-gray-400 hidden sm:inline">
                  ⚛️ App.tsx
                </span>
                <span className="text-xs px-3 py-1 rounded-t-lg font-mono text-gray-500 hidden md:inline">
                  📊 system-design.puml
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="hidden sm:inline">One-on-One LIVE</span>
              </div>
            </div>

            {/* Code Body & Mentor Picture-in-Picture */}
            <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm text-gray-300 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Syntax Highlighted Java / Spring Code */}
                <div className="lg:col-span-8 space-y-1">
                  <div className="text-purple-400 font-semibold">@Service</div>
                  <div className="text-purple-400 font-semibold">
                    @Transactional<span className="text-gray-400">(rollbackFor = Exception.class)</span>
                  </div>
                  <div>
                    <span className="text-blue-400">public class</span>{" "}
                    <span className="text-yellow-300 font-bold">OrderProcessingService</span>{" "}
                    <span className="text-gray-400">&#123;</span>
                  </div>
                  <div className="pl-4 text-gray-500 italic">
                    // One-on-One Live Mentor Review: Implementing Distributed SAGA with Kafka
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">@CircuitBreaker</span>
                    <span className="text-gray-400">(name = </span>
                    <span className="text-emerald-300">"paymentGateway"</span>
                    <span className="text-gray-400">, fallbackMethod = </span>
                    <span className="text-emerald-300">"fallbackPayment"</span>
                    <span className="text-gray-400">)</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">public</span>{" "}
                    <span className="text-cyan-300">CompletableFuture&lt;OrderReceipt&gt;</span>{" "}
                    <span className="text-amber-300">processOrder</span>
                    <span className="text-gray-400">(OrderRequest req) &#123;</span>
                  </div>
                  <div className="pl-8 text-gray-300">
                    <span className="text-blue-400">log</span>.info(
                    <span className="text-emerald-300">"Processing live transaction ID: &#123;&#125;"</span>, req.getId());
                  </div>
                  <div className="pl-8 text-cyan-400">
                    return kafkaProducer.send(ORDER_TOPIC, req)
                  </div>
                  <div className="pl-12 text-gray-400">
                    .thenApply(record -&gt; receiptGenerator.create(record));
                  </div>
                  <div className="pl-4 text-gray-400">&#125;</div>
                  <div className="text-gray-400">&#125;</div>

                  {/* Terminal Output snippet */}
                  <div
                    className="mt-4 p-3 rounded-xl border border-white/10 font-mono text-[11px] sm:text-xs"
                    style={{ background: "rgba(0, 0, 0, 0.45)" }}
                  >
                    <div className="text-gray-400 flex items-center justify-between border-b border-white/10 pb-1 mb-1.5">
                      <span>TERMINAL — KR GLOBAL LEARNING CLOUD RUNNER</span>
                      <span className="text-cyan-400">K8s Cluster: Production Ready</span>
                    </div>
                    <div className="text-emerald-400">
                      ✓ Build SUCCESS · 52/52 Microservice Integration Tests Passed (0 errors)
                    </div>
                    <div className="text-purple-300">
                      ⚡ Docker container deployed to AWS EKS: ingress-endpoint.krglobal.internal
                    </div>
                  </div>
                </div>

                {/* Right Side: Mentor Video Screen-Share PiP Overlay */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div
                    className="rounded-2xl p-3 border border-purple-500/30 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(30, 15, 60, 0.85), rgba(15, 10, 30, 0.95))",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        LIVE One-on-One SCREEN SHARE
                      </span>
                      <span className="text-[11px] text-cyan-300 font-sans font-semibold">Session #1820</span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden mb-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=300&fit=crop&auto=format"
                        alt="One-on-One Live Coding Mentor"
                        className="w-full h-28 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-sans font-bold text-xs text-white">Siddharth Rao</div>
                          <div className="text-[10px] text-cyan-300 font-sans">Staff Software Engineer</div>
                        </div>
                        <span className="text-emerald-400 text-xs">🎙️ Audio On</span>
                      </div>
                    </div>

                    {/* Mentor Feedback Bubble */}
                    <div
                      className="p-2.5 rounded-xl text-[11px] font-sans text-gray-200 border border-white/10"
                      style={{ background: "rgba(255, 255, 255, 0.05)" }}
                    >
                      <p className="line-clamp-3 italic text-purple-200">
                        "Your Saga pattern handles failures cleanly! Let's test the outbox publisher with our mock Kafka cluster next."
                      </p>
                    </div>
                  </div>

                  {/* Quick Booking Callout */}
                  <div className="mt-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-center">
                    <div className="text-xs font-bold text-cyan-300 font-sans mb-1">
                      Ready for One-on-One Live Coding?
                    </div>
                    <div className="text-[11px] text-gray-300 font-sans mb-2">
                      Zero commitment. 45-min live session with an architect.
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenDemoModal && onOpenDemoModal()}
                      className="w-full py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all cursor-pointer font-sans shadow"
                    >
                      Claim Your Free One-on-One Learning Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
