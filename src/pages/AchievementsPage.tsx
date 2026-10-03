import React, { useState } from "react";
import { Link } from "react-router-dom";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import { useAuth } from "../context/AuthContext";

export default function AchievementsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "certificates" | "projects" | "streaks" | "badges" | "community" | "milestones">("all");

  // Certificates Earned
  const certificatesEarned = [
    {
      id: "cert-1",
      title: "Enterprise Java 21 & Spring Boot 3 Microservices",
      credentialId: "KRT-2026-JAVA-9102",
      issuedDate: "August 2026",
      grade: "Grade A+ (Distinction)",
      category: "Backend Engineering",
      skills: ["Java 21", "Spring Boot", "Kafka", "Docker", "PostgreSQL"],
    },
    {
      id: "cert-2",
      title: "AWS Certified Solutions Architect Associate (SAA-C03)",
      credentialId: "KRT-2026-AWS-7729",
      issuedDate: "July 2026",
      grade: "Grade A+ (Distinction)",
      category: "Cloud Computing",
      skills: ["AWS", "VPC", "Terraform", "EKS", "IAM"],
    },
    {
      id: "cert-3",
      title: "Full Stack Next.js 15 & MERN SaaS Engineering",
      credentialId: "KRT-2026-MERN-8841",
      issuedDate: "June 2026",
      grade: "Grade A",
      category: "Full Stack",
      skills: ["React 19", "Next.js 15", "Node.js", "Redis", "MongoDB"],
    },
  ];

  // Projects Completed
  const projectsCompleted = [
    {
      id: "proj-1",
      title: "Distributed Event-Driven Payment Saga Engine",
      course: "Enterprise Java Backend",
      tech: ["Java 21", "Spring Boot", "Apache Kafka", "Docker"],
      completionDate: "August 2026",
      stars: "2.4k",
      score: "100/100",
      status: "Production Approved",
    },
    {
      id: "proj-2",
      title: "Multi-Region VPC Peering & Transit Gateway with Terraform",
      course: "AWS Solutions Architecture",
      tech: ["Terraform HCL", "AWS VPC", "Transit Gateway", "IAM"],
      completionDate: "July 2026",
      stars: "1.5k",
      score: "98/100",
      status: "Production Approved",
    },
    {
      id: "proj-3",
      title: "Real-Time Collaborative Code Editor with WebSockets",
      course: "Full Stack Engineering",
      tech: ["React 19", "Node.js", "Redis Pub/Sub", "Monaco Editor"],
      completionDate: "June 2026",
      stars: "1.8k",
      score: "96/100",
      status: "Production Approved",
    },
  ];

  // Learning Streaks
  const learningStreaks = [
    {
      metric: "Current Daily Code Streak",
      value: "42 Days",
      icon: "🔥",
      detail: "Active daily problem submissions & code commits on KR Tech platform.",
      progress: 84,
      target: "50-Day Milestone",
    },
    {
      metric: "Live Mentorship Attendance",
      value: "100%",
      icon: "🎯",
      detail: "Attended all 24 scheduled One-on-One live screen-sharing classes.",
      progress: 100,
      target: "Perfect Attendance",
    },
    {
      metric: "Hands-on Lab Hours",
      value: "168 Hours",
      icon: "⏱️",
      detail: "Verified interactive environment time in cloud sandboxes & Docker containers.",
      progress: 92,
      target: "200-Hour Master Badge",
    },
  ];

  // Quiz Badges
  const quizBadges = [
    {
      id: "b-1",
      name: "DSA Pattern Master",
      category: "Algorithms",
      icon: "🥋",
      tier: "Gold Tier",
      score: "98% Accuracy",
      desc: "Solved 150+ LeetCode hard problems across Trees, Graphs, DP, and Tries.",
      dateEarned: "August 2026",
    },
    {
      id: "b-2",
      name: "Cloud Architecture Elite",
      category: "Cloud",
      icon: "☁️",
      tier: "Platinum Tier",
      score: "100% Accuracy",
      desc: "Cleared all 6 mock assessments for AWS SAA-C03 on first try.",
      dateEarned: "July 2026",
    },
    {
      id: "b-3",
      name: "Microservices Specialist",
      category: "Backend",
      icon: "⚡",
      tier: "Gold Tier",
      score: "96% Accuracy",
      desc: "Mastered Saga patterns, event sourcing, and Kafka partitions.",
      dateEarned: "June 2026",
    },
    {
      id: "b-4",
      name: "Security Sentinel",
      category: "Cyber Security",
      icon: "🛡️",
      tier: "Silver Tier",
      score: "94% Accuracy",
      desc: "Completed SOC packet analysis and penetration testing labs.",
      dateEarned: "May 2026",
    },
  ];

  // Community Contributions
  const communityContributions = [
    {
      title: "Top Peer Code Reviewer",
      count: "38 PRs Reviewed",
      desc: "Provided line-by-line architectural feedback on peer pull requests in student repos.",
      badge: "Community Champion",
    },
    {
      title: "Mentor Q&A Top Answerer",
      count: "74 Solutions Provided",
      desc: "Resolved complex Docker networking and Spring Boot dependency questions on forum.",
      badge: "Karma +840 XP",
    },
    {
      title: "Open Source Study Notes",
      count: "12 Cheat Sheets Shared",
      desc: "Contributed high-resolution system design architecture blueprints to community.",
      badge: "Knowledge Contributor",
    },
  ];

  // Mentorship Milestones
  const mentorshipMilestones = [
    {
      phase: "Milestone 1",
      title: "Diagnostic Skill Calibration",
      mentor: "Senior Staff Mentor",
      status: "Completed",
      date: "May 10, 2026",
      desc: "One-on-One goal setting, coding gap analysis, and tailored curriculum initialization.",
    },
    {
      phase: "Milestone 2",
      title: "Core Framework Mastery Checkpoint",
      mentor: "Lead Backend Architect",
      status: "Completed",
      date: "June 18, 2026",
      desc: "Direct pair programming session reviewing multithreading and database locking.",
    },
    {
      phase: "Milestone 3",
      title: "Production Capstone Architecture Defense",
      mentor: "Principal Enterprise Architect",
      status: "Completed",
      date: "July 25, 2026",
      desc: "Defended high-concurrency microservice design before a panel of senior engineers.",
    },
    {
      phase: "Milestone 4",
      title: "Official Certification Verification",
      mentor: "Academic Certification Board",
      status: "Completed",
      date: "August 20, 2026",
      desc: "Passed final hands-on lab evaluation and received verified course completion certificate.",
    },
  ];

  return (
    <SEO
      title="Student Learning Achievements & Milestones | KR Global Learning"
      description="Track verified student achievements, certificates earned, production projects completed, daily learning streaks, quiz badges, and One-on-One mentorship milestones at KR Global Learning."
      canonical="https://krgloballearning.com/achievements"
    >
      <main className="pt-24 pb-20 min-h-screen bg-[#070913] text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container-xl relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-4">
              🏆 VERIFIED STUDENT ACHIEVEMENTS (PHASE 13)
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
              Student Learning <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Achievements & Milestones</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Showcasing practical engineering competencies, verified certificates, completed projects, and technical milestones earned through One-on-One mentorship.
            </p>
          </div>

          {/* Quick Stats Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 text-center">
              <div className="text-3xl font-extrabold text-cyan-400 font-display">3</div>
              <div className="text-xs font-bold text-slate-200 mt-1">Certificates Earned</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Cryptographically Verified</div>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 text-center">
              <div className="text-3xl font-extrabold text-purple-400 font-display">3</div>
              <div className="text-xs font-bold text-slate-200 mt-1">Production Projects</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Capstones Defended</div>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 text-center">
              <div className="text-3xl font-extrabold text-amber-400 font-display">42 Days</div>
              <div className="text-xs font-bold text-slate-200 mt-1">Learning Streak</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Continuous Practice</div>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 text-center">
              <div className="text-3xl font-extrabold text-emerald-400 font-display">2,450 XP</div>
              <div className="text-xs font-bold text-slate-200 mt-1">Platform Reputation</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Top 5% Contributor</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar justify-start md:justify-center">
            {[
              { id: "all", label: "All Achievements" },
              { id: "certificates", label: "Certificates Earned" },
              { id: "projects", label: "Projects Completed" },
              { id: "streaks", label: "Learning Streaks" },
              { id: "badges", label: "Quiz Badges" },
              { id: "community", label: "Community Contributions" },
              { id: "milestones", label: "Mentorship Milestones" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-950/50 scale-105"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-16">

            {/* SECTION: CERTIFICATES EARNED */}
            {(activeTab === "all" || activeTab === "certificates") && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎓</span>
                    <h2 className="text-xl font-bold text-white font-display">Certificates Earned</h2>
                  </div>
                  <Link to="/certificates" className="text-xs font-bold text-cyan-400 hover:underline">
                    View Verification Portal →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {certificatesEarned.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-3xl bg-slate-900/70 border border-purple-500/30 p-6 flex flex-col justify-between hover:border-purple-500/60 transition shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {cert.category}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">
                            {cert.grade}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base text-white mb-2">
                          {cert.title}
                        </h3>

                        <div className="text-xs font-mono text-cyan-300 mb-3">
                          ID: {cert.credentialId}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {cert.skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Issued: {cert.issuedDate}</span>
                        <Link
                          to={`/certificates?verify=${encodeURIComponent(cert.credentialId)}`}
                          className="font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          Verify QR →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: PROJECTS COMPLETED */}
            {(activeTab === "all" || activeTab === "projects") && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛠️</span>
                    <h2 className="text-xl font-bold text-white font-display">Projects Completed</h2>
                  </div>
                  <a href="#projects" className="text-xs font-bold text-cyan-400 hover:underline">
                    View Project Gallery →
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projectsCompleted.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-3xl bg-slate-900/70 border border-cyan-500/30 p-6 flex flex-col justify-between hover:border-cyan-500/60 transition shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {p.course}
                          </span>
                          <span className="text-xs text-amber-400 font-bold">★ {p.stars}</span>
                        </div>

                        <h3 className="font-display font-bold text-base text-white mb-2">
                          {p.title}
                        </h3>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.tech.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold">✓ {p.status}</span>
                        <span className="text-slate-400 text-[11px]">Score: {p.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: LEARNING STREAKS */}
            {(activeTab === "all" || activeTab === "streaks") && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span className="text-xl">🔥</span>
                  <h2 className="text-xl font-bold text-white font-display">Learning Streaks & Consistency</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {learningStreaks.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl">{s.icon}</span>
                          <span className="text-xs font-bold text-purple-300">{s.target}</span>
                        </div>
                        <div className="text-2xl font-extrabold text-white font-display mb-1">
                          {s.value}
                        </div>
                        <div className="text-xs font-bold text-slate-300 mb-2">
                          {s.metric}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {s.detail}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-slate-800">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Progress</span>
                          <span className="font-bold text-cyan-300">{s.progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: QUIZ BADGES */}
            {(activeTab === "all" || activeTab === "badges") && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎖️</span>
                    <h2 className="text-xl font-bold text-white font-display">Technical Quiz Badges</h2>
                  </div>
                  <Link to="/badges" className="text-xs font-bold text-cyan-400 hover:underline">
                    View Leaderboard & Badges →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quizBadges.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-400/40 transition shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl">{b.icon}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {b.tier}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base text-white mb-1">
                          {b.name}
                        </h3>
                        <div className="text-xs font-semibold text-cyan-300 mb-2">
                          {b.score}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {b.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                        Earned: {b.dateEarned}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: COMMUNITY CONTRIBUTIONS */}
            {(activeTab === "all" || activeTab === "community") && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span className="text-xl">🤝</span>
                  <h2 className="text-xl font-bold text-white font-display">Community Contributions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {communityContributions.map((c, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
                          {c.badge}
                        </div>
                        <h3 className="font-display font-bold text-base text-white mb-1">
                          {c.title}
                        </h3>
                        <div className="text-sm font-extrabold text-cyan-300 mb-3">
                          {c.count}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {c.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: MENTORSHIP MILESTONES */}
            {(activeTab === "all" || activeTab === "milestones") && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span className="text-xl">🗺️</span>
                  <h2 className="text-xl font-bold text-white font-display">One-on-One Mentorship Milestones</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mentorshipMilestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl bg-slate-900/70 border border-emerald-500/30 p-6 flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                            {m.phase}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✓ {m.status}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-sm text-white mb-2">
                          {m.title}
                        </h3>

                        <div className="text-xs text-cyan-300 mb-2 font-medium">
                          Lead: {m.mentor}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {m.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                        Date: {m.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
    </SEO>
  );
}
