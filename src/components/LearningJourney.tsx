import { I } from "./Icons";

export default function LearningJourney({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const steps = [
    {
      num: "01",
      phase: "Phase 1",
      title: "Skill Diagnostic & Goal Calibration",
      desc: "Experience our teaching methodology first-hand. Meet with a senior advisor, evaluate current gaps, and establish milestone targets with zero financial commitment.",
      icon: <I.Sparkles />,
      accentBg: "bg-blue-50 text-blue-700 border-blue-200",
      nodeBg: "bg-blue-600 text-white",
    },
    {
      num: "02",
      phase: "Phase 2",
      title: "Dedicated Technical Mentor Pairing",
      desc: "Get matched One-on-One with an experienced technical mentor. They design a customized syllabus aligned with your learning goals and skill level.",
      icon: <I.Users />,
      accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      nodeBg: "bg-indigo-600 text-white",
    },
    {
      num: "03",
      phase: "Phase 3",
      title: "Live One-on-One Guided Coding Sessions",
      desc: "Interactive live screen-sharing scheduled at your flexibility. Write code together, master distributed design patterns, and solve practical architectural problems in real time.",
      icon: <I.Play />,
      accentBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      nodeBg: "bg-cyan-600 text-white",
    },
    {
      num: "04",
      phase: "Phase 4",
      title: "Line-by-Line GitHub PR Code Reviews",
      desc: "Develop production muscle memory. Submit pull requests on GitHub and receive thorough line-by-line code reviews, linting feedback, and performance refactoring from your mentor.",
      icon: <I.Code />,
      accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      nodeBg: "bg-emerald-600 text-white",
    },
    {
      num: "05",
      phase: "Phase 5",
      title: "Hands-on Capstone Projects",
      desc: "Architect scalable distributed systems (Microservices, Kafka Pipelines, AI Agents, Cloud Infra) ready for live deployment and technical demonstration.",
      icon: <I.Award />,
      accentBg: "bg-amber-50 text-amber-700 border-amber-200",
      nodeBg: "bg-amber-600 text-white",
    },
    {
      num: "06",
      phase: "Phase 6",
      title: "Course Completion & Verifiable Credential",
      desc: "Earn an official verified certificate of completion with unique Credential ID and live QR verification upon meeting curriculum criteria.",
      icon: <I.Check />,
      accentBg: "bg-purple-50 text-purple-700 border-purple-200",
      nodeBg: "bg-purple-600 text-white",
    },
  ];

  return (
    <section id="journey" className="py-24 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-xs mb-3">
            <I.Sparkles /> 6-PHASE STRUCTURED ROADMAP
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Your Structured <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Learning Journey</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            From your diagnostic consultation to building robust technical systems with dedicated one-on-one mentorship.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical timeline line */}
          <div
            className="hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-400 via-indigo-400 to-purple-400 rounded-full"
          />

          <div className="space-y-6 sm:space-y-8">
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-4 sm:gap-8 relative group"
              >
                {/* Node icon */}
                <div
                  className={`hidden sm:flex w-16 h-16 rounded-2xl items-center justify-center shrink-0 z-10 text-xl font-bold transition-transform group-hover:scale-110 shadow-md ${s.nodeBg}`}
                >
                  {s.icon}
                </div>

                {/* White Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 flex-1 text-left border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${s.accentBg}`}
                    >
                      {s.phase}
                    </span>
                    <span className="font-display font-black text-xl text-slate-400 group-hover:text-blue-600 transition-colors">
                      {s.num}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <I.Sparkles /> Start Your Learning Journey Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

