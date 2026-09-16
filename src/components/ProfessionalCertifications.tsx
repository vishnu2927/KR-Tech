import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { I } from "./Icons";
import SectionHeading from "./SectionHeading";
import { courseService, Course } from "../services/courseService";

interface CertCategory {
  id: string;
  name: string;
  icon: string;
  badge: string;
  badgeColor: string;
  description: string;
  popularCerts: string[];
  gradient: string;
  shadowColor: string;
}

const CERT_CATEGORIES: CertCategory[] = [
  {
    id: "Cloud Computing",
    name: "Cloud Computing",
    icon: "☁️",
    badge: "Cloud Certified",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    description: "AWS, Azure & Google Cloud official architecture and dev credentials with live labs.",
    popularCerts: ["AWS Solutions Architect", "Azure Administrator (AZ-104)", "GCP Cloud Engineer"],
    gradient: "from-sky-500/10 via-blue-500/5 to-transparent",
    shadowColor: "hover:shadow-sky-500/15",
  },
  {
    id: "Cyber Security",
    name: "Cyber Security",
    icon: "🔐",
    badge: "Security Expert",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    description: "Ethical hacking, CISSP, CEH, SOC analysis & threat defense certifications.",
    popularCerts: ["CompTIA Security+", "Certified Ethical Hacker (CEH)", "CISSP", "SOC Analyst"],
    gradient: "from-rose-500/10 via-red-500/5 to-transparent",
    shadowColor: "hover:shadow-red-500/15",
  },
  {
    id: "Networking",
    name: "Networking",
    icon: "🌐",
    badge: "Router & Network",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Cisco CCNA/CCNP, Fortinet NSE & enterprise routing/switching infrastructure.",
    popularCerts: ["Cisco CCNA 200-301", "Cisco CCNP Enterprise", "Fortinet NSE Security"],
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    shadowColor: "hover:shadow-emerald-500/15",
  },
  {
    id: "Microsoft & IT",
    name: "Microsoft & IT Professional",
    icon: "💻",
    badge: "IT Professional",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "M365, Windows Server, Active Directory, ServiceNow & ITIL 4 operations.",
    popularCerts: ["Microsoft 365 Admin", "Windows Server Hybrid", "ServiceNow CSA", "ITIL 4"],
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    shadowColor: "hover:shadow-blue-500/15",
  },
  {
    id: "Data & Analytics",
    name: "Data & Analytics",
    icon: "📊",
    badge: "Analytics Pro",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Power BI, Tableau, Splunk SIEM, Advanced SQL and executive intelligence.",
    popularCerts: ["Power BI Data Analyst (PL-300)", "Tableau Desktop", "Splunk Core Certified"],
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    shadowColor: "hover:shadow-amber-500/15",
  },
  {
    id: "Project Management",
    name: "Project Management & Agile",
    icon: "📋",
    badge: "Project Manager",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "PMP, Scrum Master CSM, PRINCE2, SAFe 6.0 & TOGAF enterprise frameworks.",
    popularCerts: ["PMP Exam Prep", "Scrum Master (CSM)", "PRINCE2 Foundation", "SAFe Agile"],
    gradient: "from-purple-500/10 via-violet-500/5 to-transparent",
    shadowColor: "hover:shadow-purple-500/15",
  },
  {
    id: "Enterprise Technologies",
    name: "Enterprise Technologies",
    icon: "🏢",
    badge: "Enterprise Expert",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    description: "Salesforce Admin/Dev, SAP FICO, SAP MM, SAP SD, ABAP & SuccessFactors ERP.",
    popularCerts: ["Salesforce Admin", "SAP FICO Consultant", "SAP MM & SD", "Salesforce Dev"],
    gradient: "from-teal-500/10 via-cyan-500/5 to-transparent",
    shadowColor: "hover:shadow-teal-500/15",
  },
];

export default function ProfessionalCertifications() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    courseService.getCourses().then(setCourses).catch(() => {});
  }, []);

  const getCourseCount = (catGroup: string) => {
    return courses.filter((c) => c.categoryGroup === catGroup).length;
  };

  return (
    <section id="certifications" className="py-20 bg-gradient-to-b from-gray-50/50 via-purple-50/20 to-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="container-xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <SectionHeading
            badge="Global IT Credentials"
            badgeClass="badge-purple"
            title="Explore Professional"
            accent="Certifications"
            desc="Achieve globally recognized certifications with personalized 1:1 live mentor support and real exam simulation labs."
            center={false}
          />
          <Link
            to="/courses"
            className="btn-ghost flex items-center gap-1.5 self-start md:self-auto text-purple-700 font-semibold no-underline text-sm"
          >
            Explore All Programs <I.ChevronRight />
          </Link>
        </div>

        {/* 7 Category Cards Grid (Desktop 4/3, Tablet 2, Mobile 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {CERT_CATEGORIES.map((cat) => {
            const count = getCourseCount(cat.id);
            return (
              <Link
                key={cat.id}
                to={`/courses?category=${encodeURIComponent(cat.id)}`}
                className={`group relative flex flex-col justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${cat.shadowColor} hover:border-purple-200 no-underline`}
              >
                {/* Subtle top gradient accent */}
                <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${cat.gradient} rounded-t-3xl pointer-events-none`} />

                <div className="relative z-10">
                  {/* Top Row: Icon + Count Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-3 bg-gray-50 rounded-2xl border border-gray-100/80 group-hover:scale-110 transition-transform shadow-xs">
                      {cat.icon}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 shadow-xs">
                      {count} Courses
                    </span>
                  </div>

                  {/* Category Title & Badge */}
                  <div className="mb-2.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border mb-2 ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                    <h3 className="font-sans font-extrabold text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Popular Certs tags */}
                  <div className="space-y-1.5 mb-5">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                      Popular Certifications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.popularCerts.map((pc, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-100"
                        >
                          {pc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="relative z-10 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-900 transition-colors">
                  <span>View Certification Track</span>
                  <span className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <I.ChevronRight />
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Quick Stats / Highlights Feature Card to complete the 8-slot grid nicely */}
          <div className="relative flex flex-col justify-between p-6 bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white rounded-3xl shadow-lg shadow-purple-900/20">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-md mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                100% Guaranteed 1:1 Live
              </div>
              <h3 className="font-sans font-extrabold text-xl mb-2 text-white">
                Need a Custom Roadmap?
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed mb-4">
                Our senior mentors with 10+ years of enterprise experience will assess your background and craft a personalized certification path.
              </p>
              <ul className="text-xs space-y-2 text-purple-100 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-300">✓</span> Flexible time slots & timezones
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-300">✓</span> Live hands-on lab sandbox
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-300">✓</span> Official exam question dumps review
                </li>
              </ul>
            </div>

            <Link
              to="/free-demo"
              className="mt-4 px-4 py-3 rounded-2xl text-xs font-bold text-center text-purple-950 bg-white hover:bg-purple-50 transition-all shadow-md no-underline"
            >
              Get Free Career Consultation →
            </Link>
          </div>
        </div>

        {/* CTA Banner After Certifications */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-8 md:p-12 shadow-2xl border border-purple-500/20">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30 backdrop-blur-md mb-4">
              <I.Sparkles /> Career Acceleration Program
            </span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl lg:text-4xl text-white leading-tight mb-4">
              Become Industry Ready with KR Tech Professional Certification Programs.
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Master the cloud, security, networking, and enterprise domains with personal guidance from seasoned architects. Learn at your own pace, on your own schedule.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/free-demo"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 no-underline flex items-center gap-2"
              >
                <I.Sparkles /> Book Free Demo
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-purple-100 bg-white/10 hover:bg-white/15 border border-white/20 transition-all no-underline flex items-center gap-2 backdrop-blur-md"
              >
                <I.Users /> Talk to Mentor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
