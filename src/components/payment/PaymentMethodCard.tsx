import React from "react";

interface PaymentMethodCardProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

export default function PaymentMethodCard({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodCardProps) {
  const methods = [
    {
      id: "upi",
      title: "Instant UPI (Zero Fee)",
      subtitle: "Google Pay, PhonePe, Paytm, BHIM & Any UPI ID",
      icon: "⚡",
      badge: "Fastest & Recommended",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "card",
      title: "Credit / Debit Cards",
      subtitle: "Visa, MasterCard, RuPay, Amex & International",
      icon: "💳",
      badge: "Instant Approval",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "netbanking",
      title: "Net Banking",
      subtitle: "All Indian Banks (HDFC, ICICI, SBI, Axis, Kotak...)",
      icon: "🏛️",
      badge: "50+ Banks",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "emi",
      title: "No-Cost EMI / Pay Later",
      subtitle: "ZestMoney, EarlySalary, Simpl, Credit Card EMI",
      icon: "📅",
      badge: "From ₹2,166/mo",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Select Payment Method
          </h3>
          <p className="text-[11px] text-slate-400">
            Powered by Razorpay Enterprise Payment Gateway
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMethod(m.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                    isSelected
                      ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                      : "bg-slate-900 border border-slate-800 text-slate-400"
                  }`}
                >
                  {m.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {m.title}
                    </span>
                    {m.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${m.badgeColor}`}
                      >
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {m.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-500"
                      : "border-slate-600 bg-transparent"
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Security Footnote */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] text-slate-400 gap-2">
        <span className="flex items-center gap-1.5">
          <span>🔒</span> PCI-DSS Level 1 Compliant Checkout
        </span>
        <span className="flex items-center gap-1.5">
          <span>🛡️</span> Instant 7-Day Course Guarantee
        </span>
      </div>
    </div>
  );
}
