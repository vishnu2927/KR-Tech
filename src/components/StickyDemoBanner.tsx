import { useState, useEffect } from "react";
import { I } from "./Icons";

export default function StickyDemoBanner({ onOpenDemo }: { onOpenDemo: () => void }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user scrolls down 350px
      if (window.scrollY > 350 && !dismissed) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <aside aria-label="Free One-on-One Learning Consultation" className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-40 animate-slideUp">
      <div
        className="p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl relative overflow-hidden"
        style={{
          background: "rgba(18, 12, 38, 0.94)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid rgba(6, 182, 212, 0.4)",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(6, 182, 212, 0.2)",
        }}
      >
        {/* Glow ambient */}
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: "rgba(124, 58, 237, 0.35)", filter: "blur(25px)" }}
        />

        <div className="flex items-start gap-3">
          <div className="relative mt-1">
            <span className="w-3 h-3 rounded-full bg-cyan-400 block animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 block absolute inset-0 m-auto" />
          </div>

          <div className="text-left">
            <div className="font-display font-bold text-xs sm:text-sm text-white flex items-center gap-2 flex-wrap">
              <span>Free One-on-One Learning Consultation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold">
                Experienced Mentors
              </span>
            </div>
            <div className="text-[11px] text-gray-300 mt-1 leading-relaxed">
              Get personalized course guidance, learning roadmap, and expert mentorship from KR Global Learning.
            </div>
            <div className="text-[10px] text-cyan-300/90 font-medium mt-1">
              No Cost • Personalized Guidance • Live Expert Session
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={onOpenDemo}
            className="btn-primary text-xs py-2 px-3.5 rounded-xl cursor-pointer font-bold whitespace-nowrap header-glow-btn"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
            }}
          >
            <I.Sparkles /> Book Free Consultation
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Dismiss"
            aria-label="Dismiss banner"
          >
            <I.Close />
          </button>
        </div>
      </div>
    </aside>
  );
}
