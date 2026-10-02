import React, { useState } from "react";
import type { ChatMessage } from "../../services/aiService";

interface ChatBubbleProps {
  message: ChatMessage;
  mentorPersona?: string;
  userAvatar?: string;
}

const PERSONA_LABELS: Record<string, { label: string; icon: string; badgeColor: string }> = {
  fullstack: { label: "Full-Stack Architect", icon: "💻", badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  cloud_devops: { label: "Cloud & DevOps Lead", icon: "☁️", badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  system_design: { label: "System Design Staff", icon: "🏛️", badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  cybersecurity: { label: "Security & CEH Specialist", icon: "🛡️", badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
  dsa: { label: "Algorithms Coach", icon: "⚡", badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  general: { label: "Chief AI Tech Mentor", icon: "🤖", badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
};

export default function ChatBubble({ message, mentorPersona = "general", userAvatar }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const persona = PERSONA_LABELS[mentorPersona] || PERSONA_LABELS.general;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple formatting helper for code blocks and bold text
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const language = lines[0]?.trim() || "code";
        const codeContent = lines.slice(1).join("\n") || lines[0];

        return (
          <div key={idx} className="my-3 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950/90 shadow-lg">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>{language}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(codeContent);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {copied ? "Copied! ✓" : "Copy Code"}
              </button>
            </div>
            <pre className="p-3 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={idx} className="whitespace-pre-wrap leading-relaxed text-sm">
          {part}
        </div>
      );
    });
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Mentor Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-sm shadow-md shrink-0 ring-1 ring-white/20">
          {persona.icon}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 transition-all ${
          isUser
            ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white rounded-br-none shadow-lg shadow-purple-950/50 border border-purple-400/30"
            : "bg-slate-900/90 backdrop-blur-md text-slate-200 rounded-bl-none border border-slate-800 shadow-xl"
        }`}
      >
        {/* Header inside Bubble */}
        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1.5 border-b border-white/10 text-[11px]">
          <div className="flex items-center gap-1.5">
            {isUser ? (
              <span className="font-semibold text-purple-200">You (Student)</span>
            ) : (
              <span className={`px-2 py-0.5 rounded-full font-medium border text-[10px] ${persona.badgeColor}`}>
                {persona.icon} {persona.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            {message.timestamp && (
              <span className="text-[10px]">
                {new Date(message.timestamp).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {!isUser && (
              <button
                type="button"
                onClick={handleCopy}
                className="hover:text-white transition-colors cursor-pointer text-[10px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700"
                title="Copy entire response"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
        </div>

        {/* Message Content */}
        {renderFormattedContent(message.content)}
      </div>

      {/* User Avatar */}
      {isUser && (
        <img
          src={userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces&auto=format"}
          alt="Student"
          className="w-8 h-8 rounded-xl object-cover ring-2 ring-purple-500/40 shrink-0 shadow-md"
        />
      )}
    </div>
  );
}
