import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

interface Feature {
  icon: string;
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  bullets: string[];
  gradient: string;
}

export default function LearningFeatures() {
  const features: Feature[] = [
    {
      icon: "🎯",
      badge: "1:1 Live",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      title: "One-on-One Live Training",
      desc: "Learn directly from mentors with 10+ years of enterprise experience. 100% individual focus, live screen shares, and instant feedback.",
      bullets: ["Private 1:1 coding sessions", "Direct line-by-line code review", "Customized pacing for your level"],
      gradient: "from-purple-500/10 to-transparent",
    },
    {
      icon: "🕒",
      badge: "Custom Timings",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
      title: "Flexible Time Zones",
      desc: "Classes are scheduled around your availability. Convenient morning, evening, and weekend slots across US, UK, Gulf, and Indian time zones.",
      bullets: ["Reschedule with 1 click", "Weekend special cohorts", "Global timezone synchronization"],
      gradient: "from-cyan-500/10 to-transparent",
    },
    {
      icon: "📊",
      badge: "Analytics UI",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      title: "Dashboard Access",
      desc: "Get your private student dashboard with weekly learning analytics, upcoming class schedules, live links, and direct mentor chat.",
      bullets: ["Real-time completion tracking", "One-click live classroom join", "Doubt portal with 30m response"],
      gradient: "from-blue-500/10 to-transparent",
    },
    {
      icon: "🎥",
      badge: "Lifetime Access",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      title: "Recorded Lectures",
      desc: "Every live class is recorded in high definition and archived with comprehensive notes and code repositories for lifetime review.",
      bullets: ["HD class video recordings", "Downloadable starter code repos", "Interactive PDF study materials"],
      gradient: "from-amber-500/10 to-transparent",
    },
    {
      icon: "📄",
      badge: "ATS Scored",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      title: "Resume Building",
      desc: "Transform your resume with personalized 1:1 guidance. Optimize project bullet points and certifications to easily pass recruiter ATS filters.",
      bullets: ["ATS score 95+ optimization", "LinkedIn profile enhancement", "Live portfolio GitHub polish"],
      gradient: "from-emerald-500/10 to-transparent",
    },
    {
      icon: "🚀",
      badge: "Production Capstones",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      title: "Project Support",
      desc: "Build full-scale enterprise capstones from design to cloud deployment. Get end-to-end support on college and professional work projects.",
      bullets: ["Microservices & cloud architecture", "Kafka, Docker, & CI/CD deployment", "Live portfolio demonstration ready"],
      gradient: "from-rose-500/10 to-transparent",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white relative overflow-hidden">
      <div className="container-xl relative z-10">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <SectionHeading
            badge="Personalized Learning"
            title="Six Core Pillars of"
            accent="KR Tech Platform"
            desc="Engineered specifically to give you the fastest, most personalized path to technical mastery."
            center={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative flex flex-col justify-between p-7 bg-white rounded-3xl border border-purple-100/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-900/5 hover:border-purple-300 overflow-hidden"
            >
              {/* Subtle top gradient accent */}
              <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${f.gradient} rounded-t-3xl pointer-events-none`} />

              <div className="relative z-10">
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 bg-purple-50/60 rounded-2xl border border-purple-100 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="font-sans font-extrabold text-lg text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  {f.desc}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 mb-6">
                  {f.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>Included in All 1:1 Programs</span>
                <span className="text-purple-500">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
