import React, { useState } from "react";
import { CouponItem } from "../../services/paymentService";

interface CouponCardProps {
  availableCoupons: CouponItem[];
  appliedCoupon: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
  } | null;
  onApplyCoupon: (code: string) => Promise<void> | void;
  onRemoveCoupon: () => void;
  isLoading?: boolean;
}

export default function CouponCard({
  availableCoupons,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isLoading = false,
}: CouponCardProps) {
  const [inputCode, setInputCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleManualApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg("Please enter a coupon code.");
      return;
    }
    try {
      await onApplyCoupon(cleanCode);
      setInputCode("");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Invalid coupon code");
    }
  };

  const handleQuickApply = async (code: string) => {
    setErrorMsg(null);
    try {
      await onApplyCoupon(code);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Could not apply coupon");
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏷️</span>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Promotional Coupons
            </h3>
            <p className="text-[11px] text-slate-400">
              Apply a promo code to unlock exclusive student discounts
            </p>
          </div>
        </div>
        {appliedCoupon && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
            Applied ✓
          </span>
        )}
      </div>

      {/* Applied Banner */}
      {appliedCoupon ? (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white tracking-wider">
                  {appliedCoupon.code}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Saved ₹{appliedCoupon.discountAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                {appliedCoupon.discountType === "percentage"
                  ? `${appliedCoupon.discountValue}% discount applied to this order`
                  : `Flat ₹${appliedCoupon.discountValue.toLocaleString("en-IN")} discount applied`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            disabled={isLoading}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        /* Coupon Input Form */
        <form onSubmit={handleManualApply} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ENTER COUPON CODE (e.g. KRTECH20)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputCode.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            {isLoading ? "Checking..." : "Apply"}
          </button>
        </form>
      )}

      {errorMsg && (
        <div className="text-[11px] text-rose-400 flex items-center gap-1.5 animate-in fade-in">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Available Coupons list */}
      {!appliedCoupon && availableCoupons.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Recommended Offers For You
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {availableCoupons.map((c) => (
              <div
                key={c.code}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {c.code}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20">
                      {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {c.description || (c.discountType === "percentage" ? `Get ${c.discountValue}% discount up to ₹${c.maxDiscount || 3000}` : `Instant ₹${c.discountValue} scholarship grant`)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickApply(c.code)}
                  disabled={isLoading}
                  className="mt-3 w-full py-1 text-[10px] font-bold text-cyan-400 group-hover:text-white bg-cyan-500/10 group-hover:bg-cyan-500/30 rounded-lg border border-cyan-500/20 transition cursor-pointer text-center"
                >
                  Apply Code →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
