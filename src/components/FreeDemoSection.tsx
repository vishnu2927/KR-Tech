import { Link } from "react-router-dom";
import { I } from "./Icons";

export default function FreeDemoSection({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <section className="py-24 bg-dark-obsidian relative overflow-hidden text-white border-t border-purple-500/15">
      {/* Dynamic ambient floating gradients */}
      <div className="orb" style={{ width: 550, height: 550, top: -100, left: "20%", background: "rgba(124,58,237,0.25)" }} />
      <div className="orb" style={{ width: 450, height: 450, bottom: -100, right: "20%", background: "rgba(6,182,212,0.2)" }} />

      <div className="container-xl relative z-10">
        <div
          className="glass-card-dark max-w-3xl mx-auto text-center p-8 sm:p-14 relative overflow-hidden"
          style={{
            background: "rgba(18, 12, 38, 0.9)",
            border: "1.5px solid rgba(167, 139, 250, 0.3)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.6), 0 0 35px rgba(124,58,237,0.2)",
          }}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Zero Cost · Zero Commitment
          </span>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Start with a <span className="gradient-text-warm">Free Free One-on-One Learning Consultation</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed mb-8">
            Experience KR Global Learning before enrolling. Attend a personalized 1-on-1 live screen-sharing session with a senior
            Senior Enterprise Architect, evaluate the real curriculum, and get a tailored learning roadmap.
          </p>

          <div className="flex justify-center gap-3 sm:gap-6 mb-10 flex-wrap">
            {[
              "One-on-One Live Screen-Sharing",
              "Customized learning roadmap",
              "Direct Mentor Q&A",
              "Zero Credit Card Required",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-200 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md"
              >
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              type="button"
              onClick={onOpenModal}
              className="btn-primary py-3.5 px-8 rounded-2xl text-sm font-bold shadow-xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
              }}
            >
              <I.Sparkles /> Book Your Free Demo
            </button>
            <Link
              to="/courses"
              className="btn-ghost-white py-3.5 px-8 rounded-2xl text-sm font-semibold text-white no-underline border border-white/20 hover:border-cyan-400/60"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
