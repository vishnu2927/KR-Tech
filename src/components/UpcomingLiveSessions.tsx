import { Link, useNavigate } from "react-router-dom";
import { I } from "./Icons";

interface LiveSession {
  id: string;
  course: string;
  category: string;
  mentor: string;
  mentorCompany: string;
  mentorAvatar: string;
  date: string;
  time: string;
  topic: string;
  seatsLeft: number;
  badge: string;
}

export default function UpcomingLiveSessions({
  onJoinDemo,
}: {
  onJoinDemo?: (courseName?: string) => void;
}) {
  const navigate = useNavigate();

  const sessions: LiveSession[] = [
    {
      id: "ls-1",
      course: "Complete Java Backend Development (Spring Boot 3.x)",
      category: "Java Backend",
      mentor: "Rajesh Kumar",
      mentorCompany: "Senior Technical Architect",
      mentorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces&auto=format",
      date: "Tomorrow · Live Broadcast",
      time: "7:00 PM - 8:00 PM IST",
      topic: "Live One-on-One Learning Consultation: Microservices Architecture & Kafka Event Ingestion",
      seatsLeft: 3,
      badge: "Filling Fast",
    },
    {
      id: "ls-2",
      course: "MERN Stack Full Stack Mastery Bootcamp",
      category: "MERN Stack",
      mentor: "Vikram Nair",
      mentorCompany: "FinTech Architect",
      mentorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces&auto=format",
      date: "Wednesday · Live Broadcast",
      time: "10:00 AM - 11:00 AM IST",
      topic: "Live One-on-One Learning Consultation: React 19 Server Actions & Real-Time Next.js 15",
      seatsLeft: 2,
      badge: "Popular Slot",
    },
    {
      id: "ls-3",
      course: "AWS Certified Solutions Architect & DevOps Track",
      category: "Cloud Computing",
      mentor: "Amitav Sengupta",
      mentorCompany: "AWS Architect",
      mentorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces&auto=format",
      date: "Thursday · Live Broadcast",
      time: "8:00 PM - 9:00 PM IST",
      topic: "Live One-on-One Learning Consultation: Designing High-Availability Multi-Region VPC on AWS",
      seatsLeft: 4,
      badge: "Weekend / Weekday",
    },
    {
      id: "ls-4",
      course: "Cyber Security, Ethical Hacking & SOC Defense",
      category: "Cyber Security",
      mentor: "Rohan Kulkarni",
      mentorCompany: "Security Specialist",
      mentorAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&h=160&fit=crop&crop=faces&auto=format",
      date: "Friday · Live Broadcast",
      time: "6:30 PM - 7:30 PM IST",
      topic: "Live One-on-One Learning Consultation: Network Packet Sniffing & Threat Defense in Action",
      seatsLeft: 3,
      badge: "Limited Seats",
    },
  ];

  const handleJoin = (session: LiveSession) => {
    if (onJoinDemo) {
      onJoinDemo(session.course);
    } else {
      navigate(`/free-demo?course=${encodeURIComponent(session.course)}&mentor=${encodeURIComponent(session.mentor)}`);
    }
  };

  return (
    <section id="live-sessions" className="py-24 bg-slate-50 relative overflow-hidden text-slate-900 border-t border-slate-200/80">
      <div className="container-xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-xs mb-3">
              <I.Sparkles /> LIVE ONE-ON-ONE INTERACTIVE SESSIONS
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Upcoming Live <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Evaluation Sessions</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Attend a live evaluation session, experience real One-on-One screen sharing, and interact directly with an industry lead.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 self-start md:self-auto text-blue-600 font-bold no-underline text-sm hover:text-blue-800 px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all"
          >
            <span>Explore All Programs</span>
            <I.ChevronRight />
          </Link>
        </div>

        {/* Horizontal Cards Layout */}
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group text-left"
            >
              {/* Left Column: Course & Topic */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {s.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {s.seatsLeft} live slots left
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    {s.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                  {s.course}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1">
                  Topic: <strong className="text-slate-800">{s.topic}</strong>
                </p>
              </div>

              {/* Middle Column: Mentor, Date, Time */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                {/* Mentor Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={s.mentorAvatar}
                    alt={s.mentor}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Lead Trainer</span>
                    <strong className="text-xs text-slate-900 font-display block">{s.mentor}</strong>
                    <span className="text-[11px] text-indigo-600 font-semibold">({s.mentorCompany})</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-0.5">
                    <span className="text-indigo-600"><I.Calendar /></span>
                    <span>{s.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="text-cyan-600"><I.Clock /></span>
                    <span>{s.time}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Join Consultation Session Action */}
              <div className="shrink-0 flex items-center">
                <button
                  type="button"
                  onClick={() => handleJoin(s)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <I.Sparkles /> Join Free Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

