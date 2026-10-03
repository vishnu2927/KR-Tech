import { useState } from "react";
import { I } from "./Icons";

interface LearningStory {
  studentName: string;
  courseCompleted: string;
  projectsBuilt: string[];
  skillsLearned: string[];
  certificationAchieved: string;
  learningExperienceReview: string;
  focusArea: string;
  avatar: string;
  rating: number;
  highlightTag: string;
  credentialId: string;
  learningMetrics: {
    teachingQuality: string;
    mentorshipRating: string;
    platformSupport: string;
  };
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const learningSuccessStories: LearningStory[] = [
    {
      studentName: "Arjun Mehta",
      courseCompleted: "Enterprise Java 21 & Spring Boot 3 Microservices",
      projectsBuilt: [
        "Distributed Event-Driven Payment Saga with Apache Kafka",
        "Multi-Tenant SaaS Inventory Microservices with Docker",
        "High-Throughput Connection Pool & Redis Caching Layer"
      ],
      skillsLearned: ["Java 21 Virtual Threads", "Spring Cloud", "Kafka", "Docker", "PostgreSQL Sharding"],
      certificationAchieved: "Certificate of Completion (Grade A+ · Distinction)",
      learningExperienceReview:
        "The One-on-One live pair programming sessions with my senior mentor completely transformed my engineering depth. Rather than passive lectures, we built a distributed payment saga from scratch with Kafka. My mentor reviewed every GitHub pull request line-by-line, explaining idempotency, event sourcing, and high-throughput database tuning.",
      focusArea: "Distributed Systems Architecture",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&auto=format",
      rating: 5,
      highlightTag: "Microservices & Distributed Systems",
      credentialId: "KRT-2026-JAVA-9102",
      learningMetrics: {
        teachingQuality: "5.0 / 5.0",
        mentorshipRating: "Senior Technical Architect",
        platformSupport: "24×7 Active",
      },
    },
    {
      studentName: "Priya Sharma",
      courseCompleted: "AWS Cloud Solutions Architect & Kubernetes DevOps",
      projectsBuilt: [
        "Multi-Region AWS VPC Peering & Transit Gateway with Terraform",
        "Zero-Downtime Blue/Green Deployments with ArgoCD & EKS",
        "Automated Prometheus & Grafana Health Probe Monitor"
      ],
      skillsLearned: ["AWS SAA-C03", "Kubernetes (EKS)", "Terraform IaC", "Helm Charts", "GitHub Actions CI/CD"],
      certificationAchieved: "Certificate of Completion (Grade A+)",
      learningExperienceReview:
        "Kubernetes and Terraform seemed overwhelming until I started KR Global Learning's dedicated One-on-One mentorship. My mentor held live screen-sharing debug sessions twice a week. We set up an actual AWS multi-region cluster, automated Helm chart deployments, and zero-downtime rolling releases with continuous feedback.",
      focusArea: "Cloud Infrastructure as Code",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop&auto=format",
      rating: 5,
      highlightTag: "Cloud Architecture & DevOps",
      credentialId: "KRT-2026-AWS-7729",
      learningMetrics: {
        teachingQuality: "5.0 / 5.0",
        mentorshipRating: "One-on-One Dedicated",
        platformSupport: "Real-time Lab Access",
      },
    },
    {
      studentName: "Rahul Verma",
      courseCompleted: "Full Stack MERN & Next.js 15 SaaS Engineering",
      projectsBuilt: [
        "Collaborative Code Editor with WebSockets & Redis Pub/Sub",
        "Multi-Tier E-Commerce Platform with Stripe Webhooks",
        "Role-Based Access Control Authentication Microservice"
      ],
      skillsLearned: ["React 19", "Next.js 15 Server Actions", "Node.js", "MongoDB Atlas", "Tailwind CSS v4"],
      certificationAchieved: "Certificate of Completion (Grade A+)",
      learningExperienceReview:
        "KR Global Learning matched me with a staff architect who guided me through advanced algorithms, modern Next.js 15 architecture, and database indexing. Defending my full-stack capstone in front of our mentor panel gave me genuine engineering confidence. The AI study assistant was also invaluable for instant code reviews.",
      focusArea: "Production Web Applications",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&auto=format",
      rating: 5,
      highlightTag: "Full Stack Next.js 15 & MERN",
      credentialId: "KRT-2026-MERN-8841",
      learningMetrics: {
        teachingQuality: "4.9 / 5.0",
        mentorshipRating: "Live Screen-Share",
        platformSupport: "Smart AI Assistant",
      },
    },
    {
      studentName: "Sneha Patel",
      courseCompleted: "Generative AI, LangChain & LLM Agent Engineering",
      projectsBuilt: [
        "Autonomous RAG Research Agent with Pinecone & LangChain",
        "Multi-Modal Document Parsing Pipeline with FastAPI",
        "Semantic Vector Search Engine with Hybrid Reranking"
      ],
      skillsLearned: ["Python 3.12", "LangChain", "Vector Databases", "Prompt Engineering", "FastAPI"],
      certificationAchieved: "Certificate of Completion (Grade A+)",
      learningExperienceReview:
        "I wanted to master modern practical AI engineering. The live One-on-One doubt clearing sessions made all the difference. My mentor patiently walked me through LangChain, RAG architecture, vector retrieval optimizations, and embedding spaces until I could architect and deploy production AI agents independently.",
      focusArea: "Generative AI & LLM Systems",
      avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=160&h=160&fit=crop&auto=format",
      rating: 5,
      highlightTag: "AI & Machine Learning",
      credentialId: "KRT-2026-AI-5519",
      learningMetrics: {
        teachingQuality: "5.0 / 5.0",
        mentorshipRating: "Interactive Pair Coding",
        platformSupport: "24×7 Doubt Clearing",
      },
    },
    {
      studentName: "Devendra Kulkarni",
      courseCompleted: "Cyber Security & Defensive SOC Architecture",
      projectsBuilt: [
        "Enterprise SIEM Threat Detection Pipeline with ELK Stack",
        "Automated Vulnerability Scanner & Zero-Trust IAM Policy Enforcer",
        "Incident Response Playbook Engine with Snort & Wireshark"
      ],
      skillsLearned: ["CEH v12 Objectives", "Network Forensics", "SIEM Threat Hunting", "Zero Trust Architecture"],
      certificationAchieved: "Certificate of Completion (Grade A+)",
      learningExperienceReview:
        "The hands-on cyber security labs and real-time defense simulations were phenomenal. Our mentor broke down complex network packets, Wireshark traces, and penetration testing techniques in deep detail. The official certification preparation questions helped me clear my exam on the very first attempt.",
      focusArea: "Threat Hunting & Security Defense",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&auto=format",
      rating: 5,
      highlightTag: "Cyber Security & SOC Labs",
      credentialId: "KRT-2026-SEC-6612",
      learningMetrics: {
        teachingQuality: "5.0 / 5.0",
        mentorshipRating: "Hands-on SOC Labs",
        platformSupport: "Exam Blueprint Prep",
      },
    },
  ];

  const current = learningSuccessStories[active];

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden text-slate-900 border-t border-slate-200/80">
      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-xs mb-3">
            <I.Sparkles /> LEARNING EXPERIENCES
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Real Practical Skills. <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Verified Student Experiences.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
            Discover how learners master modern technology stacks, build production architectures, and earn verified certificates with personalized One-on-One mentorship.
          </p>
        </div>

        {/* Learning Achievement Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          {[
            { label: "Hands-on Projects", value: "Practical", sub: "Production architectures" },
            { label: "Industry Mentors", value: "Dedicated", sub: "Experienced Engineers" },
            { label: "Course Certificates", value: "Official", sub: "Verifiable with QR Code" },
            { label: "Curriculum Domains", value: "12", sub: "Engineering tracks" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-slate-50 p-4 text-center rounded-2xl border border-slate-200 shadow-xs"
            >
              <div className="font-display font-black text-xl sm:text-2xl text-blue-600 mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-900 mb-0.5">{stat.label}</div>
              <div className="text-[11px] text-slate-500">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Student Selector Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start sm:justify-center">
          {learningSuccessStories.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl cursor-pointer transition-all shrink-0 ${
                i === active
                  ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
              style={{ border: "1px solid" }}
            >
              <img
                src={s.avatar}
                alt={s.studentName}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left">
                <div className="font-display font-bold text-xs text-slate-900">
                  {s.studentName}
                </div>
                <div className="text-[10px] text-blue-600 font-semibold truncate max-w-[150px]">{s.courseCompleted}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Learning Success Story Card */}
        <div className="bg-white p-6 sm:p-10 max-w-4xl mx-auto rounded-3xl border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Student Profile Column */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="relative mb-4">
                <img
                  src={current.avatar}
                  alt={current.studentName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
                <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  ✓
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-slate-900">
                {current.studentName}
              </h3>
              <p className="text-xs text-indigo-600 font-bold mt-0.5">
                {current.focusArea}
              </p>

              {/* Course Completed */}
              <div className="mt-4 pt-3 border-t border-slate-200 w-full text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Course Completed
                </div>
                <div className="text-xs font-bold text-blue-700 mt-1">
                  {current.courseCompleted}
                </div>
              </div>

              {/* Certification Achieved */}
              <div className="mt-3 w-full text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Completion Credential
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                  <I.Award /> {current.certificationAchieved}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  ID: {current.credentialId}
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-4 w-full py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1.5">
                <I.Check /> Verified Student Credential
              </div>
            </div>

            {/* Review & Details Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex text-amber-500 gap-1 text-sm">
                  {[...Array(current.rating)].map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                  <span className="text-xs text-slate-600 ml-1.5 font-bold">5.0 / 5.0 Rating</span>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  {current.highlightTag}
                </span>
              </div>

              {/* Learning Experience Review */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <I.BookOpen /> Student Review
                </div>
                <blockquote className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  "{current.learningExperienceReview}"
                </blockquote>
              </div>

              {/* Projects Built */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <I.Code /> Projects Built
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {current.projectsBuilt.map((proj, pIdx) => (
                    <div
                      key={pIdx}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium flex items-start gap-2"
                    >
                      <span className="text-blue-600 text-xs font-bold shrink-0">⚡</span>
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Learned */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <I.Sparkles /> Skills Mastered
                </div>
                <div className="flex flex-wrap gap-2">
                  {current.skillsLearned.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[11px] font-bold text-indigo-700 border border-indigo-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Teaching Quality & Mentorship Metrics */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-extrabold text-slate-900">{current.learningMetrics.teachingQuality}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Teaching Quality</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-extrabold text-blue-600">{current.learningMetrics.mentorshipRating}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Mentorship</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-extrabold text-emerald-600">{current.learningMetrics.platformSupport}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Learning Support</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

