import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../components/common/SEO";

type PolicyType = "privacy" | "terms" | "refund" | "cancellation" | "cookies" | "community" | "disclaimer";

interface LegalPageProps {
  initialTab?: PolicyType;
}

export default function LegalPage({ initialTab = "privacy" }: LegalPageProps) {
  const location = useLocation();

  // Determine active tab based on pathname or query
  const getTabFromPath = (): PolicyType => {
    const path = location.pathname.toLowerCase();
    if (path.includes("terms")) return "terms";
    if (path.includes("cancellation")) return "cancellation";
    if (path.includes("refund")) return "refund";
    if (path.includes("cookie")) return "cookies";
    if (path.includes("community")) return "community";
    if (path.includes("disclaimer")) return "disclaimer";
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<PolicyType>(getTabFromPath());

  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const tabs: { id: PolicyType; label: string; to: string }[] = [
    { id: "privacy", label: "Privacy Policy", to: "/privacy" },
    { id: "terms", label: "Terms & Conditions", to: "/terms" },
    { id: "refund", label: "Refund Policy", to: "/refund" },
    { id: "cancellation", label: "Cancellation Policy", to: "/cancellation" },
    { id: "cookies", label: "Cookie Policy", to: "/cookies" },
    { id: "community", label: "Community Guidelines", to: "/community-guidelines" },
    { id: "disclaimer", label: "Legal Disclaimer", to: "/disclaimer" },
  ];

  return (
    <SEO
      title={`${tabs.find((t) => t.id === activeTab)?.label} — KR GLOBAL LEARNING PRIVATE LIMITED`}
      description={`Official legal compliance and terms for KR GLOBAL LEARNING PRIVATE LIMITED. Corporate office: Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318.`}
      canonical={`https://krgloballearning.com/${activeTab}`}
    >
      <main className="min-h-screen bg-[#070913] text-slate-100 pt-[90px] relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-96 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* HERO HEADER */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4 backdrop-blur-md">
            🛡️ Enterprise Compliance & Legal Policy Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Poppins'] tracking-tight mb-3">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last updated: September 2026 &bull; Published by KR GLOBAL LEARNING PRIVATE LIMITED &bull; CIN: U80902DL2024PTC428190
          </p>
        </section>

        {/* POLICY TABS NAVIGATION */}
        <div className="sticky top-[70px] z-20 bg-[#070913]/90 backdrop-blur-md border-y border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none flex gap-2 py-3">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT SECTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed font-['Inter']">
            {/* 1. PRIVACY POLICY */}
            {activeTab === "privacy" && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    1. Information We Collect
                  </h2>
                  <p>
                    KR GLOBAL LEARNING PRIVATE LIMITED collects personal data necessary to provide personalized One-on-One live tech training, monitor academic milestones, issue credentials, and process payments. Information collected includes:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                    <li>Contact details: Name, verified email address, phone number, and city/country.</li>
                    <li>Academic information: Enrolled programs, assignment submissions, code evaluations, quiz scores, and certificate records.</li>
                    <li>Technical telemetry: Browser user-agent, device IP address, session timestamps, and encrypted JWT tokens.</li>
                    <li>Financial transactions: Razorpay transaction identifiers, payment amounts, and GST billing invoices. We never store raw debit/credit card numbers or UPI MPINs.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    2. Data Security & Storage
                  </h2>
                  <p>
                    All communications are encrypted using Transport Layer Security (TLS 1.3). Student passwords are cryptographically hashed using Salted Bcrypt, and tokens are stored in hardware-backed Secure Storage on mobile clients.
                  </p>
                </div>
              </>
            )}

            {/* 2. TERMS & CONDITIONS */}
            {activeTab === "terms" && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    1. Agreement to Terms
                  </h2>
                  <p>
                    By accessing the portal, website, or mobile application of KR GLOBAL LEARNING PRIVATE LIMITED, you agree to be bound by these Terms and Conditions and our Academic Integrity Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    2. Intellectual Property Rights
                  </h2>
                  <p>
                    All course curriculum, proprietary lecture notes, video recordings, coding assignments, and examination questions are the intellectual property of KR GLOBAL LEARNING PRIVATE LIMITED. Unauthorized redistribution or screen recording is strictly prohibited.
                  </p>
                </div>
              </>
            )}

            {/* 3. REFUND POLICY */}
            {activeTab === "refund" && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    1. 7-Day Money-Back Guarantee
                  </h2>
                  <p>
                    We stand behind our One-on-One mentorship excellence. If within 7 calendar days of enrollment (and prior to completing more than 2 live lecture sessions) you are not fully satisfied, you may submit a refund request.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    2. Refund Processing Timeframe
                  </h2>
                  <p>
                    Once approved by the academic finance board, refunds are initiated within 3-5 business days directly back to the original source via Razorpay payment gateway.
                  </p>
                </div>
              </>
            )}

            {/* 4. CANCELLATION POLICY */}
            {activeTab === "cancellation" && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    1. Course Enrollment Cancellation
                  </h2>
                  <p>
                    Students may request enrollment cancellation by notifying our 24×7 academic support desk at <strong>krglobal0713@gmail.com</strong> or calling <strong>+91 9311073936</strong>.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    2. Batch Rescheduling & Pause Policy
                  </h2>
                  <p>
                    Working professionals and college scholars facing exam clashes or project deadlines may request up to two (2) batch freezes per calendar year, preserving all accumulated progress and credits.
                  </p>
                </div>
              </>
            )}

            {/* 5. COOKIE POLICY */}
            {activeTab === "cookies" && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    1. Essential & Analytics Cookies
                  </h2>
                  <p>
                    We utilize essential session cookies to authenticate your student login and anonymized Google Analytics 4 cookies to measure platform latency and guarantee 99.9% uptime.
                  </p>
                </div>
              </>
            )}

            {/* 6. COMMUNITY GUIDELINES */}
            {activeTab === "community" && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    1. Peer Respect & Professional Conduct
                  </h2>
                  <p>
                    KR GLOBAL LEARNING PRIVATE LIMITED maintains a zero-tolerance policy for harassment, discrimination, or hate speech in live classrooms, community discussion boards, and study groups.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    2. Academic Integrity
                  </h2>
                  <p>
                    Assignments and capstone projects submitted for verified certification must represent your authentic work. Plagiarized submissions will void certificate eligibility.
                  </p>
                </div>
              </>
            )}

            {/* 7. DISCLAIMER */}
            {activeTab === "disclaimer" && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Poppins'] mb-3">
                    1. Third-Party Trademarks
                  </h2>
                  <p>
                    AWS, Amazon, Microsoft, Azure, Google, Cisco, Salesforce, and SAP are registered trademarks of their respective corporations. KR GLOBAL LEARNING PRIVATE LIMITED uses these names strictly for curriculum identification, vendor-exam alignment, and educational descriptions.
                  </p>
                </div>
              </>
            )}

            {/* CORPORATE LEGAL MANDATE */}
            <div className="pt-8 border-t border-slate-800 bg-slate-950/60 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white font-['Poppins'] mb-2">
                Official Corporate Entity & Grievance Redressal
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                <strong>KR GLOBAL LEARNING PRIVATE LIMITED</strong><br />
                Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West,<br />
                Uttar Pradesh – 201318, India.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <div>
                  <strong>Official Email: </strong>
                  <a href="mailto:krglobal0713@gmail.com" className="text-amber-400 hover:underline">
                    krglobal0713@gmail.com
                  </a>
                </div>
                <div>
                  <strong>Customer & Student Support (24×7): </strong>
                  <a href="tel:+919311073936" className="text-cyan-400 hover:underline font-mono">
                    +91 9311073936
                  </a>
                </div>
                <div className="text-[11px] text-slate-500 pt-2 font-mono">
                  CIN: U80902DL2024PTC428190 | GSTIN: 07AAECK9821M1Z5
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SEO>
  );
}
