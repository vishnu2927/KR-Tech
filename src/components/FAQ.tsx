import { useState } from "react";
import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      category: "Live Classes",
      q: "How does One-on-One Live Training work in KR Tech?",
      a: "Unlike crowded batch classes, you get a dedicated senior mentor with 10+ years of industry experience. Every session is conducted via private 1:1 live screen-sharing where you write production code together, architect systems, and receive immediate real-time feedback.",
    },
    {
      category: "Flexible Timings",
      q: "How flexible are the class schedules and time zones?",
      a: "Completely flexible! You choose your preferred time slot (morning, evening, or weekends) based on your work or university schedule. We cater to global students across IST, US (EST/PST), UK (GMT), and Gulf (GST) time zones, with easy 1-click session rescheduling.",
    },
    {
      category: "Dashboard Access",
      q: "What features are included in the Student Dashboard?",
      a: "Your private Student Dashboard provides real-time weekly progress metrics, 1-click access to today's live classroom, direct 1:1 mentor doubt-clearing portal, assignment submission pipelines, and downloadable high-speed study notes.",
    },
    {
      category: "Recorded Lectures",
      q: "Are session recordings included for lifetime review?",
      a: "Yes! Every single live 1:1 class is automatically recorded in HD and archived into your dashboard within 1 hour of session completion. You get lifetime access to rewatch past classes, code walkthroughs, and mentor explanations anytime.",
    },
    {
      category: "Certificates",
      q: "Are KR Tech certificates verifiable by employers and LinkedIn?",
      a: "Yes. Every student who completes their curriculum milestones and capstone defense receives an official KR Tech Certificate of Excellence containing a unique cryptographic verification ID that recruiters can verify online.",
    },
    {
      category: "Project Support",
      q: "What kind of project and resume support do you offer?",
      a: "You build full-scale real-world capstone projects (e.g. Distributed Microservices with Kafka, Cloud VPCs on AWS, Enterprise SAP workflows). Your mentor conducts thorough ATS resume reviews and optimizes your GitHub portfolio for tech recruitment.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-purple-50/40 via-white to-gray-50/50">
      <div className="container-xl">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <SectionHeading
              badge="Frequently Asked Questions"
              title="Everything You Need to Know About"
              accent="KR Tech Platform"
              desc="Clear answers to your questions about 1:1 live classes, scheduling, dashboard features, and mentor support."
              center={true}
            />
          </div>

          <div className="space-y-3.5">
            {faqs.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden transition-all duration-200 border ${
                  open === i
                    ? "bg-white border-purple-300 shadow-md shadow-purple-900/5"
                    : "bg-white/80 hover:bg-white border-gray-200/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full p-5 sm:p-6 flex items-start justify-between gap-4 bg-transparent border-none cursor-pointer text-left"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100 mb-1.5">
                      {f.category}
                    </span>
                    <h3 className="font-sans font-bold text-sm sm:text-base text-gray-900 leading-snug">
                      {f.q}
                    </h3>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs transition-colors ${
                      open === i ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {open === i ? <I.Minus /> : <I.Plus />}
                  </span>
                </button>

                {open === i && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed font-sans border-t border-gray-50 pt-3">
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
