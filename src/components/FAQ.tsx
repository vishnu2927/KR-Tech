import { useState } from "react";
import { I } from "./Icons";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      category: "One-on-One Learning",
      q: "How does One-on-One learning work?",
      a: "Unlike crowded batch classes, you get a dedicated expert mentor with deep enterprise experience. Every session is conducted via private One-on-One live screen-sharing where you write production code together, architect systems, and receive immediate real-time feedback.",
    },
    {
      category: "Certifications",
      q: "Do I receive certification preparation?",
      a: "Yes! Our curriculum is aligned with global vendor certifications including AWS, Microsoft Azure, Cisco, SAP, and Salesforce. You receive targeted exam preparation, practical lab exercises, and an official verified Certificate of Completion from KR GLOBAL LEARNING PRIVATE LIMITED.",
    },
    {
      category: "Live Classes",
      q: "Can I attend live classes?",
      a: "Yes, 100% of our core training is delivered through interactive live sessions. You collaborate directly with your mentor in real-time, ask questions, debug errors live, and participate in practical pair-programming exercises.",
    },
    {
      category: "Recorded Lectures",
      q: "Can I access recordings?",
      a: "Yes! Every single live One-on-One class is automatically recorded in HD and archived into your private Student Dashboard. You get lifetime access to rewatch past classes, code walkthroughs, and mentor explanations anytime.",
    },
    {
      category: "Flexible Timings",
      q: "Can I learn at my own pace?",
      a: "Yes! We offer completely flexible scheduling designed around your university or work commitments. You can schedule classes across mornings, evenings, or weekends with easy 1-click session rescheduling.",
    },
    {
      category: "Hands-on Projects",
      q: "How do projects work?",
      a: "You build real-world, production-grade capstone architectures (e.g. Distributed Microservices with Kafka, Cloud VPCs on AWS, Enterprise Full Stack Apps). Mentors conduct line-by-line GitHub pull request reviews to ensure clean architecture and industry best practices.",
    },
    {
      category: "Study Resources",
      q: "Do I receive study resources?",
      a: "Yes! You receive comprehensive lecture notes, architecture blueprints, starter code repositories, AI-generated flashcards, practice quizzes, and 24×7 doubt clearing through our AI Study Assistant and dedicated Student Success Team.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-dark-obsidian relative overflow-hidden text-white border-t border-purple-500/15">
      {/* Background ambient lighting */}
      <div className="orb" style={{ width: 500, height: 500, top: -80, right: -40, background: "rgba(124,58,237,0.2)" }} />
      <div className="orb" style={{ width: 450, height: 450, bottom: -100, left: -40, background: "rgba(6,182,212,0.18)" }} />

      <div className="container-xl relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-3">
              <I.Sparkles /> FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Everything You Need to Know About <span className="gradient-text-warm">KR Global Learning</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-2">
              Clear answers to your questions about One-on-One live classes, scheduling, dashboard features, and mentor support.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((f, i) => (
              <div
                key={i}
                className={`glass-card-dark rounded-2xl overflow-hidden transition-all duration-200 ${
                  open === i
                    ? "border-purple-400/60 shadow-lg shadow-purple-900/20"
                    : "border-white/10 hover:border-white/20"
                }`}
                style={{
                  background: open === i ? "rgba(25, 16, 48, 0.9)" : "rgba(18, 12, 38, 0.75)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full p-5 sm:p-6 flex items-start justify-between gap-4 bg-transparent border-none cursor-pointer text-left"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-1.5">
                      {f.category}
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base text-white leading-snug">
                      {f.q}
                    </h3>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs transition-colors ${
                      open === i ? "bg-cyan-500 text-black font-bold" : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {open === i ? <I.Minus /> : <I.Plus />}
                  </span>
                </button>

                {open === i && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans border-t border-white/10 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
