import React from "react";
import { I } from "./Icons";

export default function TrustSection() {
  const trustCards = [
    {
      title: "Experienced Mentors",
      desc: "Learn directly from senior engineers and architects with deep hands-on production experience.",
      icon: <I.Users />,
      pill: "One-on-One Guidance",
      pillColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
      iconBg: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Practical Projects",
      desc: "Build real enterprise microservices, cloud deployments, and scalable platforms with line-by-line pull request code reviews.",
      icon: <I.Code />,
      pill: "Production Stacks",
      pillColor: "text-blue-700 bg-blue-50 border-blue-200",
      iconBg: "bg-blue-50 text-blue-700",
    },
    {
      title: "Certification Preparation",
      desc: "Curricula tailored to industry credentials from AWS, Microsoft Azure, Cisco, and SAP with complete mock exam preparation.",
      icon: <I.Award />,
      pill: "Global Standards",
      pillColor: "text-purple-700 bg-purple-50 border-purple-200",
      iconBg: "bg-purple-50 text-purple-700",
    },
    {
      title: "Personalized Roadmap",
      desc: "Step-by-step learning progression calibrated to your experience level, goals, and schedule from beginner to advanced.",
      icon: <I.Sparkles />,
      pill: "Custom Syllabus",
      pillColor: "text-cyan-700 bg-cyan-50 border-cyan-200",
      iconBg: "bg-cyan-50 text-cyan-700",
    },
    {
      title: "Interactive Study Materials",
      desc: "Instant concept clarification, real-time code reviews, smart architecture notes, and hands-on practice quizzes.",
      icon: <I.Bot />,
      pill: "Learning Tools",
      pillColor: "text-rose-700 bg-rose-50 border-rose-200",
      iconBg: "bg-rose-50 text-rose-700",
    },
    {
      title: "24×7 Student Support",
      desc: "Dedicated academic support helpline, active doubt-clearing circles, and round-the-clock student assistance.",
      icon: <I.Headset />,
      pill: "Always Available",
      pillColor: "text-teal-700 bg-teal-50 border-teal-200",
      iconBg: "bg-teal-50 text-teal-700",
    },
  ];

  return (
    <section id="trust-section" className="relative py-20 bg-slate-50 border-t border-slate-200/80 overflow-hidden text-slate-900">
      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Training Excellence
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Why Students Trust <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">KR Global Learning</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Delivering the rigor, real-world practical experience, and continuous technology skill acceleration that learners and working professionals rely on.
          </p>
        </div>

        {/* 6 Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustCards.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-white border border-slate-200 p-6 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform duration-300 ${item.iconBg}`}
                  >
                    {item.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.pillColor}`}>
                    {item.pill}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors font-sans">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Standard
                </span>
                <span className="text-blue-600 text-[11px] font-bold flex items-center gap-1">
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

