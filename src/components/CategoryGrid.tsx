import { Link } from "react-router-dom";
import { I } from "./Icons";

interface LearningDomain {
  id: string;
  name: string;
  count: string;
  icon: string;
  description: string;
  gradient: string;
  borderHover: string;
  tags: string[];
  roadmapSlug: string;
}

const LEARNING_DOMAINS: LearningDomain[] = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    count: "8 Programs",
    icon: "🤖",
    description: "Deep dive into Large Language Models, LangChain RAG architectures, neural networks, PyTorch, and autonomous agents.",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    borderHover: "hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    tags: ["LLMs", "LangChain", "RAG", "PyTorch"],
    roadmapSlug: "ai-roadmap",
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    count: "12 Programs",
    icon: "☁️",
    description: "Architect scalable multi-cloud environments aligned with official AWS SAA-C03 and Azure AZ-104 certifications.",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    borderHover: "hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]",
    tags: ["AWS SAA-C03", "Azure AZ-104", "VPC", "Serverless"],
    roadmapSlug: "cloud-roadmap",
  },
  {
    id: "cyber-security",
    name: "Cyber Security",
    count: "7 Programs",
    icon: "🛡️",
    description: "Hands-on penetration testing, CEH v12 preparation, network forensics, SOC threat intelligence, and zero-trust IAM.",
    gradient: "from-rose-500/20 via-red-500/10 to-transparent",
    borderHover: "hover:border-rose-400/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]",
    tags: ["CEH v12", "Pen Testing", "SIEM", "Wireshark"],
    roadmapSlug: "security-roadmap",
  },
  {
    id: "full-stack",
    name: "Full Stack Development",
    count: "14 Programs",
    icon: "💻",
    description: "Production web development with React 19, Next.js 15, Node.js, Express, MongoDB Atlas, and Tailwind CSS v4.",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    borderHover: "hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.25)]",
    tags: ["React 19", "Next.js 15", "Node.js", "MongoDB"],
    roadmapSlug: "full-stack-roadmap",
  },
  {
    id: "devops",
    name: "DevOps",
    count: "9 Programs",
    icon: "🚀",
    description: "Containerization with Docker, Kubernetes cluster orchestration, GitOps with ArgoCD, Terraform IaC, and CI/CD pipelines.",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    borderHover: "hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    tags: ["Docker", "Kubernetes", "Terraform", "CI/CD"],
    roadmapSlug: "devops-roadmap",
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    count: "6 Programs",
    icon: "📊",
    description: "Enterprise Power BI PL-300 curriculum, advanced DAX modeling, Snowflake data warehousing, and interactive dashboards.",
    gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
    borderHover: "hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.25)]",
    tags: ["Power BI", "DAX", "SQL", "Snowflake"],
    roadmapSlug: "data-analytics-roadmap",
  },
  {
    id: "sap",
    name: "SAP",
    count: "5 Programs",
    icon: "💼",
    description: "SAP S/4HANA consultant training, Universal Journal ACDOCA, FICO modules, MM/SD integration, and corporate accounting.",
    gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
    borderHover: "hover:border-teal-400/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.25)]",
    tags: ["SAP S/4HANA", "FICO", "General Ledger", "ERP"],
    roadmapSlug: "sap-roadmap",
  },
  {
    id: "microsoft-technologies",
    name: "Microsoft Technologies",
    count: "7 Programs",
    icon: "🪟",
    description: "Modern .NET 9, C# enterprise architectures, ASP.NET Core Web APIs, Entity Framework Core, and Azure integration.",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    borderHover: "hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    tags: [".NET 9", "C#", "ASP.NET Core", "Azure AD"],
    roadmapSlug: "microsoft-roadmap",
  },
  {
    id: "cisco-networking",
    name: "Cisco Networking",
    count: "4 Programs",
    icon: "🌐",
    description: "Routing and switching mastery, CCNA 200-301 and CCNP Enterprise exam preparation, subnetting, OSPF, and BGP.",
    gradient: "from-indigo-500/20 via-cyan-500/10 to-transparent",
    borderHover: "hover:border-indigo-400/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]",
    tags: ["CCNA", "CCNP", "OSPF", "BGP Protocol"],
    roadmapSlug: "cisco-roadmap",
  },
  {
    id: "java-backend",
    name: "Java Backend",
    count: "8 Programs",
    icon: "☕",
    description: "Java 21 Virtual Threads, Spring Boot 3 microservices, Apache Kafka event streams, Redis caching, and Docker deployments.",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    borderHover: "hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    tags: ["Java 21", "Spring Boot 3", "Kafka", "PostgreSQL"],
    roadmapSlug: "java-roadmap",
  },
  {
    id: "python-development",
    name: "Python Development",
    count: "7 Programs",
    icon: "🐍",
    description: "Modern Python 3.12, FastAPI asynchronous backends, Celery task queues, data structures, and automation scripting.",
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    borderHover: "hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    tags: ["Python 3.12", "FastAPI", "AsyncIO", "Automation"],
    roadmapSlug: "python-roadmap",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    count: "5 Programs",
    icon: "🎨",
    description: "Modern product design systems, Figma component architectures, design tokens, micro-interactions, and user research.",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    borderHover: "hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]",
    tags: ["Figma", "Design Systems", "Prototyping", "Design Tokens"],
    roadmapSlug: "uiux-roadmap",
  },
];

export default function CategoryGrid() {
  return (
    <section id="domains" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Dynamic background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Interactive Learning Domains</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 font-sans">
            Explore 55+ Live Programs Across{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              12 Technology Domains
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every interactive domain links to a structured step-by-step roadmap from beginner to advanced. Master real engineering through One-on-One live instruction and practical capstones.
          </p>
        </div>

        {/* 12 Domains Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {LEARNING_DOMAINS.map((domain) => (
            <Link
              key={domain.id}
              to={`/courses?category=${encodeURIComponent(domain.name)}`}
              className={`group relative p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${domain.borderHover} overflow-hidden no-underline`}
            >
              {/* Inner ambient card glow */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${domain.gradient} blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

              <div>
                {/* Header Icon + Course Count Badge */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {domain.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-cyan-300 border border-white/10 backdrop-blur-md">
                    {domain.count}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors mb-2 font-sans relative z-10">
                  {domain.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3 relative z-10">
                  {domain.description}
                </p>
              </div>

              {/* Tags + Action Arrow */}
              <div className="pt-4 border-t border-white/10 relative z-10 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {domain.tags.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/5 text-slate-300 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                  {domain.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">
                      +{domain.tags.length - 2}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Roadmap →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Banner with All Courses Link */}
        <div className="mt-14 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 hover:from-purple-600/50 hover:to-cyan-600/50 border border-purple-500/40 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all hover:scale-105 no-underline shadow-lg shadow-purple-950/40"
          >
            <span>Explore Complete 55+ Courses & Roadmaps</span>
            <I.ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
