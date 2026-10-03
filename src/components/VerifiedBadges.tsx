import React from "react";

interface VerifiedBadgesProps {
  className?: string;
  variant?: "horizontal" | "grid" | "pill";
}

export const VERIFIED_BADGES = [
  {
    id: "one-on-one",
    text: "Live One-on-One Mentorship",
    icon: "🎯",
    bg: "bg-indigo-50 border-indigo-200/80 text-indigo-950",
    iconBg: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "project-learning",
    text: "Project-Based Learning",
    icon: "💻",
    bg: "bg-blue-50 border-blue-200/80 text-blue-950",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "cert-prep",
    text: "Certification Preparation Programs",
    icon: "📜",
    bg: "bg-purple-50 border-purple-200/80 text-purple-950",
    iconBg: "bg-purple-100 text-purple-700",
  },
  {
    id: "support-247",
    text: "24×7 Student Support",
    icon: "⚡",
    bg: "bg-cyan-50 border-cyan-200/80 text-cyan-950",
    iconBg: "bg-cyan-100 text-cyan-700",
  },
];

export default function VerifiedBadges({ className = "", variant = "horizontal" }: VerifiedBadgesProps) {
  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
        {VERIFIED_BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${badge.bg}`}
          >
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${badge.iconBg}`}>
              {badge.icon}
            </span>
            <span className="text-xs sm:text-sm font-bold leading-snug">
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
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs ${badge.bg}`}
          >
            <span className="text-sm">{badge.icon}</span>
            <span>{badge.text}</span>
          </span>
        ))}
      </div>
    );
  }

  // Default horizontal wrap row
  return (
    <div className={`w-full py-4 bg-slate-50/90 border-y border-slate-200/90 backdrop-blur-md overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
        {VERIFIED_BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-bold ${badge.bg}`}
          >
            <span className="text-sm">{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

