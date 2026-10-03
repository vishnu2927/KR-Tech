import { useState, useEffect } from "react";
import { I } from "./Icons";

interface Metric {
  target: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: string;
  accent: string;
  glow: string;
}

export default function StudentSuccessMetrics() {
  const metrics: Metric[] = [
    {
      target: 84,
      suffix: "",
      label: "Live Tech Courses",
      sublabel: "Atlas MongoDB Synced",
      icon: "📚",
      accent: "#06B6D4",
      glow: "rgba(6,182,212,0.25)",
    },
    {
      target: 10,
      suffix: "+",
      label: "Expert Tech Mentors",
      sublabel: "Experienced Practitioners",
      icon: "⚡",
      accent: "#A78BFA",
      glow: "rgba(167,139,250,0.25)",
    },
    {
      target: 1,
      suffix: ":1",
      label: "Live Mentorship Ratio",
      sublabel: "Zero Mass Lecture Halls",
      icon: "🎯",
      accent: "#38BDF8",
      glow: "rgba(56,189,248,0.25)",
    },
    {
      target: 100,
      suffix: "%",
      label: "Practical Labs Built",
      sublabel: "Production-Grade Projects",
      icon: "🚀",
      accent: "#10B981",
      glow: "rgba(16,185,129,0.25)",
    },
    {
      target: 84,
      suffix: "",
      label: "Certification Roadmaps",
      sublabel: "Vendor-Aligned Syllabus",
      icon: "🏆",
      accent: "#F59E0B",
      glow: "rgba(245,158,11,0.25)",
    },
    {
      target: 100,
      suffix: "%",
      label: "One-on-One Attention",
      sublabel: "Tailored Learning Path",
      icon: "⭐",
      accent: "#EC4899",
      glow: "rgba(236,72,153,0.25)",
    },
  ];

  const [counts, setCounts] = useState<number[]>(metrics.map(() => 0));

  useEffect(() => {
    const duration = 1800; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(metrics.map((m) => Math.floor(m.target * eased)));

      if (step >= steps) {
        clearInterval(timer);
        setCounts(metrics.map((m) => m.target));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden bg-dark-obsidian text-white border-y border-purple-500/20">
      {/* Background ambient lighting */}
      <div className="orb" style={{ width: 480, height: 480, top: -100, right: "10%", background: "rgba(124,58,237,0.2)" }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: -120, left: "15%", background: "rgba(6,182,212,0.18)" }} />

      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-3">
            <I.Sparkles /> VERIFIED OUTCOMES & METRICS
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Engineered for <span className="gradient-text-warm">High-Impact Tech Careers</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-3 max-w-2xl mx-auto">
            From fundamentals to advanced system architectures. Experience KR Global Learning for One-on-One tech mastery.
          </p>
        </div>

        {/* Animated Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="glass-card-dark p-5 sm:p-6 text-center flex flex-col items-center justify-between group hover:border-purple-400/50"
              style={{
                boxShadow: `0 10px 30px rgba(0,0,0,0.4), inset 0 0 20px ${m.glow}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 transition-transform group-hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${m.accent}40`,
                }}
              >
                {m.icon}
              </div>

              <div
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-3xl text-white tracking-tight mb-1"
                style={{ color: m.accent }}
              >
                {counts[idx].toLocaleString()}
                <span>{m.suffix}</span>
              </div>

              <div className="text-xs sm:text-sm text-white font-semibold mb-1">
                {m.label}
              </div>

              <div className="text-[11px] text-gray-400 font-medium">
                {m.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
