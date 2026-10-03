import { Link } from "react-router-dom";
import { I } from "./Icons";

export default function FreeDemoSection({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden text-slate-900 border-t border-slate-200/80">
      <div className="container-xl relative z-10">
        <div className="bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-white max-w-3xl mx-auto text-center p-8 sm:p-14 rounded-3xl border border-blue-200/80 shadow-xl relative overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Zero Cost · Zero Commitment
          </span>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Start with a <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Free One-on-One Learning Consultation</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
            Experience KR Global Learning before enrolling. Attend a personalized One-on-One live screen-sharing session with an experienced mentor, evaluate the real curriculum, and get a tailored learning roadmap.
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 mb-10 flex-wrap">
            {[
              "One-on-One Live Screen-Sharing",
              "Customized learning roadmap",
              "Direct Mentor Q&A",
              "Zero Credit Card Required",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs"
              >
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              type="button"
              onClick={onOpenModal}
              className="py-3.5 px-8 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <I.Sparkles /> Book Free Consultation
            </button>
            <Link
              to="/courses"
              className="py-3.5 px-8 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all no-underline flex items-center gap-1.5"
            >
              <span>Explore Courses</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

