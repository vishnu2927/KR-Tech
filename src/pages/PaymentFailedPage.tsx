import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { I } from "../components/Icons";

export default function PaymentFailedPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const errorMessage =
    state.errorMessage || "Payment transaction was declined or interrupted by the bank/UPI provider.";
  const courseTitle = state.courseTitle || "KR Global Learning Live Mentorship Course";
  const courseId = state.courseId || "";
  const orderId = state.orderId || "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Red ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-r from-rose-500/15 via-red-500/10 to-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-xl mx-auto">
        <div className="backdrop-blur-xl bg-[#0F1422]/90 border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(244,63,94,0.15)] text-center mb-8">
          {/* Animated Failure Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)] text-3xl font-bold">
            ✕
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>⚠️</span>
            Transaction Unsuccessful
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Payment Incomplete
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mb-6">
            We couldn&apos;t process your payment for <span className="text-white font-medium">{courseTitle}</span>. No money has been debited from your account (or will be refunded automatically within 48 hours).
          </p>

          {/* Reason Box */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/20 text-left text-xs sm:text-sm text-rose-200 mb-6">
            <span className="font-semibold block mb-1 text-rose-300">Gateway Message:</span>
            {errorMessage}
            {orderId && (
              <span className="block mt-2 font-mono text-[11px] text-gray-400">
                Ref Order: {orderId}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => (courseId ? navigate(`/checkout/${courseId}`) : navigate("/courses"))}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold shadow-lg shadow-rose-600/20 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>🔄</span>
              Try Again with Razorpay
            </button>

            <Link
              to="/courses"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium transition"
            >
              <span>←</span>
              Browse Other Courses
            </Link>
          </div>
        </div>

        {/* Assistance Card */}
        <div className="backdrop-blur-xl bg-[#0B0F19]/80 border border-white/10 rounded-2xl p-6 text-center text-sm">
          <h4 className="font-semibold text-white mb-1 flex items-center justify-center gap-2">
            <span>❓</span>
            Facing issues or need UPI / Bank Transfer assistance?
          </h4>
          <p className="text-xs text-gray-400 mb-4">
            Our admissions and technical team is available 24/7 to help you secure your seat.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/919311073936?text=Hi%20KR%20Global%20Learning%20Team,%20I%20faced%20an%20issue%20with%20course%20payment"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium hover:bg-emerald-600/30 transition"
            >
              <I.MessageCircle /> WhatsApp Support (+91 9311073936)
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-medium hover:bg-white/10 transition"
            >
              <I.Phone /> Contact Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
