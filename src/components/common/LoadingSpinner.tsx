import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  label = "Loading KR Tech...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-purple-200 border-t-purple-600 animate-spin`}
        />
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-pulse" />
      </div>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600/80 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return <div className="min-h-[85vh] flex items-center justify-center">{spinner}</div>;
}
