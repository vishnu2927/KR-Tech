import { I } from "./Icons";

export default function LearningJourney({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const steps = [
    {
      num: "01",
      phase: "Phase 1",
      title: "Skill Diagnostic & One-on-One Goal Calibration",
      desc: "Experience our teaching methodology first-hand. Meet with a senior advisor, evaluate current gaps, and establish milestone targets with zero financial commitment.",
      icon: <I.Sparkles />,
      accent: "#06B6D4",
      bg: "rgba(6,182,212,0.15)",
    },
    {
      num: "02",
      phase: "Phase 2",
      title: "Dedicated Senior Technical Mentor Pairing",
      desc: "Get matched One-on-One with an active staff engineer (10+ years at Amazon, Google, Razorpay). They design a customized syllabus aligned with your career goals.",
      icon: <I.Users />,
      accent: "#A78BFA",
      bg: "rgba(167,139,250,0.15)",
    },
    {
      num: "03",
      phase: "Phase 3",
      title: "Personalized Live One-on-One Coding Sessions",
      desc: "Interactive live screen-sharing scheduled at your flexibility. Write code together, master distributed design patterns, and solve production bottlenecks in real-time.",
      icon: <I.Play />,
      accent: "#38BDF8",
      bg: "rgba(56,189,248,0.15)",
    },
    {
      num: "04",
      phase: "Phase 4",
      title: "Line-by-Line GitHub PR Code Reviews",
      desc: "Develop production muscle memory. Submit pull requests on GitHub and receive thorough line-by-line code reviews, linting feedback, and performance refactoring from your mentor.",
      icon: <I.Code />,
      accent: "#10B981",
      bg: "rgba(16,185,129,0.15)",
    },
    {
      num: "05",
      phase: "Phase 5",
      title: "Enterprise-Grade Capstone Deployment",
      desc: "Architect scalable distributed systems (Microservices, Kafka Pipelines, AI Agents, Cloud Infra) ready for live production deployment and portfolio defense.",
      icon: <I.Award />,
      accent: "#F59E0B",
      bg: "rgba(245,158,11,0.15)",
    },
    {
      num: "06",
      phase: "Phase 6",
      title: "Industry Certification & Verifiable Credential",
      desc: "Earn an official verified certificate of completion with unique Credential ID and live QR code. Master vendor exam objectives for AWS, Azure, Cisco, and SAP through structured capstone assessments.",
      icon: <I.Check />,
      accent: "#EC4899",
      bg: "rgba(236,72,153,0.15)",
    },
  ];

  return (
    <section id="journey" className="py-24 bg-dark-purple relative overflow-hidden text-white border-t border-purple-500/15">
      {/* Background ambient lighting */}
      <div className="orb" style={{ width: 550, height: 550, top: -120, left: -60, background: "rgba(124,58,237,0.2)" }} />
      <div className="orb" style={{ width: 450, height: 450, bottom: -80, right: -40, background: "rgba(6,182,212,0.18)" }} />

      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-3">
            <I.Sparkles /> 6-PHASE SCALABLE ROADMAP
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Your Accelerated <span className="gradient-text-warm">Learning Journey</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl mx-auto">
            From your very first diagnostic demo class to building high-concurrency enterprise applications with 10+ years mentors.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical glowing timeline line */}
          <div
            className="hidden sm:block absolute left-8 top-6 bottom-6 w-1 rounded-full"
            style={{
              background: "linear-gradient(180deg, #06B6D4 0%, #7C3AED 50%, #EC4899 100%)",
              boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)",
            }}
          />

          <div className="space-y-6 sm:space-y-8">
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-4 sm:gap-8 relative group"
              >
                {/* Node icon */}
                <div
                  className="hidden sm:flex w-16 h-16 rounded-2xl items-center justify-center shrink-0 z-10 text-xl font-bold transition-transform group-hover:scale-110"
                  style={{
                    background: "rgba(18, 12, 38, 0.95)",
                    border: `2px solid ${s.accent}`,
                    boxShadow: `0 0 25px ${s.accent}40`,
                    color: s.accent,
                  }}
                >
                  {s.icon}
                </div>

                {/* Glassmorphism Card */}
                <div
                  className="glass-card-dark p-6 sm:p-7 flex-1 text-left group-hover:border-purple-400/50"
                  style={{
                    background: "rgba(18, 12, 38, 0.8)",
                    border: "1px solid rgba(167, 139, 250, 0.18)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-sans"
                      style={{
                        background: s.bg,
                        color: s.accent,
                        border: `1px solid ${s.accent}40`,
                      }}
                    >
                      {s.phase}
                    </span>
                    <span className="font-display font-black text-xl text-gray-500 group-hover:text-purple-300 transition-colors">
                      {s.num}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA trigger */}
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={onOpenDemo}
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
              <I.Sparkles /> Start Your Learning Journey Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
