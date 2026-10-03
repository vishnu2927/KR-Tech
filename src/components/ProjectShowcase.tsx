import { useState } from "react";
import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

interface ShowcaseProject {
  id: string;
  title: string;
  tagline: string;
  category: "AI Projects" | "Web Development Projects" | "Cloud Projects" | "Cyber Security Labs" | "Data Analytics Dashboards" | "DevOps Projects";
  tech: string[];
  stars: string;
  forks: string;
  builtBy: string;
  course: string;
  previewUrl: string;
  image: string;
  highlights: string[];
  completionDate: string;
}

export default function ProjectShowcase({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<ShowcaseProject | null>(null);

  const categories = [
    "All",
    "AI Projects",
    "Web Development Projects",
    "Cloud Projects",
    "Cyber Security Labs",
    "Data Analytics Dashboards",
    "DevOps Projects",
  ];

  const projects: ShowcaseProject[] = [
    // 1. AI Projects
    {
      id: "ai-1",
      title: "Autonomous Multi-Agent RAG Research Assistant",
      tagline: "Intelligent research agent with recursive document parsing, vector embeddings, and LangChain orchestration.",
      category: "AI Projects",
      tech: ["Python 3.12", "LangChain", "FastAPI", "Pinecone", "OpenAI API", "Streamlit"],
      stars: "1.9k",
      forks: "420",
      builtBy: "Sneha Patel",
      course: "Generative AI & LLM Engineering",
      previewUrl: "https://github.com/krtech/autonomous-rag-agent",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&h=340&fit=crop&auto=format",
      highlights: ["Hybrid keyword + semantic vector retrieval", "Recursive AST document chunking", "Automated citation generator"],
      completionDate: "August 2026",
    },
    {
      id: "ai-2",
      title: "Real-Time AI Code Reviewer & AST Linting Engine",
      tagline: "Automated pull request analysis bot evaluating time complexity, security flaws, and clean code principles.",
      category: "AI Projects",
      tech: ["Python", "PyTorch", "HuggingFace", "FastAPI", "React 19"],
      stars: "2.3k",
      forks: "580",
      builtBy: "Karthik R.",
      course: "AI & Machine Learning Program",
      previewUrl: "https://github.com/krtech/ai-code-reviewer",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=340&fit=crop&auto=format",
      highlights: ["Static AST code analysis", "Zero-shot security vulnerability detector", "Automated unit test generation"],
      completionDate: "July 2026",
    },

    // 2. Web Development Projects
    {
      id: "web-1",
      title: "High-Scale Collaborative Real-Time Workspace",
      tagline: "Multi-room collaborative code editor with WebSocket synchronization and operational transformation.",
      category: "Web Development Projects",
      tech: ["React 19", "Next.js 15", "Node.js", "Redis Pub/Sub", "Monaco Editor", "Tailwind CSS v4"],
      stars: "1.8k",
      forks: "390",
      builtBy: "Rahul Verma",
      course: "Full Stack MERN & Cloud Track",
      previewUrl: "https://github.com/krtech/collaborative-editor",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=340&fit=crop&auto=format",
      highlights: ["Low-latency WebSocket rooms", "Redis Pub/Sub horizontal scaling", "Conflict-free cursor tracking"],
      completionDate: "August 2026",
    },
    {
      id: "web-2",
      title: "Event-Driven E-Commerce Microservices Engine",
      tagline: "Distributed microservices platform with Saga orchestration, Stripe webhooks, and Kafka message buses.",
      category: "Web Development Projects",
      tech: ["Java 21", "Spring Boot 3", "Kafka", "Docker", "PostgreSQL", "Next.js 15"],
      stars: "2.4k",
      forks: "690",
      builtBy: "Arjun Mehta",
      course: "Enterprise Java Backend Bootcamp",
      previewUrl: "https://github.com/krtech/order-saga-engine",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=340&fit=crop&auto=format",
      highlights: ["Saga pattern compensation rollback", "Distributed tracing with Zipkin", "PostgreSQL connection pooling"],
      completionDate: "July 2026",
    },

    // 3. Cloud Projects
    {
      id: "cloud-1",
      title: "Multi-Region AWS VPC Peering & Transit Gateway",
      tagline: "Complete enterprise infrastructure as code provisioning zero-trust cross-account network topology.",
      category: "Cloud Projects",
      tech: ["Terraform HCL", "AWS Transit Gateway", "AWS VPC", "IAM Roles", "CloudWatch"],
      stars: "1.5k",
      forks: "310",
      builtBy: "Priya Sharma",
      course: "AWS Solutions Architect Mastery",
      previewUrl: "https://github.com/krtech/aws-transit-gateway-iac",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format",
      highlights: ["Automated Terraform IaC modules", "Cross-region latency optimization", "Zero-trust security groups"],
      completionDate: "June 2026",
    },
    {
      id: "cloud-2",
      title: "Azure Hybrid Cloud Identity & KeyVault Manager",
      tagline: "Multi-tenant cloud security architecture integrating Azure Entra ID and automated secret rotations.",
      category: "Cloud Projects",
      tech: ["Azure Entra ID", "Azure KeyVault", "Bicep", "PowerShell", "Azure Monitor"],
      stars: "1.1k",
      forks: "230",
      builtBy: "Sameer Joshi",
      course: "Microsoft Azure Architect Program",
      previewUrl: "https://github.com/krtech/azure-identity-vault",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
      highlights: ["Automated SSL certificate rotations", "Least-privilege RBAC controls", "Compliance audit logging"],
      completionDate: "May 2026",
    },

    // 4. Cyber Security Labs
    {
      id: "sec-1",
      title: "Enterprise SIEM Threat Hunting & SOC Defense Lab",
      tagline: "Automated intrusion detection pipeline analyzing packet captures, syslog streams, and threat intelligence.",
      category: "Cyber Security Labs",
      tech: ["ELK Stack", "Snort IDS", "Wireshark", "Suricata", "Python", "Linux Hardening"],
      stars: "1.7k",
      forks: "340",
      builtBy: "Devendra Kulkarni",
      course: "Cyber Security & SOC Analyst Track",
      previewUrl: "https://github.com/krtech/siem-soc-defense-lab",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop&auto=format",
      highlights: ["Real-time Snort alert correlation", "Automated brute-force mitigation", "Custom PCAP protocol dissection"],
      completionDate: "August 2026",
    },
    {
      id: "sec-2",
      title: "Automated Zero-Day Vulnerability Scanning Suite",
      tagline: "Custom penetration testing suite assessing OWASP Top 10 vulnerabilities and API authorization flaws.",
      category: "Cyber Security Labs",
      tech: ["Python", "Nmap Scripting Engine", "Burp Suite API", "Docker", "Bash"],
      stars: "1.3k",
      forks: "290",
      builtBy: "Rohan Verma",
      course: "Ethical Hacking & CEH Prep",
      previewUrl: "https://github.com/krtech/vuln-scanner-suite",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
      highlights: ["Automated JWT vulnerability checks", "SQL injection fuzzing engine", "HTML executive report generator"],
      completionDate: "June 2026",
    },

    // 5. Data Analytics Dashboards
    {
      id: "data-1",
      title: "Enterprise Global Logistics & Supply Chain BI Dashboard",
      tagline: "Interactive executive BI suite modeling freight costs, inventory turns, and warehouse SLA performance.",
      category: "Data Analytics Dashboards",
      tech: ["Power BI", "DAX Formulas", "Snowflake", "SQL", "Star Schema Modeling"],
      stars: "1.2k",
      forks: "250",
      builtBy: "Meera Nair",
      course: "Power BI & Enterprise Data Analytics",
      previewUrl: "https://github.com/krtech/powerbi-supply-chain",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format",
      highlights: ["Complex DAX time-intelligence metrics", "Snowflake dimensional warehouse modeling", "Row-level security implementation"],
      completionDate: "July 2026",
    },
    {
      id: "data-2",
      title: "Healthcare Patient Outcomes & Hospital Telemetry Suite",
      tagline: "Real-time clinical analytics dashboard modeling ICU occupancy, patient recovery rates, and lab turnarounds.",
      category: "Data Analytics Dashboards",
      tech: ["Python", "Pandas", "Tableau", "PostgreSQL", "FastAPI"],
      stars: "980",
      forks: "180",
      builtBy: "Ananya Deshmukh",
      course: "Data Science & Clinical Analytics",
      previewUrl: "https://github.com/krtech/healthcare-telemetry",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=340&fit=crop&auto=format",
      highlights: ["Statistical cohort analysis", "Automated anomaly alerts", "HIPAA-compliant data anonymization"],
      completionDate: "May 2026",
    },

    // 6. DevOps Projects
    {
      id: "devops-1",
      title: "GitOps Zero-Downtime EKS Pipeline with ArgoCD",
      tagline: "Automated Kubernetes cluster management with GitOps synchronization, Helm templating, and canary rollouts.",
      category: "DevOps Projects",
      tech: ["Kubernetes", "ArgoCD", "Helm", "GitHub Actions", "Prometheus", "AWS EKS"],
      stars: "2.1k",
      forks: "530",
      builtBy: "Vikram Malhotra",
      course: "DevOps, Docker & Kubernetes Engineering",
      previewUrl: "https://github.com/krtech/gitops-argocd-pipeline",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=340&fit=crop&auto=format",
      highlights: ["Automated Canary & Blue-Green releases", "Argo Rollouts metric analysis", "Automated secret sealing with HashiCorp Vault"],
      completionDate: "August 2026",
    },
    {
      id: "devops-2",
      title: "Infrastructure Observability & Distributed Tracing Stack",
      tagline: "Full-stack cluster monitoring suite with Prometheus exporters, Grafana alerting, and OpenTelemetry instrumentation.",
      category: "DevOps Projects",
      tech: ["Prometheus", "Grafana", "OpenTelemetry", "Docker Compose", "Loki"],
      stars: "1.4k",
      forks: "310",
      builtBy: "Nikhil Rao",
      course: "Cloud & Site Reliability Engineering",
      previewUrl: "https://github.com/krtech/observability-stack",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
      highlights: ["Distributed microsecond tracing", "Synthetic HTTP ping latency monitors", "Automated PagerDuty alert webhooks"],
      completionDate: "June 2026",
    },
  ];

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 bg-slate-50 relative overflow-hidden text-slate-900 border-t border-slate-200/80">
      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <SectionHeading
            badge="Practical Project Showcase"
            badgeClass="badge-cyan"
            title="Real Hands-on Projects Built by Learners"
            subtitle="Explore practical capstones and architecture labs engineered during One-on-One live mentorship."
          />
        </div>

        {/* 6 Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm border border-blue-600 scale-105"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-xs"
            >
              {/* Thumbnail Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                {/* Category Pill */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 border border-slate-200 text-indigo-700 backdrop-blur-md shadow-xs">
                  {p.category}
                </span>

                {/* Stars/Forks count */}
                <div className="absolute top-3 right-3 flex items-center gap-2 text-xs font-bold text-slate-900 bg-white/95 px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs">
                  <span className="flex items-center gap-1 text-amber-600">★ {p.stars}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-blue-600">⑂ {p.forks}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {p.tagline}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-4">
                    {p.highlights.map((h, i) => (
                      <div key={i} className="text-[11px] text-slate-600 flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-[11px]">
                      Built by {p.builtBy}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                      {p.course}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalProject(p)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs transition cursor-pointer"
                  >
                    View Specs →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Project Detail */}
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white border border-slate-200 max-w-xl w-full rounded-2xl p-6 sm:p-8 space-y-5 text-slate-900 shadow-2xl relative animate-scaleIn">
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-lg font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold uppercase tracking-wider">
                <span>{activeModalProject.category}</span>
                <span>•</span>
                <span>Completed: {activeModalProject.completionDate}</span>
              </div>

              <h2 className="font-display font-extrabold text-2xl text-slate-900">
                {activeModalProject.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeModalProject.tagline}
              </p>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Key Architecture Highlights</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeModalProject.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalProject.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Author: {activeModalProject.builtBy}</div>
                  <div className="text-[11px] text-slate-500">{activeModalProject.course}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalProject(null);
                      if (onOpenDemo) onOpenDemo();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                  >
                    Build Similar Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

