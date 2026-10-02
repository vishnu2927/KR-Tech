import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { I } from "../components/Icons";
import InvoiceDownloadButton from "../components/payment/InvoiceDownloadButton";
import SEO from "../components/common/SEO";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract payment details passed via navigation state or fallback
  const state = location.state || {};
  const paymentId = state.paymentId || "pay_test_" + Date.now().toString().slice(-8);
  const orderId = state.orderId || "order_test_" + Date.now().toString().slice(-8);
  const courseTitle = state.courseTitle || "KR Global Learning Mentorship Program";
  const courseId = state.courseId || "course-java-backend";
  const amount = state.amount || 10399;
  const studentName = state.userName || localStorage.getItem("krtech_user_name") || "KR Global Learning Student";
  const studentEmail = state.userEmail || localStorage.getItem("krtech_user_email") || "student@krgloballearning.com";
  const transactionDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyPaymentId = () => {
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-28 pb-20 px-4 relative overflow-hidden">
      <SEO
        title="Payment Successful | KR Global Learning"
        description="Your enrollment has been successfully recorded in MongoDB Atlas. Welcome aboard!"
      />

      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto">
        {/* Success Header Card */}
        <div className="relative backdrop-blur-xl bg-gradient-to-b from-[#111827]/90 to-[#0B0F19]/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center mb-8">
          {/* Animated Success Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse text-3xl">
            ✓
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <I.Sparkles />
            Payment Verified & Enrolled
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            Congratulations! You have been successfully enrolled in{" "}
            <span className="text-cyan-300 font-semibold">{courseTitle}</span>. Your seat is confirmed in MongoDB Atlas.
          </p>

          {/* Amount Paid Pill */}
          <div className="mt-6 inline-block py-3 px-6 rounded-2xl bg-[#090D16] border border-white/10">
            <span className="text-xs uppercase text-gray-400 tracking-wider block">Total Amount Paid</span>
            <span className="text-3xl font-black text-white bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-mono">
              ₹{typeof amount === "number" ? amount.toLocaleString("en-IN") : amount}
            </span>
          </div>
        </div>

        {/* Transaction Summary Card */}
        <div className="backdrop-blur-xl bg-[#0B0F19]/80 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-cyan-400">🛡️</span>
              Official Razorpay Transaction Receipt
            </h3>
            <span className="text-xs text-emerald-400 font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Captured
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-2">
                <span>💳</span> Payment ID
              </span>
              <div className="flex items-center gap-2 font-mono text-cyan-300 text-xs sm:text-sm">
                <span>{paymentId}</span>
                <button
                  onClick={handleCopyPaymentId}
                  className="px-2 py-0.5 text-[11px] rounded bg-white/10 hover:bg-white/20 text-gray-300 transition cursor-pointer"
                  title="Copy Payment ID"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-2">
                <span>⚡</span> Order ID
              </span>
              <span className="font-mono text-gray-300 text-xs sm:text-sm">{orderId}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-2">
                <span>📚</span> Course Enrolled
              </span>
              <span className="font-semibold text-white text-right max-w-[240px] truncate">{courseTitle}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-2">
                <span>👤</span> Student
              </span>
              <span className="text-gray-200">{studentName} ({studentEmail})</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-2">
                <I.Calendar /> Transaction Date
              </span>
              <span className="text-gray-300">{transactionDate}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Payment Gateway</span>
              <span className="text-gray-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                Razorpay Automated Settlement
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <span>GST Tax Invoice & LMS credentials dispatched to email.</span>
            <InvoiceDownloadButton
              paymentId={paymentId}
              orderId={orderId}
              courseTitle={courseTitle}
              variant="outline"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            to={courseId ? `/learn/${courseId}` : "/my-courses"}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 transition transform hover:-translate-y-0.5 no-underline"
          >
            <span>▶</span>
            Start Learning LMS
          </Link>

          <Link
            to="/payment/history"
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs sm:text-sm font-medium transition no-underline"
          >
            <span>🧾</span>
            Invoices & Orders
          </Link>

          <Link
            to="/student/dashboard"
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-medium transition no-underline"
          >
            <span>🎓</span>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
