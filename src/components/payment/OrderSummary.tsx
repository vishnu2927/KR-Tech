import React from "react";

interface OrderSummaryProps {
  courseTitle: string;
  courseCategory?: string;
  mentorName?: string;
  originalPrice?: number;
  baseAmount: number;
  discountAmount: number;
  appliedCouponCode?: string;
  finalAmount: number;
  isProcessing?: boolean;
  onPayNow: () => void;
}

export default function OrderSummary({
  courseTitle,
  courseCategory = "Engineering & Architecture",
  mentorName = "Principal Tech Lead",
  originalPrice = 24999,
  baseAmount,
  discountAmount,
  appliedCouponCode,
  finalAmount,
  isProcessing = false,
  onPayNow,
}: OrderSummaryProps) {
  // 18% GST calculation
  const gstRate = 0.18;
  const taxableAmount = Math.round(finalAmount / (1 + gstRate));
  const gstAmount = finalAmount - taxableAmount;

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 sticky top-24">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
          {courseCategory}
        </span>
        <h3 className="text-base md:text-lg font-extrabold text-white leading-snug">
          {courseTitle}
        </h3>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
          <span>👨‍🏫</span> Guided by <span className="text-slate-200 font-medium">{mentorName}</span>
        </p>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center text-slate-400">
          <span>Standard Tuition Fee</span>
          <span className="line-through font-mono">₹{originalPrice.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between items-center text-slate-300">
          <span>Cohort Admission Rate</span>
          <span className="font-mono text-white font-semibold">₹{baseAmount.toLocaleString("en-IN")}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-400 font-medium animate-in fade-in">
            <span className="flex items-center gap-1">
              <span>🏷️</span> Coupon ({appliedCouponCode})
            </span>
            <span className="font-mono font-bold">- ₹{discountAmount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1">
          <span>Taxable Tuition</span>
          <span className="font-mono">₹{taxableAmount.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between items-center text-slate-400 text-[11px]">
          <span>GST (18% Integrated Tax)</span>
          <span className="font-mono">₹{gstAmount.toLocaleString("en-IN")}</span>
        </div>

        {/* Total Row */}
        <div className="pt-4 border-t border-slate-800/80 flex justify-between items-baseline">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
              Total Payable (INR)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">
              Inclusive of all taxes & LMS access
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl md:text-3xl font-black text-white font-mono bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              ₹{finalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Pay CTA Button */}
      <button
        type="button"
        onClick={onPayNow}
        disabled={isProcessing}
        className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting to Razorpay...</span>
          </>
        ) : (
          <>
            <span>🔒</span>
            <span className="tracking-wide">Pay ₹{finalAmount.toLocaleString("en-IN")} & Unlock</span>
            <span>→</span>
          </>
        )}
      </button>

      {/* Guarantee Checklist */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>Instant LMS enrollment in MongoDB Atlas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>Official GST Tax Invoice with QR verification</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>Confirmation email & receipt sent automatically</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>Direct One-on-One Mentor Discord & weekly live sessions</span>
        </div>
      </div>
    </div>
  );
}
