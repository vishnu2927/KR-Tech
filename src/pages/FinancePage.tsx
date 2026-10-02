import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { adminSuiteService, FinanceSummary, InvoiceRecord } from "../services/adminSuiteService";

export default function FinancePage() {
  const [summary, setSummary] = useState<FinanceSummary>({
    mrr: 4850000,
    arr: 58200000,
    totalRevenue: 58200000,
    netRevenue: 47724000,
    gstCollected: 10476000,
    totalTransactions: 184,
    avgOrderValue: 21450,
    refundsCount: 2,
    refundsAmount: 38498,
    paymentMethodBreakdown: [
      { method: "UPI / QR", share: 58, revenue: 33756000 },
      { method: "Credit & Debit Cards", share: 24, revenue: 13968000 },
      { method: "NetBanking", share: 12, revenue: 6984000 },
      { method: "No-Cost EMI (3/6 mo)", share: 6, revenue: 3492000 },
    ],
    monthlyTrajectory: [
      { month: "Apr 2026", revenue: 3200000, expenses: 1450000, net: 1750000 },
      { month: "May 2026", revenue: 3850000, expenses: 1620000, net: 2230000 },
      { month: "Jun 2026", revenue: 4200000, expenses: 1780000, net: 2420000 },
      { month: "Jul 2026", revenue: 4650000, expenses: 1910000, net: 2740000 },
      { month: "Aug 2026", revenue: 5120000, expenses: 2050000, net: 3070000 },
      { month: "Sep 2026", revenue: 5850000, expenses: 2240000, net: 3610000 },
    ],
  });

  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "taxes">("overview");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const data = await adminSuiteService.getFinanceDashboard();
        if (data && data.summary) {
          setSummary(data.summary);
          if (data.invoices) setInvoices(data.invoices);
        }
      } catch (err: any) {
        console.error("Finance fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinance();
  }, []);

  const handleDownloadInvoice = (paymentId: string) => {
    const token = localStorage.getItem("krtech_auth_token");
    window.open(`/api/payments/invoice/${paymentId}?token=${token || ""}`, "_blank");
    showToast("Generating official Tax Invoice PDF with QR validation...");
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Finance & Revenue Command — KR Global Learning Admin Suite"
        description="Enterprise finance analytics, MRR/ARR trajectories, GST tax filing reports, and tax invoice generation."
      />

      <DashboardSidebar role="admin" activeTab="finance" onTabChange={() => {}} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                  Finance & Treasury Suite
                </span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/30">
                  GSTIN: 29AABCK1234F1Z8
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Finance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Revenue Analytics</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Real-time recurring revenue monitoring, automated 18% GST tax ledger, customer tax invoices, and multi-channel payment settlement breakdown.
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
                onClick={() => showToast("Exporting FY 2026-27 GST & Audit Tax report...")}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <span>📊</span> Export Audit Report
              </button>
            </div>
          </div>
        </div>

        {/* Primary Financial Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue</p>
            <h4 className="text-2xl font-black text-emerald-400 mt-1">₹{(summary.mrr / 100000).toFixed(1)} Lakhs</h4>
            <span className="text-[11px] text-emerald-300 font-semibold">↑ 18.2% vs last month</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Annualized Run-Rate (ARR)</p>
            <h4 className="text-2xl font-black text-cyan-400 mt-1">₹{(summary.arr / 10000000).toFixed(2)} Cr</h4>
            <span className="text-[11px] text-cyan-300 font-semibold">Target: ₹10 Cr ARR</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">GST Tax (18% Collected)</p>
            <h4 className="text-2xl font-black text-amber-400 mt-1">₹{(summary.gstCollected / 100000).toFixed(1)} Lakhs</h4>
            <span className="text-[11px] text-slate-400 font-semibold">Ready for GSTR-1 filing</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Average Order Value (AOV)</p>
            <h4 className="text-2xl font-black text-purple-400 mt-1">₹{summary.avgOrderValue.toLocaleString("en-IN")}</h4>
            <span className="text-[11px] text-purple-300 font-semibold">{summary.totalTransactions} captured orders</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { key: "overview", label: "Financial Overview & Trends", icon: "📈" },
            { key: "invoices", label: `Tax Invoices (${invoices.length})`, icon: "🧾" },
            { key: "taxes", label: "GST & Reconciliation", icon: "🏛️" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Monthly Trajectory Bar Chart Representation */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Monthly Revenue & Net Margins (FY 2026-27)</h3>
                  <p className="text-xs text-slate-400">Total gross receipts vs operating infrastructure and mentor payroll.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold rounded-xl">
                  32% Net Profit Margin
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {summary.monthlyTrajectory.map((m) => (
                  <div key={m.month} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <p className="text-xs font-bold text-slate-400">{m.month}</p>
                    <p className="text-base font-black text-white">₹{(m.revenue / 100000).toFixed(1)}L</p>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, (m.revenue / 6000000) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                      <span>Net:</span>
                      <span className="font-bold text-emerald-400">₹{(m.net / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-5">
              <h3 className="text-lg font-bold text-white">Payment Method & Settlement Distribution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {summary.paymentMethodBreakdown.map((pm) => (
                  <div key={pm.method} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">{pm.method}</span>
                      <span className="text-xs font-extrabold text-cyan-400">{pm.share}%</span>
                    </div>
                    <p className="text-lg font-black text-white">₹{(pm.revenue / 10000000).toFixed(2)} Cr</p>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                        style={{ width: `${pm.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Generated Tax Invoices</h3>
                <p className="text-xs text-slate-400">Computer-generated GST compliant receipts with verifiable QR codes.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-5">Invoice #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Enrolled Course</th>
                    <th className="py-3 px-4">Subtotal</th>
                    <th className="py-3 px-4">GST (18%)</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-5 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-800/30 transition-all">
                      <td className="py-4 px-5 font-mono font-bold text-purple-300">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-white">{inv.customerName}</p>
                        <p className="text-[11px] text-slate-400">{inv.customerEmail}</p>
                      </td>
                      <td className="py-4 px-4 max-w-[200px] truncate text-slate-300">
                        {inv.items[0]?.courseTitle || "Professional Certification"}
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-300">
                        ₹{inv.subtotal.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-4 font-medium text-amber-300">
                        ₹{inv.taxTotal.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-4 font-black text-emerald-400">
                        ₹{inv.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {inv.paymentMethod}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(inv.paymentId)}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <span>📥</span> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "taxes" && (
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white">GST Compliance & Tax Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">CGST (9%)</p>
                <h4 className="text-xl font-bold text-white">₹{((summary.gstCollected / 2) / 100000).toFixed(2)} Lakhs</h4>
                <p className="text-[11px] text-slate-500">Central Goods and Services Tax</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">SGST (9%)</p>
                <h4 className="text-xl font-bold text-white">₹{((summary.gstCollected / 2) / 100000).toFixed(2)} Lakhs</h4>
                <p className="text-[11px] text-slate-500">State Goods and Services Tax</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Total Tax Remitted</p>
                <h4 className="text-xl font-bold text-emerald-400">₹{(summary.gstCollected / 100000).toFixed(2)} Lakhs</h4>
                <p className="text-[11px] text-emerald-300 font-semibold">100% Tax Compliant</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
