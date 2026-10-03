import { useState, useEffect } from "react";
import { I } from "./Icons";

interface Metric {
  target: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: string;
  gradientClass: string;
  textGradient: string;
  badgeBg: string;
  borderColor: string;
}

export default function StudentSuccessMetrics() {
  const metrics: Metric[] = [
    {
      target: 84,
      suffix: "",
      label: "Active Courses",
      sublabel: "Specialized Syllabi",
      icon: "📚",
      gradientClass: "from-blue-500/10 to-indigo-500/10",
      textGradient: "text-blue-600",
      badgeBg: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-200/80 hover:border-blue-400",
    },
    {
      target: 12,
      suffix: "",
      label: "Tech Domains",
      sublabel: "Full Stack to Cloud",
      icon: "⚡",
      gradientClass: "from-indigo-500/10 to-purple-500/10",
      textGradient: "text-indigo-600",
      badgeBg: "bg-indigo-100 text-indigo-700",
      borderColor: "border-indigo-200/80 hover:border-indigo-400",
    },
    {
      target: 1,
      suffix: ":1",
      label: "Live Mentorship",
      sublabel: "Dedicated Guidance",
      icon: "🎯",
      gradientClass: "from-cyan-500/10 to-blue-500/10",
      textGradient: "text-cyan-600",
      badgeBg: "bg-cyan-100 text-cyan-700",
      borderColor: "border-cyan-200/80 hover:border-cyan-400",
    },
    {
      target: 100,
      suffix: "%",
      label: "Practical Labs",
      sublabel: "Hands-On Projects",
      icon: "💻",
      gradientClass: "from-teal-500/10 to-emerald-500/10",
      textGradient: "text-teal-600",
      badgeBg: "bg-teal-100 text-teal-700",
      borderColor: "border-teal-200/80 hover:border-teal-400",
    },
    {
      target: 84,
      suffix: "",
      label: "Prep Roadmaps",
      sublabel: "Curated Curricula",
      icon: "📜",
      gradientClass: "from-amber-500/10 to-orange-500/10",
      textGradient: "text-amber-600",
      badgeBg: "bg-amber-100 text-amber-700",
      borderColor: "border-amber-200/80 hover:border-amber-400",
    },
    {
      target: 24,
      suffix: "/7",
      label: "Student Support",
      sublabel: "Continuous Help",
      icon: "⚡",
      gradientClass: "from-pink-500/10 to-rose-500/10",
      textGradient: "text-pink-600",
      badgeBg: "bg-pink-100 text-pink-700",
      borderColor: "border-pink-200/80 hover:border-pink-400",
    },
  ];

  const [counts, setCounts] = useState<number[]>(metrics.map(() => 0));

  useEffect(() => {
    const duration = 1600; // ms
    const steps = 25;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
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
    <section className="py-20 relative overflow-hidden bg-slate-50/80 text-slate-900 border-y border-slate-200/80">
      {/* Soft background ambient gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-xs mb-3">
            <I.Sparkles /> PRACTICAL LEARNING METRICS
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Engineered for <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Practical Technology Mastery</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto">
            From fundamentals to advanced system architectures with structured one-on-one mentorship and live hands-on practice.
          </p>
        </div>

        {/* High-Contrast Vibrant Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-between border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 ${m.borderColor}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-3 ${m.badgeBg}`}
              >
                {m.icon}
              </div>

              <div
                className={`font-display font-black text-2xl sm:text-3xl tracking-tight mb-1 ${m.textGradient}`}
              >
                {counts[idx].toLocaleString()}
                <span>{m.suffix}</span>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 font-bold mb-1 leading-snug">
                {m.label}
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                {m.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

