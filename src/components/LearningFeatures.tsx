import { I } from "./Icons";

interface Feature {
  icon: string;
  badge: string;
  badgeAccent: string;
  title: string;
  desc: string;
  bullets: string[];
}

export default function LearningFeatures() {
  const features: Feature[] = [
    {
      icon: "🎯",
      badge: "One-on-One Live",
      badgeAccent: "#06B6D4",
      title: "One-on-One Live Training",
      desc: "Learn directly from mentors with deep enterprise experience. 100% individual focus, live screen shares, and instant feedback.",
      bullets: ["Private One-on-One coding sessions", "Direct line-by-line code review", "Customized pacing for your level"],
    },
    {
      icon: "🕒",
      badge: "Flexible Timings",
      badgeAccent: "#A78BFA",
      title: "Global Time Zones",
      desc: "Classes are scheduled around your availability. Convenient morning, evening, and weekend slots across US, UK, Gulf, and Indian time zones.",
      bullets: ["Reschedule with 1 click", "Weekend special cohorts", "Global timezone synchronization"],
    },
    {
      icon: "📊",
      badge: "Analytics UI",
      badgeAccent: "#38BDF8",
      title: "Student LMS Dashboard",
      desc: "Get your private student dashboard with weekly learning analytics, upcoming class schedules, live links, and direct mentor chat.",
      bullets: ["Real-time completion tracking", "One-click live classroom join", "Doubt portal with 30m response"],
    },
    {
      icon: "🎥",
      badge: "Lifetime Access",
      badgeAccent: "#F59E0B",
      title: "Recorded HD Sessions",
      desc: "Every live class is recorded in high definition and archived with comprehensive notes and code repositories for lifetime review.",
      bullets: ["HD class video recordings", "Downloadable starter code repos", "Interactive PDF study materials"],
    },
    {
      icon: "📄",
      badge: "Portfolio Ready",
      badgeAccent: "#10B981",
      title: "Technical Project Portfolio",
      desc: "Showcase your real-world technical capabilities with personalized One-on-One guidance. Document architecture decisions, clean code standards, and vendor certifications.",
      bullets: ["Production project documentation", "GitHub repository enhancement", "Architecture design reviews"],
    },
    {
      icon: "🚀",
      badge: "Enterprise Defense",
      badgeAccent: "#EC4899",
      title: "Capstone Project Support",
      desc: "Build full-scale enterprise capstones from design to cloud deployment. Get end-to-end support on college and professional work projects.",
      bullets: ["Microservices & cloud architecture", "Kafka, Docker, & CI/CD deployment", "Live portfolio demonstration ready"],
    },
  ];

  return (
    <section id="features" className="py-24 bg-dark-obsidian relative overflow-hidden text-white border-t border-purple-500/15">
      {/* Background radial glows */}
      <div className="orb" style={{ width: 500, height: 500, top: -80, right: -40, background: "rgba(124,58,237,0.2)" }} />
      <div className="orb" style={{ width: 450, height: 450, bottom: -100, left: -60, background: "rgba(6,182,212,0.18)" }} />

      <div className="container-xl relative z-10">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-3">
            <I.Sparkles /> THE KR GLOBAL LEARNING DIFFERENCE
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Six Core Pillars of <span className="gradient-text-warm">Personalized Mastery</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-xl mx-auto">
            Engineered specifically to give you the fastest, most personalized path to technical mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card-dark p-7 flex flex-col justify-between group hover:border-purple-400/50 text-left"
              style={{
                background: "rgba(18, 12, 38, 0.8)",
                border: "1px solid rgba(167, 139, 250, 0.2)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
              }}
            >
              <div>
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-2xl p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${f.badgeAccent}18`,
                      border: `1px solid ${f.badgeAccent}40`,
                    }}
                  >
                    {f.icon}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: f.badgeAccent,
                      border: `1px solid ${f.badgeAccent}40`,
                    }}
                  >
                    {f.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-5">
                  {f.desc}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 mb-6">
                  {f.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-cyan-400">
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
