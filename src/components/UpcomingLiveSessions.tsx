import { Link, useNavigate } from "react-router-dom";
import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

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
      mentorCompany: "Ex-Amazon",
      mentorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces&auto=format",
      date: "Tomorrow · Sep 08, 2026",
      time: "7:00 PM - 8:00 PM IST",
      topic: "Live 1:1 Demo: Microservices Architecture & Kafka Event Ingestion",
      seatsLeft: 3,
      badge: "Filling Fast",
    },
    {
      id: "ls-2",
      course: "MERN Stack Full Stack Mastery Bootcamp",
      category: "MERN Stack",
      mentor: "Vikram Nair",
      mentorCompany: "Ex-Razorpay",
      mentorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces&auto=format",
      date: "Wednesday · Sep 09, 2026",
      time: "10:00 AM - 11:00 AM IST",
      topic: "Live 1:1 Demo: React 19 Server Actions & Real-Time Next.js 15",
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
      date: "Thursday · Sep 10, 2026",
      time: "8:00 PM - 9:00 PM IST",
      topic: "Live 1:1 Demo: Designing High-Availability Multi-Region VPC on AWS",
      seatsLeft: 4,
      badge: "Weekend / Weekday",
    },
    {
      id: "ls-4",
      course: "Cyber Security, Ethical Hacking & SOC Defense",
      category: "Cyber Security",
      mentor: "Rohan Kulkarni",
      mentorCompany: "Ex-FireEye / CISSP",
      mentorAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&h=160&fit=crop&crop=faces&auto=format",
      date: "Friday · Sep 11, 2026",
      time: "6:30 PM - 7:30 PM IST",
      topic: "Live 1:1 Demo: Network Packet Sniffing & Threat Defense in Action",
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
    <section id="live-sessions" className="py-20 bg-white">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <SectionHeading
            badge="Live Interactive Cohorts"
            badgeClass="badge-cyan"
            title="Upcoming 1:1"
            accent="Live Sessions"
            desc="Attend a live evaluation session, experience real 1:1 screen sharing, and interact directly with an industry lead."
            center={false}
          />
          <Link
            to="/courses"
            className="btn-ghost flex items-center gap-1.5 self-start md:self-auto text-purple-700 font-semibold no-underline text-sm"
          >
            Explore All 50+ Programs <I.ChevronRight />
          </Link>
        </div>

        {/* Horizontal Cards Layout */}
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="group p-5 sm:p-6 rounded-3xl bg-gray-50/80 hover:bg-white border border-gray-200/80 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Course & Topic */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                    {s.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    {s.seatsLeft} demo slots left
                  </span>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    {s.badge}
                  </span>
                </div>

                <h3 className="font-sans font-extrabold text-base sm:text-lg text-gray-900 leading-snug mb-1 group-hover:text-purple-700 transition-colors">
                  {s.course}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1">
                  Topic: <strong>{s.topic}</strong>
                </p>
              </div>

              {/* Middle Column: Mentor, Date, Time */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-200 shrink-0">
                {/* Mentor Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={s.mentorAvatar}
                    alt={s.mentor}
                    className="w-11 h-11 rounded-2xl object-cover border border-purple-200 shadow-2xs"
                  />
                  <div>
                    <span className="text-[11px] text-gray-400 block">Trainer</span>
                    <strong className="text-xs text-gray-900 font-sans block">{s.mentor}</strong>
                    <span className="text-[11px] text-purple-600 font-medium">({s.mentorCompany})</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-200/80 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-800 font-bold mb-0.5">
                    <span className="text-purple-600"><I.Calendar /></span>
                    <span>{s.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                    <span className="text-cyan-600"><I.Clock /></span>
                    <span>{s.time}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Join Demo Action */}
              <div className="shrink-0 flex items-center">
                <button
                  type="button"
                  onClick={() => handleJoin(s)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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
