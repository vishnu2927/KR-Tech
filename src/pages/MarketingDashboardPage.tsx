import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { adminSuiteService, MarketingAnalytics } from "../services/adminSuiteService";

export default function MarketingDashboardPage() {
  const [analytics, setAnalytics] = useState<MarketingAnalytics>({
    executiveSummary: {
      title: "KR Global Learning Q3-2026 Executive Performance & Expansion Briefing",
      generatedAt: new Date().toISOString(),
      highlights: [
        "Annual Recurring Revenue (ARR) reached ₹5.82 Cr milestone with 32% net operating margin.",
        "TCS NQT 2026 Hub drove a 41% surge in Prime and Professional tier cohort enrollments.",
        "Customer Acquisition Cost (CAC) dropped from ₹2,400 to ₹1,850 via organic college tie-ups and high-retention live demo funnels.",
        "Live Class attendance rate hit 91.4% with automated 24-hour and 30-minute WhatsApp + Email reminders.",
        "Customer satisfaction SLA average resolution improved to 3.4 hours with multi-tier ticket escalation.",
      ],
      criticalAlerts: [
        "Microservices Weekend Batch 24B has reached 94% seat capacity; open second section.",
        "Serverless video transcoding queue experienced 4% burst during peak 8 PM weekend class hours.",
      ],
      strategicPriorities: [
        "Scale enterprise B2B corporate cohort programs with TCS, Infosys, and Cognizant.",
        "Roll out AI Mock Interviewer v2 with real-time video sentiment feedback.",
      ],
    },
    kpis: {
      cac: 1850,
      ltv: 28400,
      ltvToCacRatio: 15.35,
      monthlyAdSpend: 245000,
      retentionRate: 92.1,
      courseCompletionRate: 88.4,
      certificationRate: 94.8,
      npsScore: 74,
    },
    conversionFunnel: {
      visitors: 48200,
      leadsGenerated: 3420,
      demosBooked: 1240,
      paidEnrollments: 488,
      conversionRatePercent: 14.3,
      stepConversion: [
        { stage: "Website Visitors", count: 48200, percentage: 100 },
        { stage: "Course Page Inquiries", count: 12400, percentage: 25.7 },
        { stage: "Free Live Demo Booked", count: 3420, percentage: 7.1 },
        { stage: "Attended Live Demo", count: 2180, percentage: 4.5 },
        { stage: "Paid Course Enrolled", count: 488, percentage: 1.01 },
      ],
    },
    channels: [
      { name: "Organic Search / SEO", spend: 45000, leads: 1280, conversions: 198, roi: 780 },
      { name: "College Partnerships & Workshops", spend: 35000, leads: 940, conversions: 145, roi: 890 },
      { name: "Google Ads (High Intent)", spend: 95000, leads: 710, conversions: 92, roi: 340 },
      { name: "Meta & Instagram Reels", spend: 70000, leads: 490, conversions: 53, roi: 210 },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminSuiteService.getGrowthAnalytics();
        if (data && data.analytics) {
          setAnalytics(data.analytics);
        }
      } catch (err: any) {
        console.error("Fetch analytics error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Marketing & Growth Analytics — KR Global Learning Admin Suite"
        description="Conversion funnels, CAC vs LTV unit economics, attribution channels, and CEO executive reports."
      />

      <DashboardSidebar role="admin" activeTab="marketing" onTabChange={() => {}} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-950/70 via-slate-900 to-indigo-950/70 border border-pink-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs font-bold rounded-full border border-pink-500/30">
                  Growth Operations · Unit Economics
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                  LTV/CAC: 15.35x
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Marketing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">Growth Intelligence</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                End-to-end student enrollment marketing performance, acquisition costs, consultation show-up conversion funnels, and executive expansion briefings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-2"
              >
                <span>←</span> Founder Dashboard
              </Link>
              <button
                type="button"
                onClick={() => showToast("Exporting marketing performance deck...")}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2"
              >
                <span>📈</span> Export Pitch Deck
              </button>
            </div>
          </div>
        </div>

        {/* Unit Economics KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Customer Acquisition Cost</p>
            <h4 className="text-2xl font-black text-emerald-400 mt-1">₹{analytics.kpis.cac.toLocaleString("en-IN")}</h4>
            <span className="text-[11px] text-emerald-300 font-semibold">↓ 22% via SEO & Workshops</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Student Lifetime Value (LTV)</p>
            <h4 className="text-2xl font-black text-cyan-400 mt-1">₹{analytics.kpis.ltv.toLocaleString("en-IN")}</h4>
            <span className="text-[11px] text-cyan-300 font-semibold">Multi-course certifications</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Monthly Marketing Budget</p>
            <h4 className="text-2xl font-black text-white mt-1">₹{(analytics.kpis.monthlyAdSpend / 100000).toFixed(2)}L</h4>
            <span className="text-[11px] text-slate-400 font-semibold">Blended across all channels</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Net Promoter Score (NPS)</p>
            <h4 className="text-2xl font-black text-amber-400 mt-1">+{analytics.kpis.npsScore}</h4>
            <span className="text-[11px] text-amber-300 font-semibold">World-class benchmark (&gt;70)</span>
          </div>
        </div>

        {/* CEO Executive Briefing Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div>
                <h3 className="font-black text-white text-lg">{analytics.executiveSummary.title}</h3>
                <p className="text-xs text-slate-400">Automated executive intelligence generated for founders and investors</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold">
              Founder Confidential
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>✓</span> Key Growth Highlights
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analytics.executiveSummary.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0">●</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚠️</span> Operational Watchlist
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analytics.executiveSummary.criticalAlerts.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 shrink-0">●</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🚀</span> Strategic Expansion Directives
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analytics.executiveSummary.strategicPriorities.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 shrink-0">●</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Conversion Funnel Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Full-Funnel Student Acquisition Velocity</h3>
              <p className="text-xs text-slate-400">Step-by-step conversion drop-off analysis from initial visitor to paid enrollment.</p>
            </div>
            <span className="text-xs font-black text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1.5 rounded-xl">
              14.3% Demo-to-Paid Ratio
            </span>
          </div>

          <div className="space-y-3">
            {analytics.conversionFunnel.stepConversion.map((step, idx) => (
              <div key={step.stage} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-purple-300">
                      {idx + 1}
                    </span>
                    {step.stage}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-purple-300">{step.count.toLocaleString()} Users</span>
                    <span className="font-extrabold text-slate-400 text-[11px]">{step.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acquisition Channel Attribution */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-5">
          <h3 className="text-lg font-bold text-white">Channel Attribution & Marketing ROI</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Monthly Spend</th>
                  <th className="py-3 px-4">Leads Generated</th>
                  <th className="py-3 px-4">Paid Conversions</th>
                  <th className="py-3 px-4">Cost per Enrolled</th>
                  <th className="py-3 px-4 text-right">ROI Multiplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analytics.channels.map((ch) => (
                  <tr key={ch.name} className="hover:bg-slate-800/30 transition-all">
                    <td className="py-4 px-4 font-bold text-white">{ch.name}</td>
                    <td className="py-4 px-4 text-slate-300 font-medium">₹{ch.spend.toLocaleString("en-IN")}</td>
                    <td className="py-4 px-4 text-cyan-300 font-bold">{ch.leads.toLocaleString()}</td>
                    <td className="py-4 px-4 text-emerald-400 font-black">{ch.conversions}</td>
                    <td className="py-4 px-4 text-slate-400 font-medium">
                      ₹{Math.round(ch.spend / ch.conversions).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-black text-xs">
                        {ch.roi}% ROI
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
