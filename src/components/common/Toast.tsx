import React, { useEffect } from "react";
import { I } from "../Icons";

export interface ToastProps {
  message: string;
  type?: "success" | "warning" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      bg: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
      border: "rgba(52, 211, 153, 0.4)",
      icon: <I.Check />,
      label: "Success",
    },
    warning: {
      bg: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
      border: "rgba(251, 191, 36, 0.4)",
      icon: <I.Sparkles />,
      label: "Notice",
    },
    error: {
      bg: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
      border: "rgba(248, 113, 113, 0.4)",
      icon: <I.Close />,
      label: "Error",
    },
    info: {
      bg: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
      border: "rgba(96, 165, 250, 0.4)",
      icon: <I.Mail />,
      label: "Info",
    },
  }[type];

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 18px",
        background: config.bg,
        color: "white",
        borderRadius: 14,
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
        border: `1px solid ${config.border}`,
        maxWidth: 420,
        animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {config.icon}
      </div>
      <div style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>
        <div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", opacity: 0.9, letterSpacing: "0.05em" }}>
          {config.label}
        </div>
        <div style={{ marginTop: 2, fontWeight: 500 }}>{message}</div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
          padding: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <I.Close />
      </button>
    </div>
  );
}
