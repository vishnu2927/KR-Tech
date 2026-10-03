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
      mentorCompany: "Principal Technical Architect",
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
      mentorCompany: "Senior FinTech Architect",
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
      mentorCompany: "Senior Threat Researcher / CISSP",
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
    <section id="live-sessions" className="py-24 bg-dark-obsidian relative overflow-hidden text-white border-t border-purple-500/15">
      {/* Background radial glows */}
      <div className="orb" style={{ width: 500, height: 500, top: -100, right: -50, background: "rgba(6,182,212,0.18)" }} />
      <div className="orb" style={{ width: 450, height: 450, bottom: -100, left: -50, background: "rgba(124,58,237,0.2)" }} />

      <div className="container-xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-3">
              <I.Sparkles /> LIVE One-on-One INTERACTIVE COHORTS
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Upcoming Live <span className="gradient-text-warm">Evaluation Sessions</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-xl">
              Attend a live evaluation session, experience real One-on-One screen sharing, and interact directly with an industry lead.
            </p>
          </div>
          <Link
            to="/courses"
            className="btn-ghost-white flex items-center gap-2 self-start md:self-auto text-cyan-300 font-semibold no-underline text-sm hover:text-white px-5 py-2.5 rounded-xl"
          >
            Explore All Programs <I.ChevronRight />
          </Link>
        </div>

        {/* Horizontal Cards Layout */}
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="glass-card-dark p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:border-purple-400/50"
              style={{
                background: "rgba(18, 12, 38, 0.8)",
                border: "1px solid rgba(167, 139, 250, 0.2)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              }}
            >
              {/* Left Column: Course & Topic */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {s.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    {s.seatsLeft} live slots left
                  </span>
                  <span className="text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                    {s.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-white leading-snug mb-1 group-hover:text-cyan-300 transition-colors">
                  {s.course}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-1">
                  Topic: <strong className="text-white">{s.topic}</strong>
                </p>
              </div>

              {/* Middle Column: Mentor, Date, Time */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
                {/* Mentor Info */}
                <div className="flex items-center gap-3 text-left">
                  <img
                    src={s.mentorAvatar}
                    alt={s.mentor}
                    className="w-11 h-11 rounded-2xl object-cover border border-purple-400/40"
                  />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Lead Trainer</span>
                    <strong className="text-xs text-white font-display block">{s.mentor}</strong>
                    <span className="text-[11px] text-cyan-300 font-medium">({s.mentorCompany})</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10 text-xs text-left">
                  <div className="flex items-center gap-1.5 text-white font-bold mb-0.5">
                    <span className="text-purple-400"><I.Calendar /></span>
                    <span>{s.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                    <span className="text-cyan-400"><I.Clock /></span>
                    <span>{s.time}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Join Free Consultation Session Action */}
              <div className="shrink-0 flex items-center">
                <button
                  type="button"
                  onClick={() => handleJoin(s)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <I.Sparkles /> Join Free Demo Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
