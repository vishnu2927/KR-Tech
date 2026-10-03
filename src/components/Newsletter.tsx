import { useState } from "react";
import { I } from "./Icons";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden text-white border-t border-slate-800">
      {/* Soft background ambient gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-xl relative z-10 text-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
          <I.Sparkles /> STAY UPDATED
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-3">
          Get Free Study Materials & Tech Roadmaps
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-xl mx-auto">
          Receive weekly developer tips, system design cheat sheets, and technology course updates directly in your inbox.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold shadow-md">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </span>
            <span>You're subscribed! Welcome to the KR Global Learning community.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 max-w-lg mx-auto flex-wrap justify-center"
          >
            <div className="flex-1 min-w-[240px] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200">
              <span className="text-slate-400"><I.Mail /></span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 font-sans"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              Subscribe Free
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-slate-500">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}

