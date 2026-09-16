import React from "react";

interface SkeletonProps {
  variant?: "card" | "text" | "avatar" | "table";
  count?: number;
}

export default function SkeletonLoader({ variant = "card", count = 3 }: SkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === "text") {
    return (
      <div className="space-y-3 w-full animate-pulse">
        {items.map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md"
            style={{ width: `${85 - i * 15}%` }}
          />
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-24 bg-gray-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded-xl" />
        {items.map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 dark:bg-slate-800/60 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {items.map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
        >
          <div className="h-40 rounded-2xl bg-gray-200 dark:bg-slate-800 w-full" />
          <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="pt-4 flex justify-between items-center border-t border-gray-100 dark:border-slate-800">
            <div className="h-6 w-20 bg-gray-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-24 bg-gray-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
