import React, { useState } from "react";
import { Link } from "react-router-dom";
import { I } from "./Icons";

export default function FloatingContactButtons() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5"
      role="region"
      aria-label="Floating Help Center"
    >
      {/* Expandable Action Buttons (SECTION 10) */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 transition-all duration-300">
          {/* 1. WhatsApp Direct Chat */}
          <a
            href="https://wa.me/919311073936?text=Hello%20KR%20Global%20Learning,%20I%20would%20like%20to%20know%20more%20about%20your%20One-on-One%20mentorship%20programs."
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 no-underline text-xs font-bold"
            title="Chat on WhatsApp (+91 9311073936)"
            aria-label="WhatsApp (+91 9311073936)"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 opacity-0 group-hover:opacity-100">
              WhatsApp Support (+91 9311073936)
            </span>
            <I.MessageCircle />
          </a>

          {/* 2. Direct Helpline Call */}
          <a
            href="tel:+919311073936"
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 no-underline text-xs font-bold"
            title="Call Support (+91 9311073936)"
            aria-label="Call (+91 9311073936)"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 opacity-0 group-hover:opacity-100">
              Call Support (+91 9311073936)
            </span>
            <I.Phone />
          </a>

          {/* 3. Direct Email Inquiry */}
          <a
            href="mailto:krglobal0713@gmail.com?subject=Learning%20Inquiry%20-%20KR%20Global%20Learning"
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-purple-700 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/40 transition-all duration-300 no-underline text-xs font-bold"
            title="Email krglobal0713@gmail.com"
            aria-label="Email (krglobal0713@gmail.com)"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 opacity-0 group-hover:opacity-100">
              Email krglobal0713@gmail.com
            </span>
            <I.Mail />
          </a>

          {/* 4. Support Page */}
          <Link
            to="/contact"
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-purple-500/40 transition-all duration-300 no-underline text-xs font-bold"
            title="Contact Support (24×7 Available)"
            aria-label="Support Desk"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 opacity-0 group-hover:opacity-100">
              Support Desk (24×7 Available)
            </span>
            <I.Headset />
          </Link>
        </div>
      )}

      {/* Main Trigger Toggle Pill with Support Tooltip */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 text-white border border-purple-500/40 backdrop-blur-md shadow-2xl hover:bg-slate-800 transition-all cursor-pointer text-xs font-semibold"
        aria-label="Toggle Floating Help Center"
        title="Need Help? Chat with KR Global Learning (24×7)"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium">{isOpen ? "Hide Help" : "Need Help?"}</span>
        <span className="text-xs text-purple-300">💬</span>

        {/* Hover Support Tooltip (Section 10) */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-200 shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Need Help? Chat with KR Global Learning (24×7)
        </span>
      </button>
    </div>
  );
}
