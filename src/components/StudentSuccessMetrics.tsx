import { useState, useEffect } from "react";
import { I } from "./Icons";

interface Metric {
  target: number;
  suffix: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

export default function StudentSuccessMetrics() {
  const metrics: Metric[] = [
    { target: 15000, suffix: "+", label: "Students Trained", icon: "🎓", color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
    { target: 50, suffix: "+", label: "Professional Courses", icon: "📚", color: "#06B6D4", bg: "rgba(6,182,212,0.1)" },
    { target: 10, suffix: "+", label: "Expert Mentors", icon: "⚡", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { target: 500, suffix: "+", label: "Projects Completed", icon: "🚀", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { target: 100, suffix: "+", label: "Live Sessions / Month", icon: "🔴", color: "#EC4899", bg: "rgba(236,72,153,0.1)" },
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
    <section className="py-14 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="container-xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-2">
            <I.Sparkles /> Proven Track Record
          </span>
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
            Transforming Engineering Careers Across the Globe
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
                style={{ background: m.bg }}
              >
                {m.icon}
              </div>

              <div className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight mb-1">
                {counts[idx].toLocaleString()}
                <span className="text-purple-400">{m.suffix}</span>
              </div>

              <div className="text-xs sm:text-sm text-purple-200/90 font-medium">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
