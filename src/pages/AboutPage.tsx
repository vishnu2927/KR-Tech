import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { I } from "../components/Icons";
import Mentors from "../components/Mentors";
import SEO from "../components/common/SEO";

// Animated counter hook for numbers counter animation
function useCounter(target: number, duration: number = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(Math.floor(duration / target), 15);
    const increment = Math.max(1, Math.floor(target / (duration / stepTime)));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export default function AboutPage({ onOpenDemoModal }: { onOpenDemoModal?: () => void }) {
  const offerings = [
    {
      title: "Live One-on-One Expert Mentorship",
      desc: "Direct pair-programming and real-time guidance from experienced technology architects. No passive 500-person webinars.",
      icon: <I.Users />,
      accent: "from-blue-600 to-indigo-600",
    },
    {
      title: "Practical Project-Based Learning",
      desc: "Build real enterprise microservices, cloud deployments, and full-stack platforms that demonstrate practical engineering ability.",
      icon: <I.Code />,
      accent: "from-cyan-600 to-blue-600",
    },
    {
      title: "Industry Certification Preparation",
      desc: "Tailored preparation and exam blueprints aligned with official credentials from AWS, Microsoft Azure, Cisco, and SAP.",
      icon: <I.Award />,
      accent: "from-emerald-600 to-teal-600",
    },
    {
      title: "AI Learning Assistant",
      desc: "24×7 intelligent study companion for instant concept explanations, code debugging, smart notes, and personalized quizzes.",
      icon: <I.Bot />,
      accent: "from-purple-600 to-indigo-600",
    },
    {
      title: "Recorded + Live Classes",
      desc: "Participate in interactive live coding sessions and access lifetime HD recordings archived directly in your student portal.",
      icon: <I.Video />,
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "Study Resources & Notes",
      desc: "Comprehensive cheat sheets, system design architectural diagrams, starter repositories, and curated PDF guides.",
      icon: <I.FileText />,
      accent: "from-indigo-600 to-purple-600",
    },
    {
      title: "Quizzes & Assignments",
      desc: "Weekly practical problem sets, code challenges, and thorough mentor reviews to measure and reinforce your mastery.",
      icon: <I.Check />,
      accent: "from-blue-600 to-cyan-600",
    },
    {
      title: "24×7 Student Support",
      desc: "Continuous technical doubt clearing, active student community circles, and a dedicated student success desk.",
      icon: <I.Headset />,
      accent: "from-teal-600 to-emerald-600",
    },
  ];

  const highlights = [
    { value: "84", label: "Live Tech Courses", desc: "Production-grade tracks in Cloud, AI, Full Stack & Security" },
    { value: "12", label: "Technology Domains", desc: "Enterprise & Modern Software Stacks" },
    { value: "One-on-One", label: "Dedicated Mentorship", desc: "Personalized Pair-Programming Sessions" },
    { value: "100%", label: "Hands-on Practical Labs", desc: "Real Capstones & Architecture Defenses" },
    { value: "24×7", label: "Student Helpdesk", desc: "Round-the-Clock Support & Doubt Resolution" },
  ];

  return (
    <SEO
      title="About KR GLOBAL LEARNING PRIVATE LIMITED — Live Mentorship & Tech Certifications"
      description="KR GLOBAL LEARNING PRIVATE LIMITED is empowering India's next generation of tech professionals through live One-on-One mentorship, industry certifications, and project-based learning."
      canonical="https://krgloballearning.com/about"
    >
      <main className="min-h-screen bg-slate-50 text-slate-900 pt-[90px] relative overflow-hidden">
        
        {/* Ambient Background Glow */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* HERO SECTION */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Empowering Future Tech Professionals
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 font-['Poppins']">
            KR GLOBAL LEARNING <br className="hidden sm:inline" />
            <span className="gradient-text-warm">
              PRIVATE LIMITED
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Empowering India's Next Generation of Tech Professionals Through Live Mentorship & Industry Certifications.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all no-underline"
            >
              Explore Courses
            </Link>
            <button
              type="button"
              onClick={onOpenDemoModal || (() => window.location.assign("/free-demo"))}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <I.Sparkles /> Book Free Consultation
            </button>
          </div>
        </section>

        {/* SECTION A — COMPANY HIGHLIGHTS */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xl shadow-slate-200/50">
            <div className="text-center mb-8">
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                Impact & Milestones
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Poppins'] mt-1">
                Company Highlights at a Glance
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl bg-slate-50 border border-slate-200/80 ${
                    i === 4 ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-['Poppins']">
                    {h.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                    {h.label}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 hidden sm:block">
                    {h.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 1 — OUR STORY */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xl shadow-slate-200/50">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
                <span>📖</span> Our Origin & Purpose
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins'] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  KR GLOBAL LEARNING PRIVATE LIMITED was founded with a singular conviction: traditional computer science education and mass webinar courses fail students when it comes to true engineering depth. Real programming is not passive observation — it is active, hands-on architectural problem-solving.
                </p>
                <p>
                  We built KR Global Learning to pioneer personalized, live One-on-One pair programming and technology certification training. By matching learners directly with senior architects and engineering leads, we provide an immersive apprenticeship experience where students build distributed systems, deploy cloud-native infrastructure, and write production-grade code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 & 3 — OUR MISSION & OUR VISION */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Our Mission */}
            <div className="rounded-3xl bg-white border border-blue-200 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-slate-200/50">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 mb-6">
                  <I.Sparkles />
                </div>
                <span className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">
                  Core Purpose
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-['Poppins'] mt-1 mb-4">
                  Our Mission
                </h3>
                <blockquote className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal italic border-l-2 border-blue-600 pl-4 py-1">
                  "Our mission is to bridge the gap between academic education and industry expectations by providing practical, mentor-led, project-based learning experiences."
                </blockquote>
              </div>
              <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
                Aligning curriculums with modern cloud, AI, and enterprise tech stacks to ensure 100% technical mastery and engineering competence.
              </p>
            </div>

            {/* Our Vision */}
            <div className="rounded-3xl bg-white border border-indigo-200 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-slate-200/50">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 mb-6">
                  <I.Award />
                </div>
                <span className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">
                  Strategic Horizon
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-['Poppins'] mt-1 mb-4">
                  Our Vision
                </h3>
                <blockquote className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal italic border-l-2 border-indigo-600 pl-4 py-1">
                  "To become the world's most trusted technology training and certification platform for students, graduates, and working professionals."
                </blockquote>
              </div>
              <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
                Pioneering live One-on-One mentor pairing across colleges, technology teams, and global engineering hubs.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 4 — OUR LEARNING PHILOSOPHY */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xl shadow-slate-200/50">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                Pedagogical Foundations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Poppins'] mt-1">
                Our Learning Philosophy
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Structured around deliberate practice, active code collaboration, and real-time mentor critique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl mb-3">🛠️</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Learn by Building</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every concept is cemented through functional code. Students build production microservices, data pipelines, and full-stack platforms rather than passive toy examples.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">One-on-One Pair Coding</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct screen-sharing with experienced engineers ensures immediate doubt elimination, architectural reviews, and best-practice linting from day one.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl mb-3">📜</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Vendor Certification Rigor</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our curricula directly map to globally recognized credentials from AWS, Microsoft, Cisco, and SAP, instilling rigorous industry standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 11 — COMPANY TIMELINE */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xl shadow-slate-200/50">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <I.Sparkles /> COMPANY TIMELINE & VALUES
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins'] tracking-tight">
                Our Evolution & Strategic Pillars
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Dedicated exclusively to high-standard technology training, verified certifications, live mentorship, and student experience.
              </p>
            </div>

            <div className="relative border-l-2 border-blue-200 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
              {/* 1. 2026 Company Founded */}
              <div className="relative group">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold" />
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  2026 Milestone
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5 font-['Poppins']">
                  Company Founded
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  KR GLOBAL LEARNING PRIVATE LIMITED was officially established to revolutionize technology education through personalized One-on-One live mentorship, production capstones, and rigorous vendor certification training.
                </p>
              </div>

              {/* 2. Vision */}
              <div className="relative group">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-cyan-500 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold" />
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 font-mono">
                  Strategic Horizon
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5 font-['Poppins']">
                  Vision
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  To become the world's most trusted technology training and certification platform, empowering students, graduates, and working professionals with verifiable real-world engineering excellence.
                </p>
              </div>

              {/* 3. Mission */}
              <div className="relative group">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold" />
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  Core Purpose
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5 font-['Poppins']">
                  Mission
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  To bridge the gap between academic theory and industry reality by providing practical, mentor-led, project-based learning experiences with line-by-line code reviews.
                </p>
              </div>

              {/* 4. Learning Philosophy */}
              <div className="relative group">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold" />
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                  Pedagogical Standard
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5 font-['Poppins']">
                  Learning Philosophy
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  Deliberate practice, direct One-on-One screen sharing with senior engineering architects, enterprise code defenses, and vendor exam preparation rigor.
                </p>
              </div>

              {/* 5. Corporate Office */}
              <div className="relative group">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold" />
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  Headquarters
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5 font-['Poppins']">
                  Corporate Office
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318, India.
                </p>
              </div>

              {/* 6. Support */}
              <div className="relative group">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-teal-500 border-4 border-white flex items-center justify-center text-[10px] text-white font-bold" />
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 font-mono">
                  Always Active
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5 font-['Poppins']">
                  24×7 Student Support
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  Round-the-clock student assistance, dedicated helpline (+91 9311073936), active doubt clearing circles, and verified email support (krglobal0713@gmail.com).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — WHAT WE OFFER */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
              Comprehensive Technology Education
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins'] mt-2">
              What We Offer
            </h2>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Designed from the ground up for practical technical mastery, live feedback, and real skill transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerings.map((c, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-white border border-slate-200 p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.accent} p-0.5 mb-5 shadow-md group-hover:scale-105 transition-transform`}>
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-blue-600">
                      {c.icon}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Poppins'] mb-2 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-blue-600">
                  <span>Included in All Tracks ✓</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6 — TECHNOLOGY DOMAINS WE TEACH */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xl shadow-slate-200/50">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                Full Tech Spectrum
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Poppins'] mt-1">
                Technology Domains We Teach
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Industry-focused programs spanning emerging cloud architectures, security, and enterprise stacks.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
              {[
                { name: "Artificial Intelligence & LLMs", icon: "🤖" },
                { name: "Cloud Computing (AWS / Azure)", icon: "☁️" },
                { name: "Cyber Security & Ethical Hacking", icon: "🛡️" },
                { name: "Full Stack MERN Development", icon: "💻" },
                { name: "Java Backend & Spring Boot 3", icon: "☕" },
                { name: "DevOps, Docker & Kubernetes", icon: "🚀" },
                { name: "SAP (FICO, MM, SD, ABAP)", icon: "📊" },
                { name: "Data Analytics & Power BI", icon: "📈" },
                { name: "Cisco Networking (CCNA/CCNP)", icon: "🌐" },
                { name: "Microsoft Technologies & .NET", icon: "🪟" },
                { name: "Salesforce Admin & Dev", icon: "⚡" },
                { name: "Data Structures & System Design", icon: "🧠" },
              ].map((domain, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition">
                  <div className="text-2xl mb-1">{domain.icon}</div>
                  <div className="text-xs font-semibold text-slate-800">{domain.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MENTORS SPOTLIGHT */}
        <Mentors />

        {/* CORPORATE HEADQUARTERS & CONTACT DIRECTORY */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16 border-t border-slate-200">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xl shadow-slate-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7">
                <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                  Corporate Headquarters
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-['Poppins'] mt-1 mb-3">
                  KR GLOBAL LEARNING PRIVATE LIMITED
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318, India.
                </p>
                <div className="text-xs text-slate-700 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Customer Support Availability: 🟢 Available 24 Hours × 7 Days</span>
                  </div>
                  <div className="text-xs text-slate-700 flex items-center gap-2">
                    <span>Student Helpdesk:</span>
                    <a href="tel:+919311073936" className="text-blue-600 font-bold hover:underline no-underline">
                      📞 +91 9311073936 (24×7 Available)
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors no-underline"
                >
                  Contact Helpdesk
                </Link>
                <a
                  href="https://maps.google.com/?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition-colors no-underline"
                >
                  Get Directions
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>
    </SEO>
  );
}
