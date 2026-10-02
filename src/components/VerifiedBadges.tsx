import React from "react";

interface VerifiedBadgesProps {
  className?: string;
  variant?: "horizontal" | "grid" | "pill";
}

export const VERIFIED_BADGES = [
  {
    id: "verified-company",
    text: "Verified Technology Training Company",
    icon: "✓",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/25",
  },
  {
    id: "industry-learning",
    text: "Industry-Focused Learning Platform",
    icon: "✓",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/25",
  },
  {
    id: "one-on-one",
    text: "Live One-on-One Mentorship",
    icon: "✓",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/25",
  },
  {
    id: "project-learning",
    text: "Project-Based Learning",
    icon: "✓",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/25",
  },
  {
    id: "cert-prep",
    text: "Certification Preparation Programs",
    icon: "✓",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/25",
  },
  {
    id: "support-247",
    text: "24×7 Student Support",
    icon: "✓",
    color: "text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/25",
  },
];

export default function VerifiedBadges({ className = "", variant = "horizontal" }: VerifiedBadgesProps) {
  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 ${className}`}>
        {VERIFIED_BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md transition-all duration-200 hover:scale-[1.02] ${badge.bg}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-slate-900/80 ${badge.color}`}>
              {badge.icon}
            </span>
            <span className="text-xs font-semibold text-slate-200 leading-tight">
              {badge.text}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}>
        {VERIFIED_BADGES.map((badge) => (
          <span
            key={badge.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${badge.bg} text-slate-200`}
          >
            <span className={`font-bold ${badge.color}`}>{badge.icon}</span>
            <span>{badge.text}</span>
          </span>
        ))}
      </div>
    );
  }

  // Default horizontal marquee / wrap row
  return (
    <div className={`w-full py-3.5 bg-slate-950/80 border-y border-slate-800/80 backdrop-blur-md overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        {VERIFIED_BADGES.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center gap-2 text-xs sm:text-xs font-medium text-slate-300"
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-black bg-slate-900 border border-slate-700 ${badge.color}`}>
              {badge.icon}
            </span>
            <span className="text-slate-200 font-semibold">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
