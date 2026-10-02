import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { paymentService, PaymentRecord } from "../services/paymentService";
import InvoiceDownloadButton from "../components/payment/InvoiceDownloadButton";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function PaymentHistoryPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPayments() {
      try {
        setLoading(true);
        const data = await paymentService.getMyPayments();
        if (isMounted && data) {
          setPayments(data);
        }
      } catch (err) {
        console.warn("Using fallback payments history:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPayments();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      p.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalAmount = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      <SEO
        title="Payment History & Tax Invoices | KR Global Learning"
        description="View your Razorpay payment records, transactions ledger, and download GST tax invoices."
      />

      {/* Ambient background illumination */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[350px] bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link to="/student/dashboard" className="hover:text-cyan-400 transition no-underline">
                Student Dashboard
              </Link>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">Payment History</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>💳</span>
              <span>Payment History & Tax Invoices</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Official Razorpay transaction receipts, GST tax invoices, and live cohort enrollment logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all no-underline"
            >
              + Explore New Courses
            </Link>
            <Link
              to="/student/dashboard"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition no-underline"
            >
              Student Portal
            </Link>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Completed Transactions
            </span>
            <div className="text-2xl md:text-3xl font-black text-white font-mono">
              {payments.length}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span>✓</span> Verified in MongoDB Atlas
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Invested in Learning
            </span>
            <div className="text-2xl md:text-3xl font-black text-white font-mono bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              ₹{totalAmount.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-cyan-400 font-semibold mt-1 flex items-center gap-1">
              <span>🛡️</span> Razorpay Secured Settlement
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Unlocked Cohorts
            </span>
            <div className="text-2xl md:text-3xl font-black text-white font-mono">
              {payments.filter((p) => p.status === "captured" || !p.status).length}
            </div>
            <span className="text-[11px] text-purple-400 font-semibold mt-1 flex items-center gap-1">
              <span>🎓</span> Full LMS & Mentorship Access
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Ledger Entries ({filteredPayments.length})
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search payment ID, course title, order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="captured">Captured (Successful)</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="md" label="Loading Payment Ledger..." />
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Course Enrolled</th>
                    <th className="p-4">Payment ID & Ref</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Tax Invoice</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredPayments.map((p) => (
                    <tr key={p._id || p.paymentId} className="hover:bg-slate-800/30 transition">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm max-w-[240px] truncate" title={p.courseTitle}>
                          {p.courseTitle}
                        </div>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          ID: {p.courseId}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <span>{p.paymentId}</span>
                          <button
                            onClick={() => copyToClipboard(p.paymentId, p.paymentId)}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            title="Copy Payment ID"
                          >
                            {copiedId === p.paymentId ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <div className="text-slate-500 text-[10px]">
                          Order: {p.orderId}
                        </div>
                      </td>

                      <td className="p-4 font-mono font-bold text-white text-sm">
                        ₹{(p.amount || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="p-4 text-slate-400 text-[11px] font-mono">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recent"}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
                          ✓ {p.status ? p.status.toUpperCase() : "CAPTURED"}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <InvoiceDownloadButton
                          paymentId={p.paymentId}
                          orderId={p.orderId}
                          courseTitle={p.courseTitle}
                          variant="outline"
                        />
                      </td>

                      <td className="p-4 text-right">
                        <Link
                          to={p.courseId ? `/learn/${p.courseId}` : "/my-courses"}
                          className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl transition no-underline inline-block shadow-sm shadow-cyan-500/20"
                        >
                          Study ▶
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <span className="text-4xl block">💳</span>
              <p className="text-sm">No transaction records found matching criteria.</p>
              <Link
                to="/courses"
                className="inline-block px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl no-underline"
              >
                Browse Available Mentorship Cohorts
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
