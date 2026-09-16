import React, { useState } from "react";

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  label?: string;
  className?: string;
}

export default function RetryButton({
  onRetry,
  label = "Try Again",
  className = "",
}: RetryButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onRetry();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
        loading
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-purple-500/25 active:scale-95 cursor-pointer"
      } ${className}`}
    >
      <span className={loading ? "animate-spin" : ""}>🔄</span>
      <span>{loading ? "Retrying..." : label}</span>
    </button>
  );
}
