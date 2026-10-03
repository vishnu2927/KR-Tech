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
    <aside aria-label="Free One-on-One Learning Consultation" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-40 animate-slideUp">
      <div className="p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl bg-white/95 backdrop-blur-xl border border-blue-200/90 text-slate-900">
        <div className="flex items-start gap-3">
          <div className="relative mt-1 shrink-0">
            <span className="w-3 h-3 rounded-full bg-blue-500 block animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block absolute inset-0 m-auto" />
          </div>

          <div className="text-left">
            <div className="font-display font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Free One-on-One Learning Consultation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Experienced Mentors
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Get personalized course guidance, a tailored learning roadmap, and direct mentorship.
            </div>
            <div className="text-[10px] text-blue-700 font-bold mt-1">
              No Cost • Tailored Guidance • Live Screen Share
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={onOpenDemo}
            className="text-xs py-2 px-3.5 rounded-xl cursor-pointer font-bold whitespace-nowrap text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <I.Sparkles /> Book Free Consultation
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
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

