import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { paymentService, PaymentRecord } from "../services/paymentService";
import { I } from "../components/Icons";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await paymentService.getMyPayments();
        if (isMounted && data) {
          setPayments(data);
        }
      } catch (err) {
        console.warn("Using fallback orders data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.courseTitle?.toLowerCase().includes(q) ||
      p.paymentId?.toLowerCase().includes(q) ||
      p.orderId?.toLowerCase().includes(q)
    );
  });

  const totalAmount = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 md:px-8 selection:bg-purple-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link to="/dashboard" className="hover:text-purple-400 transition no-underline">
                Student Dashboard
              </Link>
              <span>/</span>
              <span className="text-purple-400 font-semibold">Orders & Invoices</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>💳</span>
              <span>My Orders & Invoices</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Official Razorpay transaction receipts, tax invoices, and course enrollment confirmations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all no-underline"
            >
              + Explore More Tracks
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition no-underline"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Orders
            </span>
            <div className="text-2xl md:text-3xl font-black text-white font-mono">
              {payments.length}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
              ✓ All Transactions Verified
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Invested
            </span>
            <div className="text-2xl md:text-3xl font-black text-white font-mono bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ₹{totalAmount.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-purple-400 font-semibold mt-1 block">
              Razorpay Secured Gateway
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Enrollments
            </span>
            <div className="text-2xl md:text-3xl font-black text-white font-mono">
              {payments.length}
            </div>
            <span className="text-[11px] text-cyan-400 font-semibold mt-1 block">
              One-on-One Mentored Cohorts
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-white">Order History ({filteredPayments.length})</h3>
            <input
              type="text"
              placeholder="Search by course name, payment ID or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Orders Table */}
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Course Track</th>
                    <th className="pb-3 font-semibold">Payment / Order ID</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPayments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-white text-sm max-w-[260px] truncate">
                          {p.courseTitle}
                        </div>
                        <span className="text-[10px] text-purple-400 font-mono">
                          Track ID: {p.courseId}
                        </span>
                      </td>

                      <td className="py-4 font-mono text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <span>Pay: {p.paymentId}</span>
                          <button
                            onClick={() => copyToClipboard(p.paymentId, p.paymentId)}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                          >
                            {copiedId === p.paymentId ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <div className="text-slate-500 text-[10px]">
                          Order: {p.orderId}
                        </div>
                      </td>

                      <td className="py-4 font-mono font-bold text-white text-sm">
                        ₹{(p.amount || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="py-4 text-slate-400 text-[11px] font-mono">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "Recent"}
                      </td>

                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
                          ✓ {p.status ? p.status.toUpperCase() : "CAPTURED"}
                        </span>
                      </td>

                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                        >
                          Invoice 🧾
                        </button>
                        <Link
                          to={p.courseId ? `/courses/${p.courseId}` : "/courses"}
                          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold rounded-xl border border-purple-500/30 transition no-underline inline-block"
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
              <span className="text-3xl block">💳</span>
              <p className="text-sm">No payment records found.</p>
              <Link
                to="/courses"
                className="inline-block px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl no-underline"
              >
                Browse Available Courses
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Tax Invoice & Receipt
                </span>
                <h3 className="text-lg font-bold text-white">KR Global Learning Official Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Course:</span>
                <span className="font-bold text-white text-right max-w-[200px] truncate">
                  {selectedReceipt.courseTitle}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Payment ID:</span>
                <span className="text-cyan-300">{selectedReceipt.paymentId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                <span className="text-slate-400">Order ID:</span>
                <span className="text-slate-300">{selectedReceipt.orderId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Student:</span>
                <span className="text-slate-200">{selectedReceipt.userEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">Captured / Verified</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-800 text-sm font-bold">
                <span className="text-white">Total Paid:</span>
                <span className="text-emerald-400 font-mono">
                  ₹{(selectedReceipt.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                🖨️ Print
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
