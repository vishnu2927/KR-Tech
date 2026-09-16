import React from "react";
import { Link } from "react-router-dom";
import { I } from "../Icons";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white px-4">
      <div className="max-w-lg w-full text-center p-8 sm:p-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="text-7xl sm:text-8xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4 tracking-tighter">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-sans mb-3 text-white">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mb-8 leading-relaxed">
          The page you are looking for might have been moved, deleted, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all no-underline"
          >
            <I.ArrowRight /> Back to Homepage
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-all no-underline"
          >
            <I.Code /> Browse Courses
          </Link>
        </div>
      </div>
    </main>
  );
}
