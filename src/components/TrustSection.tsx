import React from "react";
import { I } from "./Icons";

export default function TrustSection() {
  const trustCards = [
    {
      title: "Expert Mentors",
      desc: "Learn directly from senior architects and engineering leads with deep hands-on production experience.",
      icon: <I.Users />,
      accent: "from-purple-500 to-indigo-500",
      pill: "1-on-1 Guidance",
      pillColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Practical Projects",
      desc: "Build real enterprise microservices, cloud deployments, and scalable platforms with line-by-line pull request code reviews.",
      icon: <I.Code />,
      accent: "from-cyan-500 to-blue-500",
      pill: "Production Stacks",
      pillColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Certification-Oriented Learning",
      desc: "Curricula tailored to industry credentials from AWS, Microsoft Azure, Cisco, and SAP with complete mock exam preparation.",
      icon: <I.Award />,
      accent: "from-emerald-500 to-teal-500",
      pill: "Global Standards",
      pillColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Personalized Learning Roadmap",
      desc: "Step-by-step learning progression calibrated to your experience level, goals, and schedule from beginner to advanced.",
      icon: <I.Sparkles />,
      accent: "from-amber-500 to-orange-500",
      pill: "Custom Syllabus",
      pillColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "AI-Powered Study Assistant",
      desc: "24×7 intelligent companion for instant concept clarification, real-time code debugging, smart notes, and interactive quizzes.",
      icon: <I.Bot />,
      accent: "from-rose-500 to-pink-500",
      pill: "Instant Answers",
      pillColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "24×7 Student Support",
      desc: "Dedicated academic support helpline, active doubt-clearing circles, and round-the-clock student assistance.",
      icon: <I.Headset />,
      accent: "from-teal-500 to-emerald-500",
      pill: "Always Available",
      pillColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    },
  ];

  return (
    <section id="trust-section" className="relative py-20 bg-[#070913] border-t border-purple-500/20 overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Verified Training Excellence
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Poppins'] tracking-tight">
            Why Students Trust <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">KR Global Learning</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Delivering the rigor, real-world practical experience, and continuous technology skill acceleration that learners and working professionals rely on.
          </p>
        </div>

        {/* 6 Modern Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustCards.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 p-6 hover:border-cyan-500/40 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-purple-950/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${item.pillColor}`}>
                    {item.pill}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-['Poppins'] mb-2.5 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Verified Standard
                </span>
                <span className="text-cyan-400 text-[11px] font-semibold flex items-center gap-1">
                  Skill Focused →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
