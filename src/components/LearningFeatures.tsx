import { I } from "./Icons";

interface Feature {
  icon: string;
  badge: string;
  badgeBg: string;
  iconBg: string;
  title: string;
  desc: string;
  bullets: string[];
}

export default function LearningFeatures() {
  const features: Feature[] = [
    {
      icon: "🎯",
      badge: "One-on-One Live",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-50 text-blue-700 border-blue-200",
      title: "One-on-One Live Training",
      desc: "Learn directly from mentors with deep enterprise experience. 100% individual focus, live screen shares, and instant feedback.",
      bullets: ["Private One-on-One coding sessions", "Direct line-by-line code review", "Customized pacing for your level"],
    },
    {
      icon: "🕒",
      badge: "Flexible Timings",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      title: "Global Time Zones",
      desc: "Classes are scheduled around your availability. Convenient morning, evening, and weekend slots across global time zones.",
      bullets: ["Reschedule with 1 click", "Weekend special cohorts", "Global timezone synchronization"],
    },
    {
      icon: "📊",
      badge: "Analytics UI",
      badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      iconBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      title: "Student LMS Dashboard",
      desc: "Get your private student dashboard with weekly learning progress, upcoming class schedules, live links, and direct mentor chat.",
      bullets: ["Real-time completion tracking", "One-click live classroom join", "Doubt portal with fast response"],
    },
    {
      icon: "🎥",
      badge: "Recorded Sessions",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-50 text-blue-700 border-blue-200",
      title: "Archived HD Sessions",
      desc: "Every live class is recorded in high definition and archived with comprehensive notes and code repositories for continuous review.",
      bullets: ["HD class video recordings", "Downloadable starter code repos", "Interactive PDF study materials"],
    },
    {
      icon: "📄",
      badge: "Portfolio Ready",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      title: "Technical Project Portfolio",
      desc: "Showcase your real-world technical capabilities with personalized One-on-One guidance. Document architecture decisions and clean code standards.",
      bullets: ["Production project documentation", "GitHub repository enhancement", "Architecture design reviews"],
    },
    {
      icon: "🚀",
      badge: "Capstone Defense",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      iconBg: "bg-purple-50 text-purple-700 border-purple-200",
      title: "Capstone Project Guidance",
      desc: "Build full-scale practical capstones from design to cloud deployment with hands-on mentor architectural reviews.",
      bullets: ["Microservices & cloud architecture", "Kafka, Docker, & CI/CD deployment", "Technical demonstration ready"],
    },
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden text-slate-900 border-t border-slate-200/80">
      <div className="container-xl relative z-10">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-xs mb-3">
            <I.Sparkles /> THE KR GLOBAL LEARNING DIFFERENCE
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Six Core Pillars of <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Personalized Mastery</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
            Engineered specifically to give you a structured, personalized path to practical technical mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group text-left"
            >
              <div>
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-2xl p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 border ${f.iconBg}`}
                  >
                    {f.icon}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${f.badgeBg}`}
                  >
                    {f.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  {f.desc}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 mb-6">
                  {f.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Included in All One-on-One Programs</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

