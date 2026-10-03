import React, { useState } from "react";
import { Link } from "react-router-dom";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "one-on-one",
    category: "Learning Methodology",
    question: "How One-on-One learning works?",
    answer:
      "Unlike generic recorded courses with hundreds of students, KR Global Learning delivers 100% interactive One-on-One live sessions. You pair-program directly with senior engineers and architects from Tier-1 MNCs using video screen sharing, live IDE code collaboration, and real-time review. Your mentor tailors every lesson to your pace, learning objectives, and project goals.",
  },
  {
    id: "certificates",
    category: "Certifications",
    question: "Do I receive certification preparation?",
    answer:
      "Yes! Upon successfully completing your capstone projects, coding assessments, and final architecture evaluations, you receive an official verified Certificate of Accomplishment from KR GLOBAL LEARNING PRIVATE LIMITED. Every certificate contains a unique Credential ID and live QR code verifiable on our public verification portal (krgloballearning.com/certificates). Our curriculum is also mapped directly to industry vendor exams including AWS, Microsoft Azure, Cisco, and SAP.",
  },
  {
    id: "live-classes",
    category: "Live Classes",
    question: "Can I attend live classes?",
    answer:
      "Yes! All of our core programs are delivered live. You join your dedicated mentor in real-time, ask questions instantly, solve bugs collaboratively, and write production-grade code together in hands-on pair-programming sessions.",
  },
  {
    id: "recordings",
    category: "Recordings",
    question: "Can I access recordings?",
    answer:
      "Yes. Every live session is automatically recorded in HD and archived into your private Student Dashboard. You receive lifetime access to rewatch classes, review code solutions, and download mentor session notes whenever you want.",
  },
  {
    id: "pace",
    category: "Flexibility",
    question: "Can I learn at my own pace?",
    answer:
      "Absolutely. Our One-on-One model is built for your convenience. You can pick morning, evening, or weekend slots across global time zones and adjust your learning frequency or reschedule sessions with 1-click flexibility.",
  },
  {
    id: "projects",
    category: "Projects",
    question: "How do projects work?",
    answer:
      "You build real-world, enterprise-level capstone projects from the ground up — such as distributed microservices with Kafka, cloud-native deployments on AWS/Kubernetes, and full-stack SaaS apps. Mentors conduct thorough line-by-line GitHub pull request reviews to ensure clean architecture and production best practices.",
  },
  {
    id: "resources",
    category: "Study Resources",
    question: "Do I receive study resources?",
    answer:
      "Yes! You receive comprehensive lecture notes, architecture blueprints, starter code repositories, AI-generated flashcards, practice quizzes, and 24×7 doubt clearing through our AI Study Assistant and dedicated Student Success Team.",
  },
  {
    id: "payments",
    category: "Billing",
    question: "What payment methods are accepted?",
    answer:
      "We accept all major secure payment methods via 256-bit SSL encrypted Razorpay gateway, including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ Indian banks, and flexible zero-cost EMI options. Instant GST tax invoices are automatically delivered to your registered email address.",
  },
  {
    id: "support",
    category: "Support",
    question: "How do I contact support?",
    answer:
      "Our Student Support Desk is active 24×7. You can reach our helpline directly by calling or WhatsApping +91 9311073936, emailing krglobal0713@gmail.com, or submitting a ticket from your Student Dashboard.",
  },
];

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<string[]>(["one-on-one", "certificates"]);
  const [search, setSearch] = useState("");

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SEO
      title="Frequently Asked Questions (FAQ) — KR GLOBAL LEARNING PRIVATE LIMITED"
      description="Find answers to all questions about enrollment, One-on-One live classes, certificates, fees, and 24x7 helpdesk at KR GLOBAL LEARNING PRIVATE LIMITED."
      canonical="https://krgloballearning.com/faq"
    >
      <main className="min-h-screen bg-slate-50 text-slate-900 pt-[90px] relative overflow-hidden">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* HERO SECTION */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-semibold mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Everything You Need to Know
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 font-['Poppins']">
            Frequently Asked <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Got questions about our One-on-One live training, certifications, mentors, or support? Find quick answers below or speak to our 24×7 helpdesk.
          </p>

          {/* Quick Search */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions by keyword (e.g. enroll, One-on-One, certificate, projects)..."
              className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 shadow-sm transition"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <I.Search />
            </div>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* ACCORDION SECTION */}
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-300 border bg-white ${
                    isOpen
                      ? "border-blue-300 shadow-md ring-1 ring-blue-100"
                      : "border-slate-200/90 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Poppins']">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-blue-600 bg-blue-50" : "text-slate-400 bg-slate-100"
                      }`}
                    >
                      <I.ChevronDown />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">No FAQs matched "{search}".</p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition cursor-pointer shadow-sm"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>

          {/* Still Have Questions Card */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-blue-400/30 p-8 text-center text-white shadow-xl shadow-blue-500/15">
            <h3 className="text-xl font-bold text-white font-['Poppins'] mb-2">
              Still have questions or need personalized guidance?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto mb-6">
              Our academic advisors are available 24×7 to walk you through our course syllabus, schedule a free mentor demo, or help you choose the right career path.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/919311073936?text=Hi%20KR%20Global%20Learning,%20I%20have%20questions%20regarding%20courses."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 no-underline transition"
              >
                <I.MessageCircle /> Chat on WhatsApp (+91 9311073936)
              </a>
              <Link
                to="/contact"
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs shadow-md transition no-underline"
              >
                Contact Helpdesk
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SEO>
  );
}
