import { Link, useNavigate } from "react-router-dom";
import { Mentor } from "../data/mentorsData";
import { I } from "./Icons";

interface MentorCardProps {
  mentor: Mentor;
  onBookSession?: (mentorName: string) => void;
}

export default function MentorCard({ mentor, onBookSession }: MentorCardProps) {
  const navigate = useNavigate();

  const handleBook = () => {
    if (onBookSession) {
      onBookSession(mentor.name);
    } else {
      navigate(`/free-demo?mentor=${encodeURIComponent(mentor.name)}&course=${encodeURIComponent(mentor.coursesTaught[0] || mentor.specialization)}`);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white/95 backdrop-blur-md rounded-3xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)] hover:border-purple-300 overflow-hidden">
      {/* Top Banner Accent */}
      <div className="h-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            1:1 Mentor
          </span>
        </div>
      </div>

      {/* Profile Header (Avatar + Quick Info) */}
      <div className="px-6 -mt-10 relative z-10 flex items-end justify-between mb-3">
        <div className="relative">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold" title="Online for 1:1 Booking">
            ✓
          </div>
        </div>

        {/* 10+ Years Experience Badge */}
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
          ⚡ {mentor.exp} Exp
        </span>
      </div>

      {/* Card Details */}
      <div className="px-6 flex-1 flex flex-col">
        {/* Name & Specialization */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-sans font-extrabold text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
              {mentor.name}
            </h3>
            {/* LinkedIn Icon */}
            <a
              href={mentor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#0077B5] text-gray-500 hover:text-white flex items-center justify-center transition-all"
              aria-label={`${mentor.name} on LinkedIn`}
              title="LinkedIn Profile"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.81a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
              </svg>
            </a>
          </div>

          <div className="text-xs font-semibold text-purple-600 mb-0.5">
            {mentor.role}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {mentor.specialization} <span className="text-gray-400">({mentor.company})</span>
          </div>
        </div>

        {/* Rating & Languages Bar */}
        <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 mb-3.5">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 font-bold"><I.Star /></span>
            <span className="font-extrabold text-gray-900">{mentor.rating}</span>
            <span className="text-gray-400 text-[11px]">({mentor.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-1.5 truncate" title={mentor.languages.join(", ")}>
            <span className="text-cyan-600 text-xs">🌐</span>
            <span className="truncate text-[11px] font-medium text-gray-700">{mentor.languages.join(", ")}</span>
          </div>
        </div>

        {/* Bio Preview */}
        <p className="text-xs text-gray-600 leading-relaxed mb-3.5 line-clamp-2">
          {mentor.bio}
        </p>

        {/* Skills Chips */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
            Key Technical Skills:
          </span>
          <div className="flex flex-wrap gap-1">
            {mentor.skills.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50/80 text-purple-700 border border-purple-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
        <div className="text-left">
          <span className="text-[10px] text-gray-400 font-medium block">1:1 Live Students</span>
          <span className="text-xs font-extrabold text-gray-900">{mentor.studentsCount} Trained</span>
        </div>

        <button
          type="button"
          onClick={handleBook}
          className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <I.Sparkles /> Book 1:1 Session
        </button>
      </div>
    </div>
  );
}
