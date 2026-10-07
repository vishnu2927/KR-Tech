import { Link } from "react-router-dom";
import { I } from "./Icons";

interface LearningDomain {
  id: string;
  name: string;
  count: string;
  icon: string;
  description: string;
  accentBg: string;
  borderColor: string;
  badgeBg: string;
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
    accentBg: "bg-emerald-50 text-emerald-700",
    borderColor: "hover:border-emerald-400 hover:shadow-emerald-500/10",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    tags: ["LLMs", "LangChain", "RAG", "PyTorch"],
    roadmapSlug: "ai-roadmap",
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    count: "12 Programs",
    icon: "☁️",
    description: "Architect scalable multi-cloud environments aligned with official AWS SAA-C03 and Azure AZ-104 certifications.",
    accentBg: "bg-sky-50 text-sky-700",
    borderColor: "hover:border-sky-400 hover:shadow-sky-500/10",
    badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
    tags: ["AWS SAA-C03", "Azure AZ-104", "VPC", "Serverless"],
    roadmapSlug: "cloud-roadmap",
  },
  {
    id: "cyber-security",
    name: "Cyber Security",
    count: "7 Programs",
    icon: "🛡️",
    description: "Hands-on penetration testing, CEH v12 preparation, network forensics, SOC threat intelligence, and zero-trust IAM.",
    accentBg: "bg-rose-50 text-rose-700",
    borderColor: "hover:border-rose-400 hover:shadow-rose-500/10",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    tags: ["CEH v12", "Pen Testing", "SIEM", "Wireshark"],
    roadmapSlug: "security-roadmap",
  },
  {
    id: "full-stack",
    name: "Full Stack Development",
    count: "14 Programs",
    icon: "💻",
    description: "Production web development with React 19, Next.js 15, Node.js, Express, MongoDB Atlas, and Tailwind CSS v4.",
    accentBg: "bg-indigo-50 text-indigo-700",
    borderColor: "hover:border-indigo-400 hover:shadow-indigo-500/10",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    tags: ["React 19", "Next.js 15", "Node.js", "MongoDB"],
    roadmapSlug: "full-stack-roadmap",
  },
  {
    id: "devops",
    name: "DevOps",
    count: "9 Programs",
    icon: "🚀",
    description: "Containerization with Docker, Kubernetes cluster orchestration, GitOps with ArgoCD, Terraform IaC, and CI/CD pipelines.",
    accentBg: "bg-blue-50 text-blue-700",
    borderColor: "hover:border-blue-400 hover:shadow-blue-500/10",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    tags: ["Docker", "Kubernetes", "Terraform", "CI/CD"],
    roadmapSlug: "devops-roadmap",
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    count: "6 Programs",
    icon: "📊",
    description: "Enterprise Power BI PL-300 curriculum, advanced DAX modeling, Snowflake data warehousing, and interactive dashboards.",
    accentBg: "bg-cyan-50 text-cyan-700",
    borderColor: "hover:border-cyan-400 hover:shadow-cyan-500/10",
    badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    tags: ["Power BI", "DAX", "SQL", "Snowflake"],
    roadmapSlug: "data-analytics-roadmap",
  },
  {
    id: "sap",
    name: "SAP",
    count: "5 Programs",
    icon: "💼",
    description: "SAP S/4HANA consultant training, Universal Journal ACDOCA, FICO modules, MM/SD integration, and corporate accounting.",
    accentBg: "bg-teal-50 text-teal-700",
    borderColor: "hover:border-teal-400 hover:shadow-teal-500/10",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200",
    tags: ["SAP S/4HANA", "FICO", "General Ledger", "ERP"],
    roadmapSlug: "sap-roadmap",
  },
  {
    id: "microsoft-technologies",
    name: "Microsoft Technologies",
    count: "7 Programs",
    icon: "🪟",
    description: "Modern .NET 9, C# enterprise architectures, ASP.NET Core Web APIs, Entity Framework Core, and Azure integration.",
    accentBg: "bg-blue-50 text-blue-700",
    borderColor: "hover:border-blue-400 hover:shadow-blue-500/10",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    tags: [".NET 9", "C#", "ASP.NET Core", "Azure AD"],
    roadmapSlug: "microsoft-roadmap",
  },
  {
    id: "cisco-networking",
    name: "Cisco Networking",
    count: "4 Programs",
    icon: "🌐",
    description: "Routing and switching mastery, CCNA 200-301 and CCNP Enterprise exam preparation, subnetting, OSPF, and BGP.",
    accentBg: "bg-cyan-50 text-cyan-700",
    borderColor: "hover:border-cyan-400 hover:shadow-cyan-500/10",
    badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    tags: ["CCNA", "CCNP", "OSPF", "BGP Protocol"],
    roadmapSlug: "cisco-roadmap",
  },
  {
    id: "java-backend",
    name: "Java Backend",
    count: "8 Programs",
    icon: "☕",
    description: "Java 21 Virtual Threads, Spring Boot 3 microservices, Apache Kafka event streams, Redis caching, and Docker deployments.",
    accentBg: "bg-purple-50 text-purple-700",
    borderColor: "hover:border-purple-400 hover:shadow-purple-500/10",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    tags: ["Java 21", "Spring Boot 3", "Kafka", "PostgreSQL"],
    roadmapSlug: "java-roadmap",
  },
  {
    id: "python-development",
    name: "Python Development",
    count: "7 Programs",
    icon: "🐍",
    description: "Modern Python 3.12, FastAPI asynchronous backends, Celery task queues, data structures, and automation scripting.",
    accentBg: "bg-emerald-50 text-emerald-700",
    borderColor: "hover:border-emerald-400 hover:shadow-emerald-500/10",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    tags: ["Python 3.12", "FastAPI", "AsyncIO", "Automation"],
    roadmapSlug: "python-roadmap",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    count: "5 Programs",
    icon: "🎨",
    description: "Modern product design systems, Figma component architectures, design tokens, micro-interactions, and user research.",
    accentBg: "bg-pink-50 text-pink-700",
    borderColor: "hover:border-pink-400 hover:shadow-pink-500/10",
    badgeBg: "bg-pink-50 text-pink-700 border-pink-200",
    tags: ["Figma", "Design Systems", "Prototyping", "Design Tokens"],
    roadmapSlug: "uiux-roadmap",
  },
];

export default function CategoryGrid() {
  return (
    <section id="domains" className="py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200/80">
      {/* Subtle ambient gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Interactive Learning Domains</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-sans">
            Explore Live Programs Across{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              12 Technology Domains
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every interactive domain links to a structured step-by-step roadmap from beginner to advanced. Master real engineering through One-on-One live instruction and practical capstones.
          </p>
        </div>

        {/* 12 Domains Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {LEARNING_DOMAINS.map((domain) => (
            <Link
              key={domain.id}
              to={`/courses?category=${encodeURIComponent(domain.name)}`}
              className={`group relative p-6 rounded-2xl bg-white border border-slate-200 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between overflow-hidden no-underline ${domain.borderColor}`}
            >
              <div>
                {/* Header Icon + Course Count Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 ${domain.accentBg}`}>
                    {domain.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${domain.badgeBg}`}>
                    {domain.count}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 font-sans">
                  {domain.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">
                  {domain.description}
                </p>
              </div>

              {/* Tags + Action Arrow */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {domain.tags.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                  {domain.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-500">
                      +{domain.tags.length - 2}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 no-underline"
          >
            <span>Explore Complete Courses & Roadmaps</span>
            <I.ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

