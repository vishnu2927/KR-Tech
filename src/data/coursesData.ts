export interface Course {
  id: string;
  title: string;
  category: string;
  categoryGroup:
    | "Cloud Computing"
    | "Cyber Security"
    | "Networking"
    | "Microsoft & IT"
    | "Data & Analytics"
    | "Project Management"
    | "Enterprise Technologies"
    | "Software Development"
    | "Cloud & Cloud Architecture"
    | "AI, Machine Learning & GenAI"
    | "Cybersecurity";
  duration: string;
  students: string;
  rating: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  mentor: string;
  mentorCompany: string;
  mentorExp: string;
  language: string;
  price: string;
  originalPrice: string;
  badge?: string;
  image: string;
  features: string[];
  roadmap: {
    week: string;
    title: string;
    topics: string[];
    milestone: string;
  }[];
}

export const ALL_COURSES: Course[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. SOFTWARE DEVELOPMENT COURSES (7 Courses - Preserved)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "java-backend",
    title: "Complete Java Backend Development with Spring Boot & Microservices",
    category: "Java Backend",
    categoryGroup: "Software Development",
    duration: "6 Months",
    students: "18.2K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Rajesh Kumar",
    mentorCompany: "Principal Technical Architect",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹12,999",
    originalPrice: "₹24,999",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
    features: ["Core Java 21 & Streams","Spring Boot 3.x & Security","Microservices, Kafka & Docker","One-on-One Live Capstone Architecture"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Core Java, OOP & Modern Streams",
                "topics": [
                      "Generics & Collections",
                      "Multithreading & Virtual Threads",
                      "Memory Management"
                ],
                "milestone": "Build Multi-threaded Banking Core"
          },
          {
                "week": "Week 3-4",
                "title": "Spring Boot 3.x, REST & JPA",
                "topics": [
                      "Spring DI & IoC Container",
                      "Hibernate ORM & PostgreSQL",
                      "JWT & OAuth2 Security"
                ],
                "milestone": "RESTful E-Commerce Auth Microservice"
          },
          {
                "week": "Week 5-6",
                "title": "Distributed Microservices & Kafka",
                "topics": [
                      "API Gateway & Service Discovery",
                      "Kafka Event-Driven Architecture",
                      "Docker Containerization"
                ],
                "milestone": "High-Scale Microservices Deployment"
          },
          {
                "week": "Week 7-8",
                "title": "System Design & Live Project Review",
                "topics": [
                      "Low-Level Design Patterns",
                      "Redis Distributed Caching",
                      "One-on-One ATS Resume & Mock Review"
                ],
                "milestone": "Production Capstone Release"
          }
    ]
  },
  {
    id: "mern-stack",
    title: "MERN Stack Full Stack Web Development Mastery Bootcamp",
    category: "MERN Stack",
    categoryGroup: "Software Development",
    duration: "5 Months",
    students: "22.1K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Vikram Nair",
    mentorCompany: "Senior FinTech Architect",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹14,999",
    originalPrice: "₹26,999",
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=340&fit=crop&auto=format",
    features: ["React 19 & Next.js 15","Node.js & Express REST APIs","MongoDB, Redis & Prisma","Full Stack SaaS Capstone"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Modern JavaScript & React 19",
                "topics": [
                      "ES6+, Async/Await & Event Loop",
                      "React Hooks & State Management",
                      "Tailwind CSS UI Systems"
                ],
                "milestone": "Build Responsive Streaming UI"
          },
          {
                "week": "Week 3-4",
                "title": "Node.js, Express & NoSQL",
                "topics": [
                      "RESTful API Architecture",
                      "MongoDB Aggregations & Indexes",
                      "JWT & OAuth2 Authentication"
                ],
                "milestone": "Full Stack Social Network Backend"
          },
          {
                "week": "Week 5-6",
                "title": "Next.js 15, SSR & WebSockets",
                "topics": [
                      "App Router & Server Actions",
                      "Real-Time Chat with Socket.IO",
                      "Stripe Payment Gateway"
                ],
                "milestone": "Real-time Collaboration App"
          },
          {
                "week": "Week 7-8",
                "title": "CI/CD, Cloud & Production Polish",
                "topics": [
                      "Dockerizing MERN Apps",
                      "Vercel & AWS Deployment",
                      "One-on-One Portfolio Polish"
                ],
                "milestone": "Live SaaS Product Launch"
          }
    ]
  },
  {
    id: "react-frontend",
    title: "Modern React 19, TypeScript & Next.js Frontend Architecture",
    category: "React JS",
    categoryGroup: "Software Development",
    duration: "3 Months",
    students: "16.5K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Vikram Nair",
    mentorCompany: "Senior FinTech Architect",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹9,999",
    originalPrice: "₹18,999",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop&auto=format",
    features: ["React 19 Server Components","TypeScript Strict Types","Framer Motion & Tailwind","Design System Creation"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Advanced React Patterns",
                "topics": [
                      "Custom Hooks Architecture",
                      "Context & Zustand State",
                      "Optimistic UI Updates"
                ],
                "milestone": "Design System Component Library"
          },
          {
                "week": "Week 2",
                "title": "TypeScript with React",
                "topics": [
                      "Generics, Utility Types",
                      "Type-safe API Clients",
                      "Form Validation with Zod"
                ],
                "milestone": "Enterprise Admin Dashboard"
          },
          {
                "week": "Week 3",
                "title": "Next.js 15 App Router",
                "topics": [
                      "Server Components & SSR",
                      "Streaming & Suspense",
                      "Performance Profiling"
                ],
                "milestone": "High-Performance Content Platform"
          },
          {
                "week": "Week 4",
                "title": "Testing & Web Vitals",
                "topics": [
                      "Vitest & React Testing Library",
                      "Lighthouse 100/100 Audits",
                      "One-on-One Code Review"
                ],
                "milestone": "Production Interactive Portfolio"
          }
    ]
  },
  {
    id: "nodejs-backend",
    title: "Node.js, Express & Microservices Scalable Backend Engineering",
    category: "Node JS",
    categoryGroup: "Software Development",
    duration: "4 Months",
    students: "14.1K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Karan Shah",
    mentorCompany: "Senior Payment Systems Architect",
    mentorExp: "12+ Years",
    language: "English & Hindi",
    price: "₹11,499",
    originalPrice: "₹20,999",
    badge: undefined,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop&auto=format",
    features: ["Event-Driven Node.js","Redis Caching & BullMQ","PostgreSQL & Prisma ORM","Microservices & Docker"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Node.js Core Internals",
                "topics": [
                      "Event Loop, Buffers & Streams",
                      "Cluster & Worker Threads",
                      "Memory Leak Profiling"
                ],
                "milestone": "High-Throughput File Processing API"
          },
          {
                "week": "Week 2",
                "title": "Relational Databases & Prisma",
                "topics": [
                      "PostgreSQL Schema Design",
                      "Transactions & ACID guarantees",
                      "Connection Pooling"
                ],
                "milestone": "Scalable FinTech Ledger Engine"
          },
          {
                "week": "Week 3",
                "title": "Caching & Message Queues",
                "topics": [
                      "Redis Caching Strategies",
                      "BullMQ Background Tasks & Queues",
                      "Rate Limiting Middleware"
                ],
                "milestone": "Distributed Notification Service"
          },
          {
                "week": "Week 4",
                "title": "Microservices & Docker",
                "topics": [
                      "gRPC & REST Gateways",
                      "Docker Compose Orchestration",
                      "One-on-One System Architecture Review"
                ],
                "milestone": "Containerized Backend Deployment"
          }
    ]
  },
  {
    id: "python-mastery",
    title: "Python Programming from Zero to Advanced Automation & Web",
    category: "Python",
    categoryGroup: "Software Development",
    duration: "3 Months",
    students: "25.0K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Divya Menon",
    mentorCompany: "Senior Cloud Specialist",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹8,999",
    originalPrice: "₹16,999",
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
    features: ["Python OOP & Metaprogramming","FastAPI & Async Programming","Web Scraping & Automation","One-on-One Live Coding Support"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Python Fundamentals & OOP",
                "topics": [
                      "Data Structures & Comprehensions",
                      "Classes, Inheritance & Dunder",
                      "Decorators & Generators"
                ],
                "milestone": "Automated File Management Tool"
          },
          {
                "week": "Week 2",
                "title": "Web Scraping & APIs",
                "topics": [
                      "BeautifulSoup & Playwright",
                      "Async HTTP Requests with aiohttp",
                      "Parsing JSON & XML"
                ],
                "milestone": "Real-Time Stock Scraper Bot"
          },
          {
                "week": "Week 3",
                "title": "FastAPI & Database Access",
                "topics": [
                      "Pydantic Data Validation",
                      "SQLAlchemy ORM & SQLite",
                      "JWT Auth with FastAPI"
                ],
                "milestone": "Production REST API Engine"
          },
          {
                "week": "Week 4",
                "title": "Testing, Packaging & Cloud",
                "topics": [
                      "Pytest Unit Testing",
                      "Creating Python Packages",
                      "One-on-One Career Mentorship"
                ],
                "milestone": "Publish Open Source Python Package"
          }
    ]
  },
  {
    id: "data-science",
    title: "Data Science & Business Analytics with Real Industry Projects",
    category: "Data Science",
    categoryGroup: "Software Development",
    duration: "4 Months",
    students: "12.8K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Divya Menon",
    mentorCompany: "Senior Cloud Specialist",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹11,999",
    originalPrice: "₹21,999",
    badge: "New",
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&h=340&fit=crop&auto=format",
    features: ["Python, Pandas & SQL","Power BI & Interactive Dashboards","A/B Testing & Statistics","End-to-End Case Studies"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Data Wrangling & Advanced SQL",
                "topics": [
                      "Complex Joins, CTEs & Windows",
                      "Pandas Data Cleaning",
                      "Handling Missing Data"
                ],
                "milestone": "Multi-Million Row SQL Analysis"
          },
          {
                "week": "Week 2",
                "title": "Exploratory Data Analysis",
                "topics": [
                      "Statistical Hypothesis Testing",
                      "Seaborn & Plotly Charts",
                      "Feature Engineering"
                ],
                "milestone": "E-Commerce Customer Behavior Study"
          },
          {
                "week": "Week 3",
                "title": "Power BI & Executive Reports",
                "topics": [
                      "DAX Queries & Data Models",
                      "Interactive KPI Dashboards",
                      "Automated Report Refreshes"
                ],
                "milestone": "Executive Financial Dashboard"
          },
          {
                "week": "Week 4",
                "title": "Machine Learning for Business",
                "topics": [
                      "Customer Churn Prediction",
                      "Time Series Forecasting",
                      "One-on-One Analytics Case Study Review"
                ],
                "milestone": "End-to-End Business ML Pipeline"
          }
    ]
  },
  {
    id: "dsa-competitive",
    title: "Data Structures & Algorithms (Java / C++) with Problem Solving",
    category: "DSA",
    categoryGroup: "Software Development",
    duration: "4 Months",
    students: "19.3K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Karan Shah",
    mentorCompany: "Senior Payment Systems Architect",
    mentorExp: "12+ Years",
    language: "English & Hindi",
    price: "₹10,999",
    originalPrice: "₹19,999",
    badge: "Essential",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=340&fit=crop&auto=format",
    features: ["350+ Curated LeetCode Problems","Dynamic Programming & Graphs","Time & Space Complexity","One-on-One Doubt Solving & Mock"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Arrays, Two Pointers & Hashing",
                "topics": [
                      "Sliding Window Technique",
                      "Prefix Sums & Bit Manipulation",
                      "Time/Space Complexity Math"
                ],
                "milestone": "Master 50 Foundation LeetCode Problems"
          },
          {
                "week": "Week 2",
                "title": "Linked Lists, Stacks & Trees",
                "topics": [
                      "Fast & Slow Pointers",
                      "Binary Trees & BST Traversals",
                      "LCA & Tree Views"
                ],
                "milestone": "Tree Algorithms & Recursive Solutions"
          },
          {
                "week": "Week 3",
                "title": "Graphs, BFS/DFS & Heaps",
                "topics": [
                      "Dijkstra & Topological Sort",
                      "Disjoint Set Union (DSU)",
                      "Min/Max Priority Queues"
                ],
                "milestone": "Solve Complex Shortest Path Problems"
          },
          {
                "week": "Week 4",
                "title": "Dynamic Programming & Backtracking",
                "topics": [
                      "1D & 2D Memoization",
                      "Knapsack & Subsequence Patterns",
                      "One-on-One Technical Problem Solving"
                ],
                "milestone": "Complete 350+ Problems Certification"
          }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ☁️ CLOUD & CLOUD ARCHITECTURE (17 Courses - Updated)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "aws-certified-cloud-practitioner",
    title: "AWS Certified Cloud Practitioner",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "6 Weeks",
    students: "15.4K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Arvind Swaminathan",
    mentorCompany: "AWS Certified Solutions Architect",
    mentorExp: "11+ Years",
    language: "English",
    price: "$499",
    originalPrice: "",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format",
    features: ["Cloud Concepts & Billing","Core AWS Services (EC2, S3, RDS)","Security, Compliance & IAM","Hands-on Practice Labs"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Cloud Fundamentals & AWS Global Infra",
                "topics": [
                      "Cloud Concepts & Value Proposition",
                      "AWS Global Infrastructure & Regions",
                      "IAM Users, Roles & Security"
                ],
                "milestone": "Deploy Secure AWS Root Architecture"
          },
          {
                "week": "Week 3-4",
                "title": "Core Services, Compute & Storage",
                "topics": [
                      "EC2 Instances, Lambda & Elastic Beanstalk",
                      "S3 Storage Classes & Lifecycle Policies",
                      "VPC Basics & Security Groups"
                ],
                "milestone": "Configure High-Availability Cloud Storage"
          },
          {
                "week": "Week 5-6",
                "title": "Security, Pricing & Exam Simulator",
                "topics": [
                      "AWS Well-Architected Framework",
                      "Cost Explorer & Budgets",
                      "Practice Exam Evaluation"
                ],
                "milestone": "Official Certification Readiness Simulation"
          }
    ]
  },
  {
    id: "aws-solutions-architect",
    title: "AWS Certified Solutions Architect – Associate",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "19.8K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Arvind Swaminathan",
    mentorCompany: "AWS Certified Solutions Architect",
    mentorExp: "11+ Years",
    language: "English",
    price: "$549",
    originalPrice: "",
    badge: "Most Popular",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["Multi-Tier VPC Architectures","High-Availability & Auto-Scaling","S3, EBS, EFS Storage Systems","Well-Architected Framework Labs"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Advanced VPC & Resilient Compute",
                "topics": [
                      "Multi-AZ Subnets & Route Tables",
                      "Application Load Balancers & Auto Scaling",
                      "EC2 Placement Groups & Launch Templates"
                ],
                "milestone": "Build Resilient Multi-Tier Infrastructure"
          },
          {
                "week": "Week 3-4",
                "title": "Storage, Databases & Serverless",
                "topics": [
                      "S3 Versioning, Replication & Glacier",
                      "RDS Multi-AZ & Aurora Serverless",
                      "Lambda & API Gateway"
                ],
                "milestone": "Deploy Serverless REST Microservices"
          },
          {
                "week": "Week 5-6",
                "title": "Enterprise Decoupling & Security",
                "topics": [
                      "SQS, SNS & EventBridge Fanout",
                      "AWS KMS & Secrets Manager",
                      "Route 53 & CloudFront CDN with WAF"
                ],
                "milestone": "Architect Event-Driven Global Pipeline"
          },
          {
                "week": "Week 7-8",
                "title": "Disaster Recovery & Capstone Architecture",
                "topics": [
                      "Multi-Region DR Strategies",
                      "Cost Optimization Audits",
                      "Full Mock Architect Evaluations"
                ],
                "milestone": "Complete Production Architecture Review"
          }
    ]
  },
  {
    id: "aws-solutions-architect-professional",
    title: "AWS Certified Solutions Architect – Professional",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "10 Weeks",
    students: "8.6K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Arvind Swaminathan",
    mentorCompany: "AWS Certified Solutions Architect",
    mentorExp: "11+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Expert Level",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=340&fit=crop&auto=format",
    features: ["Complex Multi-Account Architectures","Hybrid Cloud & Direct Connect","Enterprise Migration Strategies","Continuous DR & Resilience"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Complex Multi-Account Architecture",
                "topics": [
                      "AWS Organizations & Service Control Policies (SCPs)",
                      "AWS Transit Gateway & Hybrid Interconnect",
                      "Direct Connect & VPN Failover"
                ],
                "milestone": "Design Enterprise Organization Network Hub"
          },
          {
                "week": "Week 4-6",
                "title": "Data Migration & Continuous Operations",
                "topics": [
                      "Database Migration Service (DMS) & SCT",
                      "Application Discovery & Server Migration",
                      "Active-Active Multi-Region Replication"
                ],
                "milestone": "Execute Enterprise Cloud Migration Simulation"
          },
          {
                "week": "Week 7-10",
                "title": "Security Governance, Reliability & Cost",
                "topics": [
                      "Automated Remediation & Config Rules",
                      "FinOps & Advanced Cost Modeling",
                      "Pro-Level Architecture Defenses"
                ],
                "milestone": "Full Professional Capstone Defense"
          }
    ]
  },
  {
    id: "aws-developer",
    title: "AWS Certified Developer – Associate",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "12.4K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Arvind Swaminathan",
    mentorCompany: "AWS Certified Solutions Architect",
    mentorExp: "11+ Years",
    language: "English",
    price: "$549",
    originalPrice: "",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=340&fit=crop&auto=format",
    features: ["Serverless Lambda & API Gateway","DynamoDB NoSQL Data Modeling","CI/CD with CodePipeline & CodeBuild","Cloud Security & IAM Authentication"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Serverless Compute & APIs",
                "topics": [
                      "AWS Lambda Execution Context & Layers",
                      "API Gateway REST & WebSocket Endpoints",
                      "Step Functions State Machines"
                ],
                "milestone": "Build Microservice Backend with Lambda"
          },
          {
                "week": "Week 3-4",
                "title": "NoSQL & Distributed Caching",
                "topics": [
                      "DynamoDB Partition Keys, GSI & LSI",
                      "DynamoDB Streams & DAX",
                      "ElastiCache Redis Caching"
                ],
                "milestone": "Design High-Throughput NoSQL Model"
          },
          {
                "week": "Week 5-6",
                "title": "Deployment, CI/CD & Monitoring",
                "topics": [
                      "AWS SAM & CloudFormation Templates",
                      "CodeCommit, CodeBuild & CodePipeline",
                      "AWS X-Ray Distributed Tracing"
                ],
                "milestone": "Automate Full Stack CI/CD Delivery"
          },
          {
                "week": "Week 7-8",
                "title": "Security, Cognito & Optimization",
                "topics": [
                      "Amazon Cognito User & Identity Pools",
                      "AWS KMS Client-Side Encryption",
                      "Developer Associate Mock Assessments"
                ],
                "milestone": "Secure Serverless App Deployment"
          }
    ]
  },
  {
    id: "aws-sysops-administrator",
    title: "AWS Certified SysOps Administrator – Associate",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "9.2K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Arvind Swaminathan",
    mentorCompany: "AWS Certified Solutions Architect",
    mentorExp: "11+ Years",
    language: "English",
    price: "$549",
    originalPrice: "",
    badge: "SysOps Lead",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&auto=format",
    features: ["CloudWatch & Systems Manager Ops","Automated Remediation & Scripting","VPC Troubleshooting & Network ACLs","Backup, Restore & Cost Optimization"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Monitoring, Metrics & Analysis",
                "topics": [
                      "CloudWatch Dashboards, Metrics & Alarms",
                      "CloudTrail Auditing & EventBridge Rules",
                      "Systems Manager (SSM) Patch & Run Command"
                ],
                "milestone": "Deploy Automated Fleet Monitoring"
          },
          {
                "week": "Week 3-4",
                "title": "High Availability & Business Continuity",
                "topics": [
                      "Auto Scaling Lifecycle Hooks",
                      "Route 53 Health Checks & Failover Routing",
                      "AWS Backup Centralized Policies"
                ],
                "milestone": "Configure Automated Multi-AZ Failover"
          },
          {
                "week": "Week 5-6",
                "title": "Deployment, Provisioning & Networking",
                "topics": [
                      "CloudFormation Stack Sets & Drift Detection",
                      "VPC Troubleshooting & NAT Gateways",
                      "Network ACLs & Security Group Auditing"
                ],
                "milestone": "Resolve Live Complex Infrastructure Outages"
          },
          {
                "week": "Week 7-8",
                "title": "Security, Compliance & Hands-on Labs",
                "topics": [
                      "AWS Config Rules & Automated Remediation",
                      "KMS Key Rotation & IAM Policies",
                      "SysOps Associate Lab Exam Simulator"
                ],
                "milestone": "Pass SysOps Practical Scenario Labs"
          }
    ]
  },
  {
    id: "aws-devops-engineer-professional",
    title: "AWS Certified DevOps Engineer – Professional",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "10 Weeks",
    students: "7.9K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Arvind Swaminathan",
    mentorCompany: "AWS Certified Solutions Architect",
    mentorExp: "11+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Professional",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=340&fit=crop&auto=format",
    features: ["Infrastructure as Code (CloudFormation & CDK)","Automated Multi-Stage Delivery Pipelines","Zero-Downtime Deployment Strategies","Governance & Event-Driven Automation"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "SDLC Automation & Delivery Pipelines",
                "topics": [
                      "Multi-Account CodePipeline Orchestration",
                      "Automated Testing & Quality Gates",
                      "Canary, Blue/Green & Rolling Deployments"
                ],
                "milestone": "Construct Zero-Downtime Deployment Pipeline"
          },
          {
                "week": "Week 4-6",
                "title": "Configuration Management & IaC",
                "topics": [
                      "AWS CloudFormation Advanced Macros & Drift",
                      "AWS CDK TypeScript Infrastructure",
                      "Systems Manager State Manager Automation"
                ],
                "milestone": "Synthesize Multi-Environment IaC Architecture"
          },
          {
                "week": "Week 7-8",
                "title": "Monitoring, Logging & Event Remediation",
                "topics": [
                      "Centralized CloudWatch Logs via Kinesis",
                      "Automated Security Remediation via Lambda",
                      "Prometheus & Grafana on AWS"
                ],
                "milestone": "Deploy Enterprise Self-Healing Infrastructure"
          },
          {
                "week": "Week 9-10",
                "title": "High Availability, DR & Exam Mocks",
                "topics": [
                      "Disaster Recovery Automation & Pilot Light",
                      "Fault Injection Simulator (FIS)",
                      "DevOps Professional Mock Exams"
                ],
                "milestone": "Achieve 90%+ on DevOps Professional Simulator"
          }
    ]
  },
  {
    id: "aws-security-specialty",
    title: "AWS Certified Security – Specialty",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "8.1K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Arvind Swaminathan",
    mentorCompany: "AWS Certified Solutions Architect",
    mentorExp: "11+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Specialty",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop&auto=format",
    features: ["KMS Encryption & CloudHSM","AWS GuardDuty, Security Hub & Inspector","Advanced IAM Policies & Permissions Boundaries","Network Perimeter Defense with AWS WAF & Shield"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Incident Response & Logging",
                "topics": [
                      "GuardDuty Anomaly Detection & Remediation",
                      "Security Hub Integration & Automated Findings",
                      "CloudTrail Centralization & Log Integrity"
                ],
                "milestone": "Implement Automated Threat Hunting System"
          },
          {
                "week": "Week 3-4",
                "title": "Identity & Access Management",
                "topics": [
                      "Advanced IAM Conditions & NotPrincipal",
                      "Permission Boundaries & Session Policies",
                      "AWS Organizations SCPs & IAM Access Analyzer"
                ],
                "milestone": "Architect Least-Privilege IAM Federation"
          },
          {
                "week": "Week 5-6",
                "title": "Infrastructure & Network Protection",
                "topics": [
                      "AWS WAF Rulesets & Bot Control",
                      "AWS Shield Advanced DDoS Mitigation",
                      "AWS Network Firewall & VPC Endpoints"
                ],
                "milestone": "Harden Enterprise VPC Perimeter"
          },
          {
                "week": "Week 7-8",
                "title": "Data Protection & KMS Cryptography",
                "topics": [
                      "KMS Key Policies, Grants & Multi-Region Keys",
                      "AWS CloudHSM Cluster Administration",
                      "Security Specialty Mock Exams"
                ],
                "milestone": "Pass Security Specialty Assessment"
          }
    ]
  },
  {
    id: "aws-advanced-networking-specialty",
    title: "AWS Certified Advanced Networking – Specialty",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "6.8K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Arvind Swaminathan",
    mentorCompany: "AWS Certified Solutions Architect",
    mentorExp: "11+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Specialty",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["AWS Transit Gateway & Cloud WAN","Direct Connect & BGP Routing","VPC Flow Logs & Traffic Mirroring","PrivateLink & Network Firewall Architecture"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Enterprise Routing & Transit Gateway",
                "topics": [
                      "Transit Gateway Route Tables & Peering",
                      "AWS Cloud WAN Global Segments",
                      "BGP Path Selection & Community Attributes"
                ],
                "milestone": "Deploy Global Inter-Region Transit Mesh"
          },
          {
                "week": "Week 3-4",
                "title": "Hybrid Connectivity & Direct Connect",
                "topics": [
                      "AWS Direct Connect Dedicated & Hosted Connections",
                      "Direct Connect Gateway & Link Aggregation (LAG)",
                      "IPsec VPN Backup with Dynamic BGP"
                ],
                "milestone": "Build Redundant Hybrid Direct Connect Topology"
          },
          {
                "week": "Week 5-6",
                "title": "Network Security & Traffic Inspection",
                "topics": [
                      "Centralized Inspection via AWS Network Firewall",
                      "AWS PrivateLink for SaaS Integration",
                      "Traffic Mirroring & Zeek/Suricata IDS"
                ],
                "milestone": "Construct Zero-Trust Packet Inspection Fabric"
          },
          {
                "week": "Week 7-8",
                "title": "Network Optimization & Exam Mocks",
                "topics": [
                      "Jumbo Frames, Enhanced Networking & SR-IOV",
                      "Route 53 Resolver DNS Endpoints",
                      "Advanced Networking Mock Evaluations"
                ],
                "milestone": "Achieve Advanced Networking Certification Readiness"
          }
    ]
  },
  {
    id: "azure-az900",
    title: "Microsoft Azure Fundamentals (AZ-900)",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "6 Weeks",
    students: "16.1K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Saurabh Mehta",
    mentorCompany: "Microsoft Certified Azure Architect",
    mentorExp: "9+ Years",
    language: "English",
    price: "$499",
    originalPrice: "",
    badge: "Fundamentals",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&auto=format",
    features: ["Cloud Computing Fundamentals","Azure Compute, Network & Storage","Azure Entra ID & Access Management","Cost Management & SLAs"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Cloud Concepts & Azure Architecture",
                "topics": [
                      "Benefits of Cloud Services & IaaS/PaaS/SaaS",
                      "Azure Regions, Availability Zones & Datacenters",
                      "Azure Resource Manager (ARM) & Resource Groups"
                ],
                "milestone": "Provision Azure Foundation Hierarchy"
          },
          {
                "week": "Week 3-4",
                "title": "Core Azure Services & Workloads",
                "topics": [
                      "Virtual Machines, App Services & Azure Functions",
                      "Virtual Networks, VPN Gateway & ExpressRoute",
                      "Blob Storage, Disk Storage & Azure Files"
                ],
                "milestone": "Deploy Multi-Tier Azure Web Service"
          },
          {
                "week": "Week 5-6",
                "title": "Security, Governance & Exam Prep",
                "topics": [
                      "Microsoft Entra ID Authentication & RBAC",
                      "Microsoft Defender for Cloud & Azure Policy",
                      "AZ-900 Full Simulation Exams"
                ],
                "milestone": "Score 90%+ on AZ-900 Exam Simulator"
          }
    ]
  },
  {
    id: "azure-az104",
    title: "Microsoft Azure Administrator (AZ-104)",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "14.2K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Saurabh Mehta",
    mentorCompany: "Microsoft Certified Azure Architect",
    mentorExp: "9+ Years",
    language: "English",
    price: "$549",
    originalPrice: "",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
    features: ["Azure Active Directory / Entra ID","Virtual Machines & Virtual Networks","Storage Accounts & Azure Files","Azure Monitor & Backup Recovery"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Identities & Governance",
                "topics": [
                      "Microsoft Entra Users, Groups & Administrative Units",
                      "Role-Based Access Control (RBAC) & Custom Roles",
                      "Azure Policy, Subscriptions & Cost Alerts"
                ],
                "milestone": "Implement Enterprise Access Governance"
          },
          {
                "week": "Week 3-4",
                "title": "Storage Implementation & Virtual Compute",
                "topics": [
                      "Storage Account Endpoints, SAS & Blob Immutability",
                      "Azure Files & Azure File Sync Orchestration",
                      "VM Sizing, High Availability & VM Scale Sets"
                ],
                "milestone": "Deploy Enterprise Scale Compute Cluster"
          },
          {
                "week": "Week 5-6",
                "title": "Virtual Networking & Connectivity",
                "topics": [
                      "VNet Peering, User-Defined Routes (UDR) & VPN",
                      "Azure Bastion, NSGs & Application Security Groups",
                      "Azure Load Balancer & Application Gateway"
                ],
                "milestone": "Architect Secure Hub-and-Spoke Network"
          },
          {
                "week": "Week 7-8",
                "title": "Monitoring, Backup & Practical Labs",
                "topics": [
                      "Azure Monitor Metrics, Log Analytics & KQL",
                      "Recovery Services Vault & VM Backup Policies",
                      "AZ-104 Hands-On Scenario Evaluations"
                ],
                "milestone": "Complete AZ-104 Performance Exam Review"
          }
    ]
  },
  {
    id: "azure-solutions-architect",
    title: "Azure Solutions Architect Expert (AZ-305)",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "10 Weeks",
    students: "9.5K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Saurabh Mehta",
    mentorCompany: "Microsoft Certified Azure Architect",
    mentorExp: "9+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Expert",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=340&fit=crop&auto=format",
    features: ["Enterprise Governance & Security Design","High-Availability & Business Continuity","Data Storage & Relational Database Design","Microservices & Serverless Architecture"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Identity, Governance & Monitoring Solutions",
                "topics": [
                      "Conditional Access, PIM & Identity Protection",
                      "Management Groups & Enterprise Landing Zones",
                      "Centralized Sentinel & Log Analytics Architecture"
                ],
                "milestone": "Architect Multi-Tenant Enterprise Landing Zone"
          },
          {
                "week": "Week 4-6",
                "title": "Data Storage & Business Continuity Design",
                "topics": [
                      "Cosmos DB Multi-Region Replication & Consistency",
                      "Azure SQL Database Failover Groups & Managed Instances",
                      "Azure Site Recovery (ASR) Disaster Planning"
                ],
                "milestone": "Build High-Availability Data Storage Tier"
          },
          {
                "week": "Week 7-10",
                "title": "Infrastructure, App Architecture & Mocks",
                "topics": [
                      "Azure Kubernetes Service (AKS) Architecture",
                      "API Management & Event Grid Integration",
                      "AZ-305 Expert Case Study Defenses"
                ],
                "milestone": "Complete Full AZ-305 Architecture Review"
          }
    ]
  },
  {
    id: "azure-devops-engineer-az400",
    title: "Azure DevOps Engineer Expert (AZ-400)",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "10 Weeks",
    students: "8.1K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Saurabh Mehta",
    mentorCompany: "Microsoft Certified Azure Architect",
    mentorExp: "9+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Expert",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&h=340&fit=crop&auto=format",
    features: ["Azure Pipelines & GitHub Actions CI/CD","Infrastructure as Code with ARM & Bicep","Containerization with Azure Kubernetes (AKS)","Security, Compliance & Feedback Loops"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Git Architecture & Azure Repos",
                "topics": [
                      "Branching Policies & Pull Request Verification",
                      "Git Hooks & Large File Storage (LFS)",
                      "GitHub Enterprise Integration"
                ],
                "milestone": "Design Enterprise Git Branching Governance"
          },
          {
                "week": "Week 4-6",
                "title": "Multi-Stage CI/CD Automation",
                "topics": [
                      "YAML Pipelines & Deployment Gates",
                      "Artifact Packaging with Azure Artifacts",
                      "Automated Integration Testing & Code Coverage"
                ],
                "milestone": "Deploy Multi-Stage Production CI/CD"
          },
          {
                "week": "Week 7-8",
                "title": "IaC with Bicep & Container Delivery",
                "topics": [
                      "Azure Bicep Modularity & CI Integration",
                      "AKS Blue-Green Deployments with Helm",
                      "SonarQube & Aqua Security Scanning"
                ],
                "milestone": "Automate Kubernetes GitOps Deployment"
          },
          {
                "week": "Week 9-10",
                "title": "Feedback, SRE & AZ-400 Simulator",
                "topics": [
                      "Application Insights Crash & Telemetry Tracking",
                      "Chaos Studio Fault Injection",
                      "AZ-400 Final Certification Readiness"
                ],
                "milestone": "Pass AZ-400 Full DevOps Evaluation"
          }
    ]
  },
  {
    id: "azure-network-engineer-az700",
    title: "Azure Network Engineer Associate (AZ-700)",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "7.1K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Saurabh Mehta",
    mentorCompany: "Microsoft Certified Azure Architect",
    mentorExp: "9+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Network Pro",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["Azure Virtual WAN & ExpressRoute","Load Balancing with Azure Front Door & App Gateway","Network Security Groups & Azure Firewall","Private Endpoints & Network Monitoring"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Core Azure VNet Infrastructure",
                "topics": [
                      "CIDR Allocation, Subnets & Peering",
                      "User-Defined Routes (UDR) & IP Forwarding",
                      "Azure Private DNS Zones & Resolution"
                ],
                "milestone": "Build Scalable Enterprise Network Mesh"
          },
          {
                "week": "Week 3-4",
                "title": "Hybrid Connectivity & ExpressRoute",
                "topics": [
                      "Site-to-Site & Point-to-Site VPN Gateways",
                      "ExpressRoute Circuits, Peering & FastPath",
                      "Azure Virtual WAN Hub-and-Spoke Topology"
                ],
                "milestone": "Configure High-Speed Hybrid Connectivity"
          },
          {
                "week": "Week 5-6",
                "title": "Load Balancing, Traffic Routing & WAF",
                "topics": [
                      "Azure Load Balancer (Standard SKU)",
                      "Application Gateway with Web Application Firewall",
                      "Azure Front Door Global Anycast Routing"
                ],
                "milestone": "Deploy Global Multi-Region Traffic Balancer"
          },
          {
                "week": "Week 7-8",
                "title": "Network Security & Diagnostics",
                "topics": [
                      "Azure Firewall Premium & TLS Inspection",
                      "Private Endpoints & Service Endpoints",
                      "Network Watcher Connection Monitor & PCAP"
                ],
                "milestone": "Pass AZ-700 Technical Assessment"
          }
    ]
  },
  {
    id: "azure-security-engineer-az500",
    title: "Azure Security Engineer Associate (AZ-500)",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "8.4K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Saurabh Mehta",
    mentorCompany: "Microsoft Certified Azure Architect",
    mentorExp: "9+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Security Pro",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop&auto=format",
    features: ["Microsoft Entra ID Privileged Identity","Key Vault, Storage & Database Encryption","Microsoft Defender for Cloud & Sentinel","Network Security & Perimeter Hardening"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Identity Security & Access Management",
                "topics": [
                      "Microsoft Entra PIM (Privileged Identity Management)",
                      "Conditional Access Policies & Multi-Factor Auth",
                      "Entra ID App Registrations & Enterprise Apps"
                ],
                "milestone": "Enforce Zero-Trust Identity Security"
          },
          {
                "week": "Week 3-4",
                "title": "Platform & Host Security",
                "topics": [
                      "NSGs, ASGs & Azure Bastion Host Hardening",
                      "Endpoint Protection & Azure Disk Encryption",
                      "Container Security in ACR & AKS"
                ],
                "milestone": "Harden Azure Compute & Host Endpoints"
          },
          {
                "week": "Week 5-6",
                "title": "Data Security & Key Vault Cryptography",
                "topics": [
                      "Azure Key Vault Keys, Secrets & Certificates",
                      "Always Encrypted & Transparent Data Encryption",
                      "Storage Account SAS & Immutable Blobs"
                ],
                "milestone": "Configure Cryptographic Data Protection"
          },
          {
                "week": "Week 7-8",
                "title": "Cloud Security Posture & Sentinel SIEM",
                "topics": [
                      "Microsoft Defender for Cloud & Regulatory Benchmarks",
                      "Microsoft Sentinel Data Connectors & KQL Rules",
                      "AZ-500 Certification Scenario Mocks"
                ],
                "milestone": "Pass AZ-500 Hands-on Security Review"
          }
    ]
  },
  {
    id: "gcp-digital-leader",
    title: "Google Cloud Digital Leader",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "6 Weeks",
    students: "11.2K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Neha Sharma",
    mentorCompany: "Google Cloud Certified Professional Architect",
    mentorExp: "8+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Digital Leader",
    image: "https://images.unsplash.com/photo-1579869847552-87007e0ff837?w=600&h=340&fit=crop&auto=format",
    features: ["Cloud Basics & Digital Transformation","Google Cloud Compute, Data & AI","Modernizing Infrastructure & Apps","Cloud Operations & Financial Governance"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Digital Transformation & Cloud Principles",
                "topics": [
                      "Cloud Value Proposition & Business Innovation",
                      "Total Cost of Ownership & FinOps on GCP",
                      "Google Global Network Infrastructure"
                ],
                "milestone": "Develop Cloud Transformation Business Case"
          },
          {
                "week": "Week 3-4",
                "title": "Google Cloud Core Solutions",
                "topics": [
                      "Compute Engine, GKE & Serverless Run",
                      "BigQuery, Cloud Spanner & Cloud Storage",
                      "Vertex AI & Data Analytics Services"
                ],
                "milestone": "Map Enterprise Workloads to GCP Services"
          },
          {
                "week": "Week 5-6",
                "title": "Security, Governance & Exam Readiness",
                "topics": [
                      "Identity and Access Management (IAM)",
                      "Cloud Monitoring, Logging & Service SLAs",
                      "Digital Leader Exam Simulator"
                ],
                "milestone": "Achieve 90%+ on Practice Certification"
          }
    ]
  },
  {
    id: "gcp-associate-cloud-engineer",
    title: "Google Associate Cloud Engineer",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "8 Weeks",
    students: "10.4K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Neha Sharma",
    mentorCompany: "Google Cloud Certified Professional Architect",
    mentorExp: "8+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Cloud Engineer",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=340&fit=crop&auto=format",
    features: ["Compute Engine, GKE & Cloud Run","VPC Networks & Cloud Load Balancing","Cloud Storage & BigQuery Data Solutions","IAM, Resource Hierarchy & gcloud CLI"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Cloud Solution Environment Setup",
                "topics": [
                      "Resource Hierarchy (Org, Folders, Projects)",
                      "IAM Service Accounts, Roles & Workload Identity",
                      "Billing Accounts & Budgets"
                ],
                "milestone": "Deploy Enterprise Cloud Resource Hierarchy"
          },
          {
                "week": "Week 3-4",
                "title": "Planning & Deploying Compute Solutions",
                "topics": [
                      "Compute Engine Custom Images & Instance Templates",
                      "Google Kubernetes Engine (GKE) Cluster Management",
                      "Cloud Run Containerized Deployments"
                ],
                "milestone": "Deploy Resilient GKE Autopilot Workload"
          },
          {
                "week": "Week 5-6",
                "title": "Storage, Databases & Networking",
                "topics": [
                      "Cloud Storage Buckets, IAM & Lifecycle",
                      "Cloud SQL High Availability & Read Replicas",
                      "VPC Peering, Cloud Router & Load Balancers"
                ],
                "milestone": "Build Secure VPC Network Architecture"
          },
          {
                "week": "Week 7-8",
                "title": "Operations, Security & Certification Mocks",
                "topics": [
                      "Cloud Monitoring, Alerts & Cloud Logging",
                      "Cloud KMS & Secret Manager Integration",
                      "ACE Full Simulation Exams"
                ],
                "milestone": "Pass Associate Cloud Engineer Evaluation"
          }
    ]
  },
  {
    id: "google-professional-cl",
    title: "Google Professional Cl…",
    category: "Cloud & Cloud Architecture",
    categoryGroup: "Cloud & Cloud Architecture",
    duration: "10 Weeks",
    students: "7.5K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Neha Sharma",
    mentorCompany: "Google Cloud Certified Professional Architect",
    mentorExp: "8+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Professional",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=340&fit=crop&auto=format",
    features: ["Enterprise Cloud Architecture","Scalable Multi-Region Systems","Security & Regulatory Compliance","Hybrid & Multi-Cloud Implementation"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Enterprise Cloud Solution Architecture",
                "topics": [
                      "Multi-Region High Availability & Disasters",
                      "Anthos Hybrid & Multi-Cloud Deployments",
                      "Complex Interconnect & VPN Routing"
                ],
                "milestone": "Architect Multi-Cloud Enterprise Fabric"
          },
          {
                "week": "Week 4-6",
                "title": "Data Storage & Processing Architecture",
                "topics": [
                      "BigQuery Enterprise Data Warehousing",
                      "Cloud Spanner Global Synchronous Architecture",
                      "Cloud Pub/Sub Event Streaming Pipelines"
                ],
                "milestone": "Construct Global High-Scale Data Platform"
          },
          {
                "week": "Week 7-10",
                "title": "Security, Compliance & Professional Defense",
                "topics": [
                      "VPC Service Controls & Cloud Armor WAF",
                      "Compliance Frameworks (HIPAA/PCI-DSS)",
                      "Case Study Architect Review & Mocks"
                ],
                "milestone": "Complete Professional Certification Capstone"
          }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. 🤖 AI, MACHINE LEARNING & GENAI (10 Courses - Updated)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "aws-ai-practitioner",
    title: "AWS Certified AI Practitioner",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "6 Weeks",
    students: "8.9K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$499",
    originalPrice: "",
    badge: "AI Track",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop&auto=format",
    features: ["Amazon Bedrock & Foundation Models","Prompt Engineering & Responsible AI","AI Use Cases & Security Controls","Core AWS Machine Learning Services"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "AI Fundamentals & Generative AI Concepts",
                "topics": [
                      "Foundational Machine Learning vs GenAI",
                      "Large Language Models & Transformer Concepts",
                      "Responsible AI, Bias & Safety Guardrails"
                ],
                "milestone": "Deploy Baseline GenAI Prompt Pipeline"
          },
          {
                "week": "Week 3-4",
                "title": "Amazon Bedrock & AWS AI Suite",
                "topics": [
                      "Amazon Bedrock Model Choice (Claude, Titan, Llama)",
                      "Bedrock Knowledge Bases & Vector Embeddings",
                      "AWS Comprehend, Rekognition & Polly"
                ],
                "milestone": "Build Knowledge-Grounding Retrieval App"
          },
          {
                "week": "Week 5-6",
                "title": "Security, Governance & Exam Prep",
                "topics": [
                      "Data Privacy & Encryption in Generative AI",
                      "Bedrock Guardrails & Model Monitoring",
                      "AWS AI Practitioner Practice Exams"
                ],
                "milestone": "Pass AI Practitioner Certification Simulator"
          }
    ]
  },
  {
    id: "aws-machine-learning-engineer-associate",
    title: "AWS Certified Machine Learning Engineer – Associate",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "8 Weeks",
    students: "6.7K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "ML Associate",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=340&fit=crop&auto=format",
    features: ["SageMaker Model Training & Tuning","Feature Store & Data Engineering","Model Deployment & Endpoint Scaling","MLOps Pipelines & Automated CI/CD"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Data Preparation & Feature Engineering",
                "topics": [
                      "Amazon SageMaker Data Wrangler",
                      "Feature Store Online & Offline Store",
                      "Glue DataBrew for Scalable Cleaning"
                ],
                "milestone": "Construct Production ML Data Pipeline"
          },
          {
                "week": "Week 3-4",
                "title": "Model Training & Tuning",
                "topics": [
                      "Built-in SageMaker Algorithms",
                      "Hyperparameter Tuning Jobs",
                      "Custom PyTorch / HuggingFace Estimators"
                ],
                "milestone": "Train High-Accuracy Predictive Model"
          },
          {
                "week": "Week 5-6",
                "title": "Model Deployment & Serving",
                "topics": [
                      "Real-time, Serverless & Async Endpoints",
                      "Multi-Model Endpoints & Shadow Deployments",
                      "Auto-scaling Inference Infrastructure"
                ],
                "milestone": "Deploy Production Model Serving Endpoint"
          },
          {
                "week": "Week 7-8",
                "title": "MLOps & Operational Governance",
                "topics": [
                      "SageMaker Model Registry & Pipelines CI/CD",
                      "SageMaker Model Monitor (Data & Concept Drift)",
                      "ML Engineer Associate Practice Evaluations"
                ],
                "milestone": "Achieve Full MLOps Pipeline Automation"
          }
    ]
  },
  {
    id: "aws-machine-learning-specialty",
    title: "AWS Certified Machine Learning – Specialty",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "10 Weeks",
    students: "7.8K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Specialty",
    image: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=600&h=340&fit=crop&auto=format",
    features: ["Data Engineering with Glue & Athena","Exploratory Data Analysis & Feature Extraction","Deep Learning Algorithms on SageMaker","Model Monitoring, Drift & Optimization"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Data Engineering for Machine Learning",
                "topics": [
                      "S3 Data Lake Design for ML Datasets",
                      "AWS Glue ETL Jobs & Partitioning",
                      "Kinesis Data Streams & Firehose Ingestion"
                ],
                "milestone": "Build Scalable Big Data Lake for ML"
          },
          {
                "week": "Week 4-6",
                "title": "Exploratory Data Analysis & Modeling",
                "topics": [
                      "Feature Selection & Dimensionality Reduction",
                      "CNNs, RNNs & Transformer Architectures",
                      "Handling Imbalanced Datasets & Metrics (F1, AUC)"
                ],
                "milestone": "Develop Deep Learning Neural Network"
          },
          {
                "week": "Week 7-8",
                "title": "SageMaker Scalability & Distributed Training",
                "topics": [
                      "SageMaker Distributed Training & Model Parallel",
                      "Spot Instances & Managed Warm Pools",
                      "Inference Optimization with AWS TensorRT & Neuron"
                ],
                "milestone": "Run Distributed Model Training at Scale"
          },
          {
                "week": "Week 9-10",
                "title": "Security, Governance & Mock Assessments",
                "topics": [
                      "VPC Only SageMaker Endpoints & KMS Encryption",
                      "Model Explainability with SageMaker Clarify",
                      "ML Specialty Capstone Exam Simulation"
                ],
                "milestone": "Pass Machine Learning Specialty Review"
          }
    ]
  },
  {
    id: "azure-ai-fundamentals-ai900",
    title: "Microsoft Azure AI Fundamentals (AI-900)",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "6 Weeks",
    students: "12.8K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$499",
    originalPrice: "",
    badge: "AI Foundations",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=340&fit=crop&auto=format",
    features: ["Machine Learning Fundamentals on Azure","Azure Computer Vision & OCR","Natural Language Processing (Azure Language)","Azure OpenAI Service & Responsible AI"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "AI Concepts & Azure Machine Learning",
                "topics": [
                      "Types of Machine Learning (Regression, Classification, Clustering)",
                      "Azure Machine Learning Studio & Automated ML",
                      "Responsible AI Principles (Fairness, Reliability, Transparency)"
                ],
                "milestone": "Train No-Code Model on Azure AutoML"
          },
          {
                "week": "Week 3-4",
                "title": "Computer Vision & NLP on Azure",
                "topics": [
                      "Azure Vision Face, OCR & Object Detection",
                      "Azure Language Sentiment & Key Phrase Extraction",
                      "Azure Speech-to-Text & Text-to-Speech"
                ],
                "milestone": "Build Multimodal Cognitive Application"
          },
          {
                "week": "Week 5-6",
                "title": "Azure OpenAI & Exam Simulator",
                "topics": [
                      "Azure OpenAI GPT Models & Prompting",
                      "Document Intelligence (Form Recognizer)",
                      "AI-900 Practice Certification Exams"
                ],
                "milestone": "Score 90%+ on AI-900 Certification Simulator"
          }
    ]
  },
  {
    id: "azure-ai-engineer-associate-ai103",
    title: "Azure AI Engineer Associate (AI-103)",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "8 Weeks",
    students: "7.4K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "AI Engineer",
    image: "https://images.unsplash.com/photo-1507146426996-ef0538821e65?w=600&h=340&fit=crop&auto=format",
    features: ["Azure OpenAI Service Integration","Azure AI Search (RAG Pipelines)","Cognitive Services & Document Intelligence","Conversational AI & Speech Processing"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Azure AI Services & Architecture",
                "topics": [
                      "Securing Azure AI Endpoints with Managed Identities",
                      "Content Safety & Moderation Filters",
                      "Custom Vision Model Training & Export"
                ],
                "milestone": "Deploy Enterprise AI Security Fabric"
          },
          {
                "week": "Week 3-4",
                "title": "Natural Language Processing & Speech",
                "topics": [
                      "Conversational Language Understanding (CLU)",
                      "Azure Speech Translation & Custom Voice",
                      "Azure AI Document Intelligence Custom Extraction"
                ],
                "milestone": "Build Intelligent Document Processing Pipeline"
          },
          {
                "week": "Week 5-6",
                "title": "Generative AI & Retrieval Augmented Generation",
                "topics": [
                      "Azure OpenAI Studio Deployment & Embeddings",
                      "Azure AI Search Hybrid Semantic Search & Vector Indexes",
                      "RAG Pipeline Orchestration with LangChain / Semantic Kernel"
                ],
                "milestone": "Develop Production Enterprise RAG System"
          },
          {
                "week": "Week 7-8",
                "title": "Monitoring, Governance & Assessment",
                "topics": [
                      "Application Insights for AI Telemetry",
                      "Responsible AI Governance & Prompt Defense",
                      "AI-103 Practical Scenario Review"
                ],
                "milestone": "Pass AI-103 Technical Engineer Assessment"
          }
    ]
  },
  {
    id: "google-professional-machine-learning-engineer",
    title: "Google Professional Machine Learning Engineer",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "10 Weeks",
    students: "6.9K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Google ML",
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=600&h=340&fit=crop&auto=format",
    features: ["Vertex AI Platform & Pipelines","Feature Engineering on BigQuery ML","Custom Model Training & Hyperparameter Tuning","Model Monitoring & Responsible AI on GCP"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Data Engineering & BigQuery ML",
                "topics": [
                      "Feature Store on Vertex AI",
                      "BigQuery ML Model Training & Evaluation",
                      "Dataflow Distributed Preprocessing with Apache Beam"
                ],
                "milestone": "Construct BigQuery ML Predictive Engine"
          },
          {
                "week": "Week 4-6",
                "title": "Vertex AI Custom Training & Tuning",
                "topics": [
                      "Custom Docker Containers for Vertex AI",
                      "Hyperparameter Tuning with Vertex Vizier",
                      "Kubeflow Pipelines (Vertex Pipelines)"
                ],
                "milestone": "Deploy Automated Kubeflow ML Workflow"
          },
          {
                "week": "Week 7-8",
                "title": "Serving, Scaling & Model Monitoring",
                "topics": [
                      "Vertex AI Prediction Endpoints & Private Endpoints",
                      "Vertex Model Monitoring (Drift & Skew)",
                      "Model Explainability (SHAP & Integrated Gradients)"
                ],
                "milestone": "Productionize Scalable Vertex AI Service"
          },
          {
                "week": "Week 9-10",
                "title": "GenAI on Vertex & Certification Defense",
                "topics": [
                      "Gemini Models & Vertex AI Search and Conversation",
                      "Responsible AI Practices on Google Cloud",
                      "Professional ML Engineer Capstone Simulation"
                ],
                "milestone": "Pass Google Professional ML Evaluation"
          }
    ]
  },
  {
    id: "google-cloud-generative-ai-leader",
    title: "Google Cloud Generative AI Leader",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "6 Weeks",
    students: "8.3K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "GenAI Leader",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=340&fit=crop&auto=format",
    features: ["Gemini Models & Vertex AI Studio","Prompt Design, Few-Shot & Tuning","Multimodal GenAI & Enterprise Integration","Responsible AI Governance & Evaluation"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Generative AI Foundations & Gemini Models",
                "topics": [
                      "Transformer Architecture & Attention Mechanisms",
                      "Gemini 1.5 Pro / Flash Capabilities & Context Windows",
                      "Vertex AI Studio Prompt Engineering & Grounding"
                ],
                "milestone": "Engineer Enterprise Multimodal Prompt System"
          },
          {
                "week": "Week 3-4",
                "title": "RAG & Vector Search on Google Cloud",
                "topics": [
                      "Vertex AI Vector Search & Embeddings",
                      "Retrieval-Augmented Generation with Enterprise Data",
                      "Model Evaluation & Benchmarking on Vertex"
                ],
                "milestone": "Build Scalable GenAI Knowledge Agent"
          },
          {
                "week": "Week 5-6",
                "title": "Enterprise AI Strategy & Governance",
                "topics": [
                      "Responsible AI Guidelines & Red Teaming",
                      "Compliance, Privacy & Data Ownership",
                      "Generative AI Leadership Project Review"
                ],
                "milestone": "Complete GenAI Enterprise Roadmap Defense"
          }
    ]
  },
  {
    id: "databricks-generative-ai-engineer-associate",
    title: "Databricks Certified Generative AI Engineer Associate",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "8 Weeks",
    students: "5.8K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "GenAI Pro",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=340&fit=crop&auto=format",
    features: ["Databricks Mosaic AI & Vector Search","Retrieval-Augmented Generation (RAG) Architecture","LLM Evaluation with MLflow","Fine-Tuning & Model Serving on Databricks"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Databricks Platform & Generative AI",
                "topics": [
                      "Databricks Workspace, Unity Catalog & Compute",
                      "Mosaic AI Agent Framework Overview",
                      "Foundation Models on Databricks Marketplace"
                ],
                "milestone": "Configure Unity Catalog AI Governance"
          },
          {
                "week": "Week 3-4",
                "title": "RAG Applications & Vector Search",
                "topics": [
                      "Document Ingestion, Chunking & Tokenization",
                      "Databricks Vector Search Endpoints & Sync",
                      "Retrieval Optimization & Context Augmentation"
                ],
                "milestone": "Implement High-Accuracy Databricks RAG"
          },
          {
                "week": "Week 5-6",
                "title": "Evaluation, Guardrails & MLflow",
                "topics": [
                      "MLflow LLM Evaluation Metrics & Judges",
                      "Guardrails & Toxicity Filtering",
                      "Prompt Engineering Optimization"
                ],
                "milestone": "Deploy Automated Model Evaluation Suite"
          },
          {
                "week": "Week 7-8",
                "title": "Serving, Governance & Certification",
                "topics": [
                      "Model Serving Endpoints & Provisioned Throughput",
                      "Lakehouse Monitoring & Feedback Loops",
                      "Generative AI Engineer Associate Mocks"
                ],
                "milestone": "Pass Databricks Generative AI Assessment"
          }
    ]
  },
  {
    id: "databricks-machine-learning-associate",
    title: "Databricks Certified Machine Learning Associate",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "8 Weeks",
    students: "6.2K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Databricks ML",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format",
    features: ["Databricks Feature Store","MLflow Tracking & Model Registry","Hyperopt Distributed Hyperparameter Tuning","Spark MLlib for Scalable Data Processing"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Databricks ML Architecture & Spark",
                "topics": [
                      "Unity Catalog for ML Data Governance",
                      "Delta Lake Tables & ML Data Ingestion",
                      "Data Exploration & Feature Engineering"
                ],
                "milestone": "Build Delta Lake ML Feature Pipeline"
          },
          {
                "week": "Week 3-4",
                "title": "Machine Learning with Spark MLlib",
                "topics": [
                      "Spark ML Pipelines & Transformers",
                      "Classification, Regression & Tree Models",
                      "Feature Scaling & Vector Assembler"
                ],
                "milestone": "Train Distributed Spark ML Pipeline"
          },
          {
                "week": "Week 5-6",
                "title": "Experiment Tracking with MLflow",
                "topics": [
                      "MLflow Runs, Parameters & Artifacts",
                      "Automated Logging with Autolog",
                      "Model Registry Staging & Production Aliases"
                ],
                "milestone": "Automate Experiment Tracking in MLflow"
          },
          {
                "week": "Week 7-8",
                "title": "Model Tuning & Certification Mocks",
                "topics": [
                      "Hyperopt Distributed Search with SparkTrials",
                      "Model Evaluation Metrics & Cross-Validation",
                      "ML Associate Exam Simulator"
                ],
                "milestone": "Pass Databricks ML Associate Assessment"
          }
    ]
  },
  {
    id: "databricks-machine-learning-professional",
    title: "Databricks Certified Machine Learning Professional",
    category: "AI, Machine Learning & GenAI",
    categoryGroup: "AI, Machine Learning & GenAI",
    duration: "10 Weeks",
    students: "5.1K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Dr. Alok Verma",
    mentorCompany: "Principal AI/ML Scientist",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "ML Professional",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=340&fit=crop&auto=format",
    features: ["End-to-End MLOps Automation","Model Monitoring & Drift Detection","Real-Time Model Serving Endpoints","Advanced Lakehouse Data Pipelines"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Feature Engineering & Data Management",
                "topics": [
                      "Feature Store Point-in-Time Joins",
                      "Streaming Feature Tables & Real-Time Updates",
                      "Unity Catalog Lineage & Governance"
                ],
                "milestone": "Construct Real-Time Streaming Feature Store"
          },
          {
                "week": "Week 4-6",
                "title": "Advanced ML Modeling & Deep Learning",
                "topics": [
                      "Distributed Deep Learning with Horovod / Ray",
                      "PyTorch & TensorFlow on Databricks Runtime",
                      "Advanced Custom Python Models with pyfunc"
                ],
                "milestone": "Deploy Custom Distributed Deep Learning Architecture"
          },
          {
                "week": "Week 7-8",
                "title": "Production MLOps & CI/CD",
                "topics": [
                      "Databricks Asset Bundles (DABs) for ML",
                      "Multi-Workspace Model Promotion",
                      "Automated Integration Testing & Retraining"
                ],
                "milestone": "Build GitOps Multi-Environment MLOps Workflow"
          },
          {
                "week": "Week 9-10",
                "title": "Monitoring & Professional Capstone",
                "topics": [
                      "Lakehouse Monitoring for Data & Concept Drift",
                      "A/B Testing with Model Serving Endpoints",
                      "Databricks ML Professional Capstone Defense"
                ],
                "milestone": "Pass Databricks ML Professional Certification"
          }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. 🔐 CYBERSECURITY CERTIFICATIONS (14 Courses - Updated)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "comptia-security-plus",
    title: "CompTIA Security+",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "18.9K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=340&fit=crop&auto=format",
    features: ["Threats, Attacks & Vulnerabilities","Security Operations & Architecture","Identity & Access Management","Incident Response & Governance"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Threats, Attacks & Vulnerabilities",
                "topics": [
                      "Social Engineering, Malware & Phishing Tactics",
                      "Vulnerability Scanning & Asset Hardening",
                      "Threat Actors, Vectors & Intelligence Sources"
                ],
                "milestone": "Execute Vulnerability Audit on Enterprise Topology"
          },
          {
                "week": "Week 3-4",
                "title": "Architecture & Design",
                "topics": [
                      "Enterprise Security Architecture & Cloud Concepts",
                      "Network Security Appliances & Segmentation",
                      "PKI, Certificates & Cryptographic Algorithms"
                ],
                "milestone": "Implement Multi-Tier Secure Network Fabric"
          },
          {
                "week": "Week 5-6",
                "title": "Implementation & Operations",
                "topics": [
                      "Identity and Access Management Protocols",
                      "Endpoint Hardening & Wireless Defense",
                      "Security Assessments & Penetration Testing Tools"
                ],
                "milestone": "Deploy Centralized Access Control & Audit"
          },
          {
                "week": "Week 7-8",
                "title": "Governance, Risk & Exam Simulator",
                "topics": [
                      "Regulatory Compliance (GDPR, HIPAA, NIST)",
                      "Incident Response Lifecycle & Business Continuity",
                      "CompTIA Security+ Full Mock Exams"
                ],
                "milestone": "Achieve 90%+ on Security+ Practice Simulator"
          }
    ]
  },
  {
    id: "comptia-cysa-plus",
    title: "CompTIA CySA+",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "9.4K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Analyst Pro",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop&auto=format",
    features: ["Security Operations & Monitoring","Vulnerability Management & Remediation","Incident Response Protocols","Threat Intelligence Analysis"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Security Operations & Monitoring",
                "topics": [
                      "SIEM Architecture, Log Aggregation & Parsing",
                      "Network Telemetry, PCAP & NetFlow Analysis",
                      "Endpoint Detection and Response (EDR) Tools"
                ],
                "milestone": "Deploy SIEM Monitoring & Alerting Pipeline"
          },
          {
                "week": "Week 3-4",
                "title": "Vulnerability Management",
                "topics": [
                      "Vulnerability Assessment Methodologies & Scanners",
                      "Remediation Planning, Prioritization & SLAs",
                      "Software Security Assurance & Code Auditing"
                ],
                "milestone": "Conduct Enterprise Vulnerability Assessment"
          },
          {
                "week": "Week 5-6",
                "title": "Incident Response & Forensics",
                "topics": [
                      "Incident Response Procedures & Playbooks",
                      "Digital Forensics Artifact Collection & Memory Dumps",
                      "Malware Analysis & Containment Strategies"
                ],
                "milestone": "Execute Incident Response Playbook on Ransomware"
          },
          {
                "week": "Week 7-8",
                "title": "Threat Intelligence & Compliance",
                "topics": [
                      "Threat Hunting Methodologies & MITRE ATT&CK",
                      "Compliance Reporting & Security Metrics",
                      "CySA+ Scenario Practical Examinations"
                ],
                "milestone": "Pass CySA+ Analytical Simulation Review"
          }
    ]
  },
  {
    id: "comptia-pentest-plus",
    title: "CompTIA PenTest+",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "8.1K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$699",
    originalPrice: "",
    badge: "PenTest",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
    features: ["Planning & Scoping Penetration Tests","Information Gathering & Vulnerability Identification","Attacks & Exploitation Techniques","Reporting & Post-Exploitation Remediation"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Planning, Scoping & Reconnaissance",
                "topics": [
                      "Legal Considerations, ROE & Scope Definition",
                      "Passive & Active OSINT Information Gathering",
                      "Network Discovery, Port Scanning & Service Fingerprinting"
                ],
                "milestone": "Draft Rules of Engagement & Target Intelligence"
          },
          {
                "week": "Week 3-4",
                "title": "Vulnerability Identification & Attacks",
                "topics": [
                      "Vulnerability Scanning Tools (Nessus, OpenVAS)",
                      "Network Exploits & Protocol Weaknesses",
                      "Web Application Vulnerabilities (OWASP Top 10)"
                ],
                "milestone": "Discover & Verify High-Severity Exploits"
          },
          {
                "week": "Week 5-6",
                "title": "Exploitation & Post-Exploitation",
                "topics": [
                      "Metasploit Framework, Burp Suite & Custom Payloads",
                      "Privilege Escalation on Windows & Linux",
                      "Pivoting, Lateral Movement & Credential Dumping"
                ],
                "milestone": "Execute Multi-Stage Lateral Penetration"
          },
          {
                "week": "Week 7-8",
                "title": "Reporting, Remediation & Exam Labs",
                "topics": [
                      "Executive & Technical Pentest Documentation",
                      "Remediation Guidance & Re-Testing",
                      "PenTest+ Lab Scenario Evaluations"
                ],
                "milestone": "Deliver Professional Pentest Report"
          }
    ]
  },
  {
    id: "comptia-casp-plus-securityx",
    title: "CompTIA CASP+ / SecurityX",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "10 Weeks",
    students: "5.7K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$699",
    originalPrice: "",
    badge: "Expert",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=340&fit=crop&auto=format",
    features: ["Enterprise Security Architecture","Hybrid Cloud & Virtualization Defense","Cryptographic Techniques & PKI","Security Integration for Complex Environments"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Enterprise Security Architecture",
                "topics": [
                      "Enterprise Architecture Frameworks & Security Integration",
                      "Zero Trust Architecture (ZTA) Principles",
                      "Secure Cloud & Hybrid Infrastructure Design"
                ],
                "milestone": "Design Enterprise Zero-Trust Blueprint"
          },
          {
                "week": "Week 4-6",
                "title": "Security Operations & Cryptography",
                "topics": [
                      "Advanced Cryptography, Post-Quantum & Quantum-Resistant PKI",
                      "Complex Security Assessments & Threat Modeling",
                      "Secure Software Development Lifecycle (SSDLC)"
                ],
                "milestone": "Engineer Resilient Cryptographic Control Suite"
          },
          {
                "week": "Week 7-8",
                "title": "Security Engineering & Technology Integration",
                "topics": [
                      "OT/ICS Security, IoT & Embedded Systems",
                      "Advanced Network Security Appliances & Microsegmentation",
                      "Federated Identity & Directory Services Security"
                ],
                "milestone": "Construct Integrated Security Operations Framework"
          },
          {
                "week": "Week 9-10",
                "title": "Governance, Risk & CASP+ Defense",
                "topics": [
                      "Business Continuity & Disaster Recovery Engineering",
                      "Enterprise Risk Mitigation Strategies",
                      "CASP+ / SecurityX Performance Exam Simulation"
                ],
                "milestone": "Pass CASP+ / SecurityX Capstone Review"
          }
    ]
  },
  {
    id: "comptia-network-plus",
    title: "CompTIA Network+",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "14.1K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$699",
    originalPrice: "",
    badge: "Network Security",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["Networking Fundamentals & Topologies","Network Implementations & Cabling","Network Security Fundamentals & Controls","Troubleshooting Common Network Issues"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Networking Fundamentals & Architecture",
                "topics": [
                      "OSI & TCP/IP Model Layers & Protocol Analysis",
                      "IPv4 Subnetting, CIDR & IPv6 Addressing",
                      "Ethernet Standards & Network Topologies"
                ],
                "milestone": "Design Enterprise Addressing Schema"
          },
          {
                "week": "Week 3-4",
                "title": "Network Implementations & Switching",
                "topics": [
                      "Switches, Routers, Firewalls & Access Points",
                      "VLANs, 802.1Q Tagging & Link Aggregation",
                      "Wireless Standards (802.11ax/Wi-Fi 6) & Frequencies"
                ],
                "milestone": "Configure Segmented Virtual Network"
          },
          {
                "week": "Week 5-6",
                "title": "Network Security & Defense Controls",
                "topics": [
                      "Network Attacks (MITM, DoS, ARP Poisoning)",
                      "Authentication Protocols (RADIUS, TACACS+, 802.1X)",
                      "Firewalls, ACLs & Threat Management"
                ],
                "milestone": "Harden Enterprise Network Infrastructure"
          },
          {
                "week": "Week 7-8",
                "title": "Troubleshooting & Network+ Simulator",
                "topics": [
                      "Structured Troubleshooting Methodology & Tools",
                      "Command-Line Utilities (traceroute, nslookup, tcpdump)",
                      "Network+ Certification Exam Simulation"
                ],
                "milestone": "Pass Network+ Technical Assessment"
          }
    ]
  },
  {
    id: "ceh-certified-ethical-hacker",
    title: "Certified Ethical Hacker (CEH)",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "10 Weeks",
    students: "16.8K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$799",
    originalPrice: "",
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop&auto=format",
    features: ["Reconnaissance & Footprinting Labs","System Hacking & Malware Threats","Web Application Penetration Testing","Cloud & IoT Security Defense"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Ethical Hacking Intro & Reconnaissance",
                "topics": [
                      "Information Gathering & OSINT Methodology",
                      "Network Scanning, Banner Grabbing & Nmap Scripts",
                      "Enumeration (SNMP, LDAP, SMB, RPC)"
                ],
                "milestone": "Generate Comprehensive Target Footprint"
          },
          {
                "week": "Week 3-4",
                "title": "Vulnerability Analysis & System Hacking",
                "topics": [
                      "Vulnerability Assessment & CVE Database Tracking",
                      "Password Cracking & Hash Harvesting",
                      "Privilege Escalation & Maintaining Access (Rootkits)"
                ],
                "milestone": "Perform Controlled System Penetration"
          },
          {
                "week": "Week 5-6",
                "title": "Malware Threats & Sniffing Defense",
                "topics": [
                      "Trojan, Virus, Worm & Ransomware Mechanics",
                      "Packet Sniffing, ARP Spoofing & DHCP Starvation",
                      "Social Engineering Attack Vectors"
                ],
                "milestone": "Analyze Malware Artifacts in Sandbox"
          },
          {
                "week": "Week 7-8",
                "title": "Web App, Wireless & Cloud Hacking",
                "topics": [
                      "SQL Injection, Cross-Site Scripting (XSS) & CSRF",
                      "WPA3 / WPA2 Wireless Vulnerabilities",
                      "Cloud, IoT & OT Threat Surfaces"
                ],
                "milestone": "Exploit Web App Vulnerabilities in Lab"
          },
          {
                "week": "Week 9-10",
                "title": "Evasion, Cryptography & CEH Mocks",
                "topics": [
                      "IDS, IPS, Honeypot & Firewall Evasion",
                      "Symmetric, Asymmetric Encryption & Cryptanalysis",
                      "CEH v12 Full-Length Practice Exams"
                ],
                "milestone": "Achieve CEH Practical Certification Readiness"
          }
    ]
  },
  {
    id: "cissp-mastery",
    title: "CISSP",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "12 Weeks",
    students: "11.2K",
    rating: "5.0",
    level: "Advanced",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$899",
    originalPrice: "",
    badge: "Executive",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=340&fit=crop&auto=format",
    features: ["Security & Risk Management (Domain 1)","Asset Security & Cryptography","Security Architecture & Engineering","Communication & Network Security"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Security & Risk Management & Asset Security",
                "topics": [
                      "CIA Triad, Security Governance & Compliance Laws",
                      "Risk Assessment (Quantitative/Qualitative) & Business Continuity",
                      "Data Classification, Privacy & Retention Policies"
                ],
                "milestone": "Develop Enterprise Information Security Policy"
          },
          {
                "week": "Week 4-6",
                "title": "Security Architecture & Network Security",
                "topics": [
                      "Security Models (Bell-LaPadula, Biba) & Cryptography",
                      "Secure Network Architecture & Perimeter Protection",
                      "Physical & Environmental Security Controls"
                ],
                "milestone": "Design Comprehensive Security Architecture"
          },
          {
                "week": "Week 7-9",
                "title": "Identity, Access & Security Operations",
                "topics": [
                      "Identity and Access Management Architectures",
                      "Security Operations, Incident Management & Digital Forensics",
                      "Disaster Recovery Testing & Investigations"
                ],
                "milestone": "Establish Security Operations Framework"
          },
          {
                "week": "Week 10-12",
                "title": "Software Security & CISSP Executive Mocks",
                "topics": [
                      "Secure Software Development Life Cycle (SDLC)",
                      "Maturity Models & Threat Modeling",
                      "Full-Length 150-Question CAT Exam Simulations"
                ],
                "milestone": "Pass CISSP Comprehensive Assessment Review"
          }
    ]
  },
  {
    id: "cism-management",
    title: "CISM",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "8.6K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$699",
    originalPrice: "",
    badge: "Governance",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=340&fit=crop&auto=format",
    features: ["Information Security Governance","Information Risk Management","Information Security Program Development","Incident Management & Forensics"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Information Security Governance",
                "topics": [
                      "Enterprise Governance Frameworks (COBIT, ISO 27001)",
                      "Security Strategy Alignment with Business Goals",
                      "Roles, Responsibilities & Metrics for Executives"
                ],
                "milestone": "Develop Executive Governance Framework"
          },
          {
                "week": "Week 3-4",
                "title": "Information Risk Management",
                "topics": [
                      "Risk Identification, Analysis & Evaluation Methodologies",
                      "Risk Treatment Options & Risk Monitoring",
                      "Integration of Risk Management into SDLC"
                ],
                "milestone": "Conduct Enterprise Information Risk Audit"
          },
          {
                "week": "Week 5-6",
                "title": "Security Program Development & Management",
                "topics": [
                      "Security Program Resources & Operational Metrics",
                      "Security Architecture Controls & Countermeasures",
                      "Security Awareness Training & Vendor Security Management"
                ],
                "milestone": "Draft Information Security Program Plan"
          },
          {
                "week": "Week 7-8",
                "title": "Incident Management & CISM Exam Mocks",
                "topics": [
                      "Incident Response Plan & Operational Playbooks",
                      "Post-Incident Analysis & Root-Cause Remediation",
                      "CISM Official Style Exam Simulations"
                ],
                "milestone": "Score 85%+ on CISM Simulation Exam"
          }
    ]
  },
  {
    id: "cisa-auditing",
    title: "CISA",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "7.9K",
    rating: "4.8",
    level: "Advanced",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$699",
    originalPrice: "",
    badge: "Audit Lead",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&h=340&fit=crop&auto=format",
    features: ["Information System Auditing Process","Governance & Management of IT","Information Systems Acquisition & Development","Protection of Information Assets"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Information System Auditing Process",
                "topics": [
                      "ISACA Audit Standards, Guidelines & Code of Ethics",
                      "Risk-Based Audit Planning & Scoping",
                      "Audit Evidence Collection, Sampling & Data Analytics"
                ],
                "milestone": "Deliver Professional IS Audit Charter"
          },
          {
                "week": "Week 3-4",
                "title": "Governance & Management of IT",
                "topics": [
                      "IT Strategy Committee Oversight & Enterprise Governance",
                      "IT Resource Optimization & IT Policies/Procedures",
                      "Business Continuity Management (BCM) & Resiliency"
                ],
                "milestone": "Evaluate IT Governance Compliance Structure"
          },
          {
                "week": "Week 5-6",
                "title": "Systems Acquisition, Development & Ops",
                "topics": [
                      "Project Management Controls & SDLC Audits",
                      "Application Controls & Post-Implementation Review",
                      "IT Service Operations & Hardware Asset Management"
                ],
                "milestone": "Perform Systems Development Life Cycle Audit"
          },
          {
                "week": "Week 7-8",
                "title": "Protection of Information Assets & Mocks",
                "topics": [
                      "Logical & Physical Access Controls Auditing",
                      "Network Security, Cryptography & Disaster Recovery Auditing",
                      "CISA Full Mock Exam Evaluations"
                ],
                "milestone": "Achieve CISA Certification Readiness"
          }
    ]
  },
  {
    id: "crisc-risk-information-systems-control",
    title: "CRISC",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "6.4K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$799",
    originalPrice: "",
    badge: "Risk Expert",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop&auto=format",
    features: ["Governance & IT Risk Management","IT Risk Assessment & Threat Modeling","Risk Response & Reporting","Information Technology & Security Controls"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Governance & IT Risk Strategy",
                "topics": [
                      "Organizational Governance & Risk Appetite",
                      "Three Lines of Defense Model",
                      "Risk Management Policies & Standards"
                ],
                "milestone": "Formulate Enterprise Risk Appetite Statement"
          },
          {
                "week": "Week 3-4",
                "title": "IT Risk Assessment & Analysis",
                "topics": [
                      "Threat & Vulnerability Identification",
                      "Risk Scenarios & Quantitative Modeling (FAIR)",
                      "Business Impact Analysis (BIA) Alignment"
                ],
                "milestone": "Construct Quantitative Risk Model"
          },
          {
                "week": "Week 5-6",
                "title": "Risk Response & Reporting",
                "topics": [
                      "Risk Treatment (Avoid, Mitigate, Transfer, Accept)",
                      "Control Design & Key Risk Indicators (KRIs)",
                      "Management Reporting & Risk Profiles"
                ],
                "milestone": "Design Enterprise Key Risk Indicator (KRI) Matrix"
          },
          {
                "week": "Week 7-8",
                "title": "Information Technology & Security Controls",
                "topics": [
                      "Continuous Monitoring of Controls",
                      "Control Testing Methodologies",
                      "CRISC Practice Examination Simulations"
                ],
                "milestone": "Pass CRISC Certification Simulator"
          }
    ]
  },
  {
    id: "ccsp-cloud-security",
    title: "CCSP",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "10 Weeks",
    students: "7.7K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$799",
    originalPrice: "",
    badge: "Cloud Security",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["Cloud Data Security & Encryption","Cloud Platform & Infrastructure Security","Cloud Application Security (SDLC)","Cloud Security Operations & Compliance"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Cloud Architecture Concepts & Data Security",
                "topics": [
                      "Cloud Service Provider Models & Shared Responsibility",
                      "Cloud Data Lifecycle & Data Discovery/Classification",
                      "Cryptographic Architecture & Tokenization in Cloud"
                ],
                "milestone": "Design Cloud Data Security Strategy"
          },
          {
                "week": "Week 4-6",
                "title": "Cloud Platform & Application Security",
                "topics": [
                      "Cloud Infrastructure Components & Virtualization Hardening",
                      "Business Continuity & Disaster Recovery in Cloud",
                      "Cloud Application Security & Secure SDLC Verification"
                ],
                "milestone": "Audit Secure Multi-Cloud Platform Architecture"
          },
          {
                "week": "Week 7-8",
                "title": "Cloud Security Operations",
                "topics": [
                      "Physical & Logical Infrastructure for Cloud",
                      "Incident Investigation & Forensic Readiness in Cloud",
                      "Change & Configuration Management in Cloud"
                ],
                "milestone": "Implement Cloud Forensics & Incident Readiness"
          },
          {
                "week": "Week 9-10",
                "title": "Legal, Risk & Compliance & CCSP Mocks",
                "topics": [
                      "International Laws, Regulations (ISO 27017, FedRAMP)",
                      "Vendor Risk Assessments & SOC Reports",
                      "CCSP Full Simulation Examinations"
                ],
                "milestone": "Pass CCSP Comprehensive Certification Review"
          }
    ]
  },
  {
    id: "giac-penetration-tester-gpen",
    title: "GIAC Penetration Tester (GPEN)",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "10 Weeks",
    students: "5.3K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$699",
    originalPrice: "",
    badge: "Hands-on PenTest",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
    features: ["Comprehensive Pentest Methodologies","Advanced Password Attacks & Hashes","Exploitation & Pivoting on Enterprise Networks","Post-Exploitation Data Harvesting & Reporting"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Pentest Planning & OSINT Reconnaissance",
                "topics": [
                      "Penetration Testing Scoping & Legal Compliance",
                      "Advanced OSINT & Domain Intelligence",
                      "Port Scanning, Host Discovery & Service Audits"
                ],
                "milestone": "Perform Target Identification & Scope Verification"
          },
          {
                "week": "Week 4-6",
                "title": "Target Exploitation & Password Cracking",
                "topics": [
                      "Advanced Password Hashes & Kerberoasting",
                      "Exploitation via Metasploit & PowerShell",
                      "Web Application Attacks Against Enterprise Portals"
                ],
                "milestone": "Execute Kerberos & Active Directory Attacks"
          },
          {
                "week": "Week 7-8",
                "title": "Pivoting, Persistence & Lateral Movement",
                "topics": [
                      "SSH/SOCKS Pivoting & Proxychains",
                      "Post-Exploitation Persistence & Golden Ticket Generation",
                      "Bypassing Endpoint Defenses & AppLocker"
                ],
                "milestone": "Complete Deep Enterprise Lateral Movement"
          },
          {
                "week": "Week 9-10",
                "title": "Documentation & GPEN Practical Simulator",
                "topics": [
                      "Technical Pentest Report Writing & Evidence Handling",
                      "Remediation Roadmaps for Engineering Teams",
                      "GPEN Hands-On Challenge Simulator"
                ],
                "milestone": "Deliver Full GIAC Standard Pentest Report"
          }
    ]
  },
  {
    id: "palo-alto-firewall",
    title: "Palo Alto Networks Cybersecurity Certifications",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "9.8K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$699",
    originalPrice: "",
    badge: "Next-Gen Firewall",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&auto=format",
    features: ["PAN-OS Next-Gen Firewall Configuration","App-ID, User-ID & Content-ID Policies","Panorama Centralized Administration","GlobalProtect VPN & SSL Decryption"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "PAN-OS Architecture & Core Configuration",
                "topics": [
                      "Palo Alto Single-Pass Parallel Processing (SP3)",
                      "Interface Configuration, Virtual Routers & Security Zones",
                      "Initial Management & Licensing"
                ],
                "milestone": "Deploy Initial Active PAN-OS Firewall"
          },
          {
                "week": "Week 3-4",
                "title": "App-ID & User-ID Implementation",
                "topics": [
                      "Application-Based Security Policies with App-ID",
                      "Active Directory User-ID Integration",
                      "Application Shift & Decryption Policies (Inbound/Outbound)"
                ],
                "milestone": "Enforce User-ID & Application-Aware Policies"
          },
          {
                "week": "Week 5-6",
                "title": "Content-ID Threat Prevention & GlobalProtect",
                "topics": [
                      "Antivirus, Anti-Spyware & Vulnerability Protection Profiles",
                      "WildFire Cloud Sandboxing & URL Filtering",
                      "GlobalProtect Remote Access & Clientless VPN"
                ],
                "milestone": "Configure Threat Prevention & Secure VPN Gateway"
          },
          {
                "week": "Week 7-8",
                "title": "Panorama Management & PCNSA/PCNSE Mocks",
                "topics": [
                      "Panorama Device Groups & Templates",
                      "High Availability (Active/Passive & Active/Active)",
                      "Palo Alto Networks Certification Mocks"
                ],
                "milestone": "Complete Panorama Multi-Device Lab Review"
          }
    ]
  },
  {
    id: "fortinet-nse-fcp-cybersecurity",
    title: "Fortinet NSE / FCP Cybersecurity",
    category: "Cybersecurity",
    categoryGroup: "Cybersecurity",
    duration: "8 Weeks",
    students: "8.7K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Vikram Malhotra",
    mentorCompany: "Enterprise Security Architect, CISSP/CEH",
    mentorExp: "12+ Years",
    language: "English",
    price: "$699",
    originalPrice: "",
    badge: "Fortinet Pro",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["FortiGate Next-Generation Firewall Setup","Security Fabric & Threat Intelligence","SSL Inspection & Web Filtering Profiles","IPsec & SSL VPN Enterprise Configuration"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "FortiGate System & Network Setup",
                "topics": [
                      "FortiOS Architecture & Packet Flow",
                      "Interfaces, Routing Protocols & VLANs",
                      "Firewall Policies & NAT Modes (SNAT/DNAT)"
                ],
                "milestone": "Configure Enterprise FortiGate Gateway"
          },
          {
                "week": "Week 3-4",
                "title": "Security Fabric & Inspection Profiles",
                "topics": [
                      "Fortinet Security Fabric Telemetry",
                      "SSL/TLS Full Inspection & Certificate Management",
                      "Antivirus, IPS & Application Control Profiles"
                ],
                "milestone": "Deploy Deep SSL Inspection Fabric"
          },
          {
                "week": "Week 5-6",
                "title": "Authentication, VPN & High Availability",
                "topics": [
                      "FSSO (Fortinet Single Sign-On) & LDAP",
                      "Site-to-Site IPsec VPN & Redundant Tunnels",
                      "SSL VPN Portals & FortiClient Deployment"
                ],
                "milestone": "Build Resilient High-Availability IPsec Mesh"
          },
          {
                "week": "Week 7-8",
                "title": "FortiManager, FortiAnalyzer & FCP Mocks",
                "topics": [
                      "Centralized Log Analysis on FortiAnalyzer",
                      "Device Configuration Management on FortiManager",
                      "Fortinet Certified Professional Certification Mocks"
                ],
                "milestone": "Pass Fortinet Certified Professional Assessment"
          }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. 🌐 NETWORKING CERTIFICATIONS (12 Courses - Updated)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "cisco-ccna",
    title: "Cisco CCNA",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "8 Weeks",
    students: "24.5K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Essential",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["IPv4 / IPv6 Subnetting & Routing","VLANs, Trunks & Spanning Tree (STP)","OSPF Dynamic Routing Protocols","Network Automation & Programmability (REST APIs)"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Network Fundamentals & IP Addressing",
                "topics": [
                      "TCP/IP & OSI Models, Packet Headers & Encapsulation",
                      "IPv4 Subnetting (FLSM & VLSM) & IPv6 Addressing",
                      "Cisco IOS CLI Navigation & Initial Switch/Router Config"
                ],
                "milestone": "Deploy Basic Routed & Switched Enterprise Network"
          },
          {
                "week": "Week 3-4",
                "title": "LAN Switching Technologies",
                "topics": [
                      "VLANs, 802.1Q Trunks & Inter-VLAN Routing",
                      "Spanning Tree Protocol (STP, RSTP) & Loop Prevention",
                      "EtherChannel (LACP & PAgP) Aggregation"
                ],
                "milestone": "Build Redundant Layer 2 Campus Core"
          },
          {
                "week": "Week 5-6",
                "title": "Routing Protocols & IP Services",
                "topics": [
                      "Static Routing & Single-Area OSPFv2 / OSPFv3",
                      "DHCP, DNS, NTP & Syslog Protocols",
                      "NAT & Access Control Lists (Standard/Extended ACLs)"
                ],
                "milestone": "Implement High-Performance Dynamic Routing"
          },
          {
                "week": "Week 7-8",
                "title": "Security, Automation & CCNA Practice Exams",
                "topics": [
                      "Port Security, DHCP Snooping & DAI",
                      "Software-Defined Networking (Cisco DNA Center, REST APIs)",
                      "Full CCNA 200-301 Certification Simulator Exams"
                ],
                "milestone": "Score 90%+ on CCNA Comprehensive Simulation"
          }
    ]
  },
  {
    id: "cisco-ccnp-enterprise",
    title: "Cisco CCNP Enterprise",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "10 Weeks",
    students: "12.8K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Enterprise Core",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&auto=format",
    features: ["BGP, EIGRP & Advanced OSPF Routing","Cisco SD-WAN & SD-Access Architecture","QoS, IP SLA & Network Assurance","Python & Ansible Network Automation"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Enterprise Routing Protocols (ENCOR)",
                "topics": [
                      "Advanced Multi-Area OSPF & LSA Types",
                      "EIGRP for IPv4/IPv6 & Named Configurations",
                      "BGP Path Selection, Neighbor Adjacencies & Communities"
                ],
                "milestone": "Architect Complex Multi-Protocol Enterprise Core"
          },
          {
                "week": "Week 4-6",
                "title": "Enterprise Switching, Wireless & Virtualization",
                "topics": [
                      "VRF (Virtual Routing and Forwarding) & GRE Tunnels",
                      "LISP (Locator/ID Separation Protocol) & VXLAN",
                      "Cisco Catalyst 9000 Architecture & Wireless Controllers"
                ],
                "milestone": "Build Overlay Fabric Network Architecture"
          },
          {
                "week": "Week 7-8",
                "title": "Cisco SD-WAN & Network Assurance",
                "topics": [
                      "SD-WAN Components (vManage, vSmart, vBond, vEdge)",
                      "Zero-Touch Provisioning (ZTP) & Overlay Routing (OMP)",
                      "QoS (Policing, Shaping, Queuing) & IP SLA Tracking"
                ],
                "milestone": "Deploy Enterprise SD-WAN Multi-Site Fabric"
          },
          {
                "week": "Week 9-10",
                "title": "Automation, Programmability & CCNP Mocks",
                "topics": [
                      "Python Network Automation (Netmiko, Paramiko)",
                      "RESTCONF & NETCONF with YANG Data Models",
                      "CCNP Enterprise ENCOR & ENARSI Practice Exams"
                ],
                "milestone": "Achieve CCNP Enterprise Technical Mastery"
          }
    ]
  },
  {
    id: "cisco-ccnp-security",
    title: "Cisco CCNP Security",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "10 Weeks",
    students: "8.9K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Security Core",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop&auto=format",
    features: ["Cisco ASA & Firepower Next-Gen Firewalls","Cisco ISE (Identity Services Engine) & 802.1X","VPN Solutions (Site-to-Site & Remote Access)","Endpoint & Cloud Threat Defense"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Cisco Security Core & Next-Gen Firewalls",
                "topics": [
                      "Cisco ASA Firewall Routing & NAT Rules",
                      "Firepower Threat Defense (FTD) Architecture",
                      "Firepower Management Center (FMC) Policies"
                ],
                "milestone": "Deploy Firepower Next-Gen Firewall Cluster"
          },
          {
                "week": "Week 4-6",
                "title": "Cisco ISE & Identity Management",
                "topics": [
                      "Cisco ISE Node Personas & Deployment Models",
                      "802.1X Authentication & MAB for Campus Access",
                      "TrustSec Security Group Tags (SGT) & DACLs"
                ],
                "milestone": "Enforce Dynamic Network Access via Cisco ISE"
          },
          {
                "week": "Week 7-8",
                "title": "Secure VPN & Remote Access",
                "topics": [
                      "AnyConnect SSL & IPsec Remote Access VPN",
                      "FlexVPN & DMVPN Enterprise Topologies",
                      "Cisco Umbrella & Cloud Email Security"
                ],
                "milestone": "Build Resilient Global Remote Access Fabric"
          },
          {
                "week": "Week 9-10",
                "title": "Network Security Automation & CCNP Mocks",
                "topics": [
                      "Cisco Security APIs & Threat Response Automation",
                      "Stealthwatch / Secure Network Analytics Integration",
                      "CCNP Security SCOR Comprehensive Simulation"
                ],
                "milestone": "Pass CCNP Security Technical Defense"
          }
    ]
  },
  {
    id: "cisco-ccnp-data-center",
    title: "Cisco CCNP Data Center",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "10 Weeks",
    students: "7.4K",
    rating: "4.8",
    level: "Advanced",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Data Center",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&auto=format",
    features: ["Nexus Switching & NX-OS Architecture","Cisco ACI (Application Centric Infrastructure)","Storage Area Networking (SAN & Fibre Channel)","Data Center Virtualization & Automation"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Data Center Nexus Switching (DCCOR)",
                "topics": [
                      "Nexus 9000, 7000 & 5000 Switch Architecture",
                      "Virtual Port Channels (vPC) & FabricPath",
                      "VXLAN EVPN Control Plane Configuration"
                ],
                "milestone": "Deploy High-Speed Spine-and-Leaf Fabric"
          },
          {
                "week": "Week 4-6",
                "title": "Cisco ACI Architecture & Policy",
                "topics": [
                      "APIC Controller Cluster Setup & Fabric Discovery",
                      "ACI Logical Construct (Tenant, VRF, BD, EPG)",
                      "Contracts, Filters & Service Graph Redirection"
                ],
                "milestone": "Configure Enterprise Multi-Tenant Cisco ACI Fabric"
          },
          {
                "week": "Week 7-8",
                "title": "Storage Networking & UCS Compute",
                "topics": [
                      "Fibre Channel (FC) & FCoE Fabric Configuration",
                      "MDS 9000 SAN Switches & VSAN Allocation",
                      "Cisco UCS Manager, Service Profiles & Boot from SAN"
                ],
                "milestone": "Build Redundant Unified Compute & Storage Mesh"
          },
          {
                "week": "Week 9-10",
                "title": "Data Center Automation & Exam Mocks",
                "topics": [
                      "Python with NX-API & ACI REST API",
                      "Ansible Modules for Data Center Management",
                      "CCNP Data Center Practice Evaluations"
                ],
                "milestone": "Achieve CCNP Data Center Certification Readiness"
          }
    ]
  },
  {
    id: "cisco-ccie-enterprise-infrastructure",
    title: "Cisco CCIE Enterprise Infrastructure",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "12 Weeks",
    students: "5.2K",
    rating: "5.0",
    level: "Advanced",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Elite CCIE",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["Complex Campus LAN & Core Architectures","Multi-Protocol BGP & MPLS VPNs","SD-WAN Enterprise Deployment & Migration","Automated Programmability & Telemetry"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Dual-Stack Complex Campus Infrastructure",
                "topics": [
                      "Layer 2 Resiliency & Multi-Chassis EtherChannels",
                      "BGP Confederation, Route Reflectors & Traffic Engineering",
                      "OSPFv3 & EIGRP Advanced Redistribution"
                ],
                "milestone": "Architect Resilient Enterprise Core Network"
          },
          {
                "week": "Week 4-6",
                "title": "MPLS Layer 3 VPNs & DMVPN Topologies",
                "topics": [
                      "MP-BGP Label Distribution Protocol (LDP)",
                      "MPLS L3VPN Inter-AS (Option A, B, C)",
                      "DMVPN Phase 3 with NHRP & Dynamic Routing"
                ],
                "milestone": "Deploy Enterprise Service Provider Backbone"
          },
          {
                "week": "Week 7-9",
                "title": "Software-Defined Enterprise (SD-Access & SD-WAN)",
                "topics": [
                      "Cisco Catalyst Center / DNA Center Automation",
                      "VXLAN Fabric Overlay with LISP Control Plane",
                      "Advanced SD-WAN Policy Configuration & Multi-Cloud Connect"
                ],
                "milestone": "Deploy End-to-End Enterprise SD Fabric"
          },
          {
                "week": "Week 10-12",
                "title": "Network Programmability & CCIE Lab Simulators",
                "topics": [
                      "Model-Driven Telemetry & gRPC Streaming",
                      "Python Automation for Enterprise Network Validation",
                      "8-Hour Comprehensive Hands-On CCIE Lab Simulation"
                ],
                "milestone": "Complete Full CCIE Enterprise Practical Defense"
          }
    ]
  },
  {
    id: "cisco-ccie-security",
    title: "Cisco CCIE Security",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "12 Weeks",
    students: "4.8K",
    rating: "5.0",
    level: "Advanced",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Elite Security",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop&auto=format",
    features: ["Zero-Trust Network Architecture","Advanced Cisco ISE & TrustSec Implementation","Firepower Threat Defense Clustering","Security Automation, Scripting & Forensics"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Perimeter Security & Firepower Clustering",
                "topics": [
                      "Firepower High Availability & Multi-Instance FTD",
                      "Advanced Snort 3 Inspection Rules & Threat Intelligence",
                      "Site-to-Site & Remote Access Crypto Architecture"
                ],
                "milestone": "Deploy Clustered Enterprise Firewall Grid"
          },
          {
                "week": "Week 4-6",
                "title": "Advanced Identity, Zero-Trust & TrustSec",
                "topics": [
                      "Distributed ISE Deployment with pxGrid Integration",
                      "MACsec (802.1AE) Campus Encryption",
                      "TrustSec SGT Matrix Enforcement Across Fabrics"
                ],
                "milestone": "Build End-to-End Dynamic TrustSec Security"
          },
          {
                "week": "Week 7-9",
                "title": "Cloud Security, Endpoint & Visibility",
                "topics": [
                      "Cisco Umbrella DNS & Cloud-Delivered Firewall",
                      "Cisco Secure Endpoint (AMP) & Threat Response",
                      "Stealthwatch Flow Sensor Deployment & Telemetry"
                ],
                "milestone": "Integrate Global Cloud Security Architecture"
          },
          {
                "week": "Week 10-12",
                "title": "Security Programmability & CCIE Lab Mocks",
                "topics": [
                      "Automating Security Workflows with Firepower APIs",
                      "Python Scripting for Dynamic Access Mitigation",
                      "Intensive 8-Hour CCIE Security Lab Simulations"
                ],
                "milestone": "Pass CCIE Security Practical Scenario Review"
          }
    ]
  },
  {
    id: "cisco-devnet-associate",
    title: "Cisco DevNet Associate",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "8 Weeks",
    students: "9.3K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "DevNet Pro",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
    features: ["Network Programmability & Python","Cisco REST APIs (DNA Center, Meraki, ACI)","Docker Containers & Microservices","CI/CD & Git for Network Operations (NetDevOps)"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Software Development & Network Basics",
                "topics": [
                      "Python Data Structures (Lists, Dicts) & JSON/YAML/XML",
                      "Git Version Control & Branching Workflows",
                      "API Authentication (Basic, API Keys, OAuth2)"
                ],
                "milestone": "Develop Automated Network Parsing Scripts"
          },
          {
                "week": "Week 3-4",
                "title": "Cisco Platforms & REST APIs",
                "topics": [
                      "Cisco Catalyst Center (DNA Center) REST APIs",
                      "Cisco Meraki Dashboard API Automation",
                      "Cisco ACI & Webex Teams Bot Integration"
                ],
                "milestone": "Build Automated Device Provisioning Script"
          },
          {
                "week": "Week 5-6",
                "title": "Network Programmability & YANG Models",
                "topics": [
                      "NETCONF Protocols & SSH Subsystems",
                      "RESTCONF HTTP Operations",
                      "YANG Data Modeling with pyang"
                ],
                "milestone": "Deploy Model-Driven Configuration Manager"
          },
          {
                "week": "Week 7-8",
                "title": "Application Deployment, Security & DevNet Mocks",
                "topics": [
                      "Docker Containerization & Edge Microservices",
                      "CI/CD Pipelines for NetDevOps (GitHub Actions)",
                      "DevNet Associate 200-901 Practice Exams"
                ],
                "milestone": "Pass DevNet Associate Certification Simulator"
          }
    ]
  },
  {
    id: "cisco-cyberops-associate",
    title: "Cisco CyberOps Associate",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "8 Weeks",
    students: "8.7K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "CyberOps",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=340&fit=crop&auto=format",
    features: ["SOC Operations & Incident Management","Windows & Linux Host Analysis","Network Intrusion Analysis & Wireshark","Attack Methodologies & Defense Tactics"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Security Concepts & SOC Monitoring",
                "topics": [
                      "Threat Modeling & Information Security Concepts",
                      "Access Control Models & SOC Metrics",
                      "Cryptography & Public Key Infrastructure"
                ],
                "milestone": "Design SOC Incident Intake Workflow"
          },
          {
                "week": "Week 3-4",
                "title": "Network Intrusion Analysis",
                "topics": [
                      "Wireshark Packet Analysis & Protocol Decoding",
                      "Snort / Suricata Rule Analysis & Signatures",
                      "NetFlow & IPFIX Telemetry Analysis"
                ],
                "milestone": "Detect Advanced Network Infiltration"
          },
          {
                "week": "Week 5-6",
                "title": "Host-Based Security & Analysis",
                "topics": [
                      "Windows Event Logs & Sysmon Analysis",
                      "Linux Log Files, Process Tracking & Forensics",
                      "Malware Analysis & Endpoint Investigation"
                ],
                "milestone": "Investigate Compromised Host System"
          },
          {
                "week": "Week 7-8",
                "title": "Security Policies, Procedures & Exam Mocks",
                "topics": [
                      "NIST 800-61 Incident Handling Guide",
                      "CSIRT Roles & Regulatory Compliance",
                      "CyberOps Associate 200-201 Simulation Exams"
                ],
                "milestone": "Pass CyberOps Associate Certification Review"
          }
    ]
  },
  {
    id: "fortinet-certified-fundamentals-cybersecurity",
    title: "Fortinet Certified Fundamentals in Cybersecurity",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "6 Weeks",
    students: "11.1K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Fortinet Fundamentals",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
    features: ["Evolution of Cybersecurity Threats","Network Security Fundamentals","Cloud Security Principles","Security Operations Concepts"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "Cybersecurity Threat Landscape",
                "topics": [
                      "History & Evolution of Cyber Threats",
                      "Threat Actors, Motivations & Vectors",
                      "Social Engineering, Ransomware & Phishing"
                ],
                "milestone": "Identify Enterprise Threat Surfaces"
          },
          {
                "week": "Week 3-4",
                "title": "Network Security & Architecture",
                "topics": [
                      "Firewalls, Routers, Switches & Topologies",
                      "Virtual Private Networks (VPN) Principles",
                      "Authentication, Authorization & Accounting (AAA)"
                ],
                "milestone": "Map Network Defense Topography"
          },
          {
                "week": "Week 5-6",
                "title": "Cloud Security, SOC & Exam Prep",
                "topics": [
                      "Cloud Service Models & Security Risks",
                      "Security Operations Center (SOC) Functions",
                      "Fortinet Certified Fundamentals Practice Evaluation"
                ],
                "milestone": "Achieve Fortinet Fundamentals Certification"
          }
    ]
  },
  {
    id: "fortinet-certified-associate-cybersecurity",
    title: "Fortinet Certified Associate Cybersecurity",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "8 Weeks",
    students: "9.6K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Fortinet Associate",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&auto=format",
    features: ["FortiGate Operations & Administration","Firewall Policies & NAT Configuration","User Authentication & Web Filtering","Threat Defense & Security Fabric"],
    roadmap: [
          {
                "week": "Week 1-2",
                "title": "FortiGate Architecture & Operation",
                "topics": [
                      "FortiOS Overview & GUI/CLI Navigation",
                      "Interface Configuration & Administrative Access",
                      "Routing Fundamentals on FortiGate"
                ],
                "milestone": "Deploy Baseline FortiGate Appliance"
          },
          {
                "week": "Week 3-4",
                "title": "Security Policies & Network Address Translation",
                "topics": [
                      "Firewall Policy Rules & Ordering",
                      "Source & Destination NAT (Virtual IPs)",
                      "User Authentication & Captive Portal"
                ],
                "milestone": "Configure Granular Access & NAT Policies"
          },
          {
                "week": "Week 5-6",
                "title": "Security Profiles & Inspection",
                "topics": [
                      "Antivirus & Intrusion Prevention (IPS)",
                      "Web Filtering & Application Control",
                      "SSL/TLS Certificate Inspection Options"
                ],
                "milestone": "Implement Deep Security Inspection"
          },
          {
                "week": "Week 7-8",
                "title": "VPNs, Security Fabric & Associate Mocks",
                "topics": [
                      "IPsec VPN Setup & Diagnostics",
                      "Fortinet Security Fabric Overview",
                      "Fortinet Certified Associate Exam Simulator"
                ],
                "milestone": "Pass Fortinet Certified Associate Assessment"
          }
    ]
  },
  {
    id: "fortinet-certified-professional",
    title: "Fortinet Certified Professional",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "10 Weeks",
    students: "8.2K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Fortinet Professional",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=340&fit=crop&auto=format",
    features: ["FortiGate Security & Routing Deep Dive","SD-WAN Implementation & Path Steering","FortiAnalyzer Logging & Reporting","FortiManager Centralized Configuration"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Advanced FortiGate Security & Routing",
                "topics": [
                      "BGP, OSPF & Advanced Routing on FortiOS",
                      "Transparent Mode & High Availability (FGCP/FGSP)",
                      "Hardware Acceleration (CP9/NP7)"
                ],
                "milestone": "Deploy High-Throughput Redundant FortiGate Core"
          },
          {
                "week": "Week 4-6",
                "title": "Enterprise Fortinet SD-WAN",
                "topics": [
                      "SD-WAN Rules, SLA Targets & Path Steering",
                      "Overlay Routing Protocol (BGP on ADVPN)",
                      "Application Identification & Health Checks"
                ],
                "milestone": "Architect Enterprise Fortinet SD-WAN Network"
          },
          {
                "week": "Week 7-8",
                "title": "Centralized Management & Analytics",
                "topics": [
                      "FortiManager Device Provisioning & Scripts",
                      "Policy Packages & Installation Workflows",
                      "FortiAnalyzer Event Management & Playbooks"
                ],
                "milestone": "Implement Centralized Fabric Operations"
          },
          {
                "week": "Week 9-10",
                "title": "Troubleshooting & Professional Certification",
                "topics": [
                      "Packet Capture & Flow Trace Diagnostics",
                      "Diagnostic Commands & Log Analysis",
                      "Fortinet Certified Professional Mocks"
                ],
                "milestone": "Pass Fortinet Certified Professional Defense"
          }
    ]
  },
  {
    id: "fortinet-certified-solution-specialist",
    title: "Fortinet Certified Solution Specialist",
    category: "Networking",
    categoryGroup: "Networking",
    duration: "10 Weeks",
    students: "6.1K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Ramesh Kulkarni",
    mentorCompany: "Cisco Certified Internetwork Expert CCIE #54890",
    mentorExp: "14+ Years",
    language: "English",
    price: "$599",
    originalPrice: "",
    badge: "Fortinet Specialist",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=340&fit=crop&auto=format",
    features: ["Enterprise ZTNA Architecture","Secure SD-WAN Troubleshooting & Optimization","Advanced Threat Protection & Sandboxing","Cloud Security Fabric Integration"],
    roadmap: [
          {
                "week": "Week 1-3",
                "title": "Zero Trust Network Access (ZTNA)",
                "topics": [
                      "FortiClient EMS Device Tagging & Posture Check",
                      "ZTNA Application Gateways & Access Proxies",
                      "Clientless ZTNA vs Agent-Based Architecture"
                ],
                "milestone": "Deploy Enterprise Zero-Trust Access Proxy"
          },
          {
                "week": "Week 4-6",
                "title": "Advanced Secure SD-WAN & SASE",
                "topics": [
                      "FortiSASE Cloud Integration & Thin-Edge",
                      "Complex BGP Routing over Multi-Region SD-WAN",
                      "Performance Optimization & Dynamic Failover"
                ],
                "milestone": "Build Global SASE Hybrid Infrastructure"
          },
          {
                "week": "Week 7-8",
                "title": "Advanced Threat Protection & FortiSandbox",
                "topics": [
                      "FortiSandbox Deployment (On-Prem & Cloud)",
                      "Zero-Day Exploit Detection & Quarantine",
                      "Automated Security Fabric Event Remediation"
                ],
                "milestone": "Deploy Automated Zero-Day Sandboxing"
          },
          {
                "week": "Week 9-10",
                "title": "Solution Architecture & Specialist Mocks",
                "topics": [
                      "Enterprise Multi-Cloud Security Fabric",
                      "Regulatory Auditing & Performance Validation",
                      "Solution Specialist Certification Review"
                ],
                "milestone": "Pass Fortinet Solution Specialist Assessment"
          }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. 💻 MICROSOFT & IT PROFESSIONAL (7 Courses - Preserved)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "microsoft-365-admin",
    title: "Microsoft 365 Enterprise Administration (MS-102)",
    category: "Microsoft & IT",
    categoryGroup: "Microsoft & IT",
    duration: "2 Months",
    students: "10.4K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Manoj Chawla",
    mentorCompany: "Microsoft Certified Trainer",
    mentorExp: "12+ Years",
    language: "English & Hindi",
    price: "₹11,999",
    originalPrice: "₹22,000",
    badge: "IT Professional",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=340&fit=crop&auto=format",
    features: ["Deploy & Manage Microsoft 365 Tenant","Exchange Online & SharePoint Admin","Microsoft Teams Enterprise Voice","Defender for Office 365 & Purview"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "M365 Tenant Setup & Custom Domains",
                "topics": [
                      "Tenant Provisioning & DNS Records",
                      "User & License Provisioning",
                      "Shared Mailboxes & Groups"
                ],
                "milestone": "Configure Enterprise M365 Tenant"
          },
          {
                "week": "Week 2",
                "title": "Exchange Online & Teams Management",
                "topics": [
                      "Mail Flow Rules & Anti-Spam",
                      "Teams Policies & Direct Routing",
                      "SharePoint Online Sites & Permissions"
                ],
                "milestone": "Deploy Company-Wide Teams & Mail Architecture"
          },
          {
                "week": "Week 3",
                "title": "Endpoint Manager (Intune) & Security",
                "topics": [
                      "Device Enrollment (Windows, iOS, Android)",
                      "Compliance & Configuration Profiles",
                      "Conditional Access Policies"
                ],
                "milestone": "Enroll & Secure Corporate Laptops"
          },
          {
                "week": "Week 4",
                "title": "Purview Compliance & MS-102 Exam",
                "topics": [
                      "Data Loss Prevention (DLP)",
                      "Retention Labels & eDiscovery",
                      "MS-102 Certification Practice Tests"
                ],
                "milestone": "Pass MS-102 Simulation Exam"
          }
    ]
  },
  {
    id: "windows-server-admin",
    title: "Windows Server 2022 & Hybrid Cloud Administration",
    category: "Microsoft & IT",
    categoryGroup: "Microsoft & IT",
    duration: "2.5 Months",
    students: "12.8K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Manoj Chawla",
    mentorCompany: "Microsoft Certified Trainer",
    mentorExp: "12+ Years",
    language: "English & Hindi",
    price: "₹10,499",
    originalPrice: "₹19,000",
    badge: "IT Professional",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&auto=format",
    features: ["Windows Server 2022 Core & GUI","Hyper-V Virtualization & Clustering","File Services, Storage Spaces & DFS","Azure Arc & Hybrid Management"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Server 2022 Deployment & Storage",
                "topics": [
                      "Installing Server Core & Windows Admin Center",
                      "Storage Spaces Direct (S2D)",
                      "iSCSI Target & DFS Namespaces"
                ],
                "milestone": "Deploy High-Availability Storage Server"
          },
          {
                "week": "Week 2",
                "title": "Hyper-V & Failover Clustering",
                "topics": [
                      "Hyper-V Virtual Switches & VMs",
                      "Failover Clustering Configuration",
                      "Live Migration without Shared Storage"
                ],
                "milestone": "Build 2-Node Hyper-V Cluster"
          },
          {
                "week": "Week 3",
                "title": "Core Networking Roles (DHCP, DNS, IPAM)",
                "topics": [
                      "DHCP Failover & Scope Options",
                      "DNS Zones, Forwarders & DNSSEC",
                      "IP Address Management (IPAM)"
                ],
                "milestone": "Deploy Enterprise DNS & DHCP Infrastructure"
          },
          {
                "week": "Week 4",
                "title": "Azure Hybrid & PowerShell Automation",
                "topics": [
                      "Azure Arc Connected Servers",
                      "Azure Extended Network",
                      "PowerShell Scripting for Admins"
                ],
                "milestone": "Manage Hybrid Server via Azure Portal"
          }
    ]
  },
  {
    id: "active-directory-mastery",
    title: "Active Directory Domain Services (AD DS) & Group Policy",
    category: "Microsoft & IT",
    categoryGroup: "Microsoft & IT",
    duration: "1.5 Months",
    students: "14.2K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Manoj Chawla",
    mentorCompany: "Microsoft Certified Trainer",
    mentorExp: "12+ Years",
    language: "English & Hindi",
    price: "₹8,999",
    originalPrice: "₹17,000",
    badge: "IT Professional",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
    features: ["AD Forest, Domain & Trust Architecture","Group Policy Objects (GPOs) & Security Filtering","FSMO Roles & Replication Topology","AD Certificate Services (AD CS) & Kerberos"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "AD Forest & Domain Architecture",
                "topics": [
                      "Deploying Primary & Secondary Domain Controllers",
                      "Organizational Units (OUs) & Delegation",
                      "FSMO Role Assignment & Seizing"
                ],
                "milestone": "Build Multi-Domain Forest Hierarchy"
          },
          {
                "week": "Week 2",
                "title": "Group Policy Objects (GPO) Mastery",
                "topics": [
                      "GPO Processing Order (LSDOU)",
                      "Security Filtering & WMI Filters",
                      "Software Deployment & Drive Mapping GPOs"
                ],
                "milestone": "Enforce Automated Corporate Security GPO"
          },
          {
                "week": "Week 3",
                "title": "Trusts, Sites & Replication",
                "topics": [
                      "Forest & External Domain Trusts",
                      "AD Sites, Subnets & Site Links",
                      "Replication Troubleshooting (repadmin)"
                ],
                "milestone": "Configure Multi-Site AD Replication"
          },
          {
                "week": "Week 4",
                "title": "AD Security, Kerberos & Hardening",
                "topics": [
                      "Kerberos Authentication & SPNs",
                      "Tiered Administrative Model",
                      "Backup & Authoritative Restore"
                ],
                "milestone": "Audit & Harden Active Directory Forest"
          }
    ]
  },
  {
    id: "git-github-devops",
    title: "Git, GitHub & Modern DevOps Version Control Mastery",
    category: "Microsoft & IT",
    categoryGroup: "Microsoft & IT",
    duration: "1 Month",
    students: "21.6K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Vikram Nair",
    mentorCompany: "Staff Frontend Engineer",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹6,999",
    originalPrice: "₹14,000",
    badge: "IT Professional",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=340&fit=crop&auto=format",
    features: ["Git Internals & Plumbing Commands","Branching Strategies (GitFlow, Trunk-Based)","Interactive Rebase, Cherry-Pick & Bisect","GitHub Actions CI/CD Workflows"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Git Fundamentals & Plumbing",
                "topics": [
                      "Working Directory, Staging & Repository",
                      "Commits, Diffs & Log Formatting",
                      "SSH Keys & Remote Repositories"
                ],
                "milestone": "Configure Professional Git Setup"
          },
          {
                "week": "Week 2",
                "title": "Branching, Merging & Merge Conflicts",
                "topics": [
                      "Fast-Forward vs 3-Way Merges",
                      "Resolving Complex Merge Conflicts",
                      "Git Stash & Git Reset vs Revert"
                ],
                "milestone": "Resolve Simulated Team Merge Conflicts"
          },
          {
                "week": "Week 3",
                "title": "Advanced Git Workflows",
                "topics": [
                      "Interactive Rebase (reword, squash, drop)",
                      "Cherry-Picking Commits",
                      "Git Bisect for Bug Hunting"
                ],
                "milestone": "Clean Up Multi-Branch Repository History"
          },
          {
                "week": "Week 4",
                "title": "GitHub Actions & Enterprise Collaboration",
                "topics": [
                      "GitHub Pull Request Reviews",
                      "GitHub Actions CI/CD Pipelines",
                      "Branch Protection Rules & Secrets"
                ],
                "milestone": "Build Automated CI/CD Testing Pipeline"
          }
    ]
  },
  {
    id: "servicenow-admin",
    title: "ServiceNow System Administrator (CSA) Certification",
    category: "Microsoft & IT",
    categoryGroup: "Microsoft & IT",
    duration: "2 Months",
    students: "9.2K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Pradeep Soni",
    mentorCompany: "ServiceNow Certified Master",
    mentorExp: "11+ Years",
    language: "English & Hindi",
    price: "₹13,999",
    originalPrice: "₹25,000",
    badge: "IT Professional",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format",
    features: ["User Interface & Navigation Management","Database Administration & Schema Map","Business Rules & Client Scripts","Flow Designer & Service Catalog"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "ServiceNow Architecture & UI",
                "topics": [
                      "Instances, Tables & Records",
                      "List & Form Customization",
                      "User & Role Management"
                ],
                "milestone": "Build Custom ServiceNow Table & Form"
          },
          {
                "week": "Week 2",
                "title": "Schema Map & Data Management",
                "topics": [
                      "CMDB & Configuration Items (CIs)",
                      "Import Sets & Transform Maps",
                      "Database Relationships & Dictionary"
                ],
                "milestone": "Import 5000+ Asset Records with Transform Map"
          },
          {
                "week": "Week 3",
                "title": "Service Automation & Workflows",
                "topics": [
                      "Flow Designer & Process Automation",
                      "Service Catalog Items & Variables",
                      "Notifications & SLA Definitions"
                ],
                "milestone": "Create Automated IT Hardware Request Flow"
          },
          {
                "week": "Week 4",
                "title": "Scripting Basics & CSA Exam Drills",
                "topics": [
                      "Client Scripts & UI Policies",
                      "Business Rules (Server-Side)",
                      "CSA Timed Exam Practice Tests"
                ],
                "milestone": "Pass ServiceNow CSA Mock Exam"
          }
    ]
  },
  {
    id: "itil-4-foundation",
    title: "ITIL 4 Foundation IT Service Management (ITSM)",
    category: "Microsoft & IT",
    categoryGroup: "Microsoft & IT",
    duration: "1 Month",
    students: "11.1K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Pradeep Soni",
    mentorCompany: "ITIL 4 Managing Professional",
    mentorExp: "11+ Years",
    language: "English & Hindi",
    price: "₹7,999",
    originalPrice: "₹15,000",
    badge: "IT Professional",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop&auto=format",
    features: ["Service Value System (SVS)","Four Dimensions of Service Management","7 Guiding Principles of ITIL","15 Core ITIL Management Practices"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "ITIL 4 Key Concepts & Guiding Principles",
                "topics": [
                      "Value Co-Creation, Outcomes & Costs",
                      "Focus on Value & Start Where You Are",
                      "Progress Iteratively with Feedback"
                ],
                "milestone": "Map Service Value Stream"
          },
          {
                "week": "Week 2",
                "title": "Four Dimensions of Service Management",
                "topics": [
                      "Organizations & People",
                      "Information & Technology",
                      "Partners & Suppliers / Value Streams"
                ],
                "milestone": "Draft IT Service Management Model"
          },
          {
                "week": "Week 3",
                "title": "Service Value System & Continual Improvement",
                "topics": [
                      "Plan, Improve, Engage, Design, Obtain, Deliver",
                      "Continual Improvement Model",
                      "Key Performance Indicators (KPIs)"
                ],
                "milestone": "Implement Service Improvement Plan"
          },
          {
                "week": "Week 4",
                "title": "Core Practices & ITIL 4 Exam Prep",
                "topics": [
                      "Incident, Change, Problem & Service Desk",
                      "Service Level Management (SLA/OLA)",
                      "Full ITIL 4 Practice Exams"
                ],
                "milestone": "Pass ITIL 4 Foundation Mock Exam"
          }
    ]
  },
  {
    id: "microsoft-professional",
    title: "Microsoft Certified: Power Platform Fundamentals (PL-900)",
    category: "Microsoft & IT",
    categoryGroup: "Microsoft & IT",
    duration: "1 Month",
    students: "8.4K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Manoj Chawla",
    mentorCompany: "Microsoft Certified Trainer",
    mentorExp: "12+ Years",
    language: "English & Hindi",
    price: "₹7,499",
    originalPrice: "₹14,000",
    badge: "IT Professional",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=340&fit=crop&auto=format",
    features: ["Power Apps Canvas & Model-Driven Apps","Power Automate Cloud Flows","Power BI Interactive Dashboards","Power Pages & Copilot Studio"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Dataverse & Business Value",
                "topics": [
                      "Dataverse Tables & Relationships",
                      "Environment Management",
                      "Security Roles in Dataverse"
                ],
                "milestone": "Create Custom Dataverse Business Model"
          },
          {
                "week": "Week 2",
                "title": "Power Apps Canvas Apps",
                "topics": [
                      "Building Mobile & Web Apps",
                      "Form Controls & Power Fx Formulas",
                      "Publishing & Sharing Power Apps"
                ],
                "milestone": "Build Employee Onboarding Canvas App"
          },
          {
                "week": "Week 3",
                "title": "Power Automate & Power Pages",
                "topics": [
                      "Automated, Instant & Scheduled Flows",
                      "Approval Workflows & Connectors",
                      "Power Pages External Portals"
                ],
                "milestone": "Deploy Multi-Stage Approval Workflow"
          },
          {
                "week": "Week 4",
                "title": "Power BI, Copilot & PL-900 Exam",
                "topics": [
                      "Power BI Report Creation",
                      "Copilot AI in Power Platform",
                      "PL-900 Official Practice Tests"
                ],
                "milestone": "Pass PL-900 Exam Simulation"
          }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. 📊 DATA & ANALYTICS CERTIFICATIONS (5 Courses - Preserved)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "power-bi-pl300",
    title: "Microsoft Power BI Data Analyst (PL-300 Certification)",
    category: "Data Analytics",
    categoryGroup: "Data & Analytics",
    duration: "2.5 Months",
    students: "18.6K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Naveen Gupta",
    mentorCompany: "Principal BI Architect",
    mentorExp: "11+ Years",
    language: "English & Hindi",
    price: "₹11,999",
    originalPrice: "₹22,000",
    badge: "Analytics Expert",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format",
    features: ["Power Query ETL Transformation","Data Modeling & Star Schema","Advanced DAX Calculations (CALCULATE, Time Intelligence)","Power BI Service & Gateway"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Data Extraction & Power Query ETL",
                "topics": [
                      "Connecting to SQL, Excel & Web APIs",
                      "Unpivoting, Merging & Appending Queries",
                      "M Code Basics"
                ],
                "milestone": "Build Automated Multi-Source ETL Pipeline"
          },
          {
                "week": "Week 2",
                "title": "Data Modeling & Star Schema",
                "topics": [
                      "1-to-Many Relationships & Fact Tables",
                      "Active vs Inactive Relationships",
                      "Role-Playing Dimensions"
                ],
                "milestone": "Architect Star Schema Data Model"
          },
          {
                "week": "Week 3",
                "title": "Advanced DAX & Business Logic",
                "topics": [
                      "Row Context vs Filter Context",
                      "CALCULATE, FILTER & ALL Functions",
                      "Year-to-Date & Moving Averages"
                ],
                "milestone": "Write 30+ Enterprise DAX Measures"
          },
          {
                "week": "Week 4",
                "title": "Visualizations, Service & PL-300 Exam",
                "topics": [
                      "Drill-Through, Bookmarks & Tooltips",
                      "Row-Level Security (RLS)",
                      "PL-300 Timed Exam Practice"
                ],
                "milestone": "Publish Executive BI Dashboard to Service"
          }
    ]
  },
  {
    id: "tableau-desktop-specialist",
    title: "Tableau Desktop Specialist & Data Storytelling",
    category: "Data Analytics",
    categoryGroup: "Data & Analytics",
    duration: "2 Months",
    students: "12.3K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Naveen Gupta",
    mentorCompany: "Principal BI Architect",
    mentorExp: "11+ Years",
    language: "English & Hindi",
    price: "₹10,999",
    originalPrice: "₹20,000",
    badge: "Analytics Expert",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=340&fit=crop&auto=format",
    features: ["Connecting to & Preparing Data","Level of Detail (LOD) Calculations","Interactive Visual Analytics & Maps","Story Points & Dashboard Actions"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Connecting Data & Basic Visuals",
                "topics": [
                      "Extracts vs Live Connections",
                      "Bar Charts, Line Graphs & Heat Maps",
                      "Dimensions vs Measures"
                ],
                "milestone": "Build Multi-Tab Sales Report"
          },
          {
                "week": "Week 2",
                "title": "Calculations & LOD Expressions",
                "topics": [
                      "Table Calculations (Rank, % of Total)",
                      "FIXED, INCLUDE & EXCLUDE LODs",
                      "Sets, Groups & Parameters"
                ],
                "milestone": "Implement Cohort Retention Analysis"
          },
          {
                "week": "Week 3",
                "title": "Interactive Dashboards & Stories",
                "topics": [
                      "Filter & Highlight Actions",
                      "URL Actions & Dynamic Tooltips",
                      "Device Layout Optimization"
                ],
                "milestone": "Create Interactive Storyboard Presentation"
          },
          {
                "week": "Week 4",
                "title": "Tableau Server & Certification Exam",
                "topics": [
                      "Publishing Workbooks & Security",
                      "Data Governance & Refresh Schedules",
                      "Tableau Specialist Exam Drills"
                ],
                "milestone": "Pass Tableau Desktop Specialist Mock"
          }
    ]
  },
  {
    id: "splunk-power-user",
    title: "Splunk Core Certified Power User Training",
    category: "Data Analytics",
    categoryGroup: "Data & Analytics",
    duration: "2 Months",
    students: "8.1K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Varun Malhotra",
    mentorCompany: "Splunk Certified Architect",
    mentorExp: "12+ Years",
    language: "English & Hindi",
    price: "₹12,999",
    originalPrice: "₹23,000",
    badge: "Analytics Expert",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&auto=format",
    features: ["Search Processing Language (SPL)","Knowledge Objects (Lookups, Event Types)","Reports, Alerts & Interactive Dashboards","Data Models & Pivot Tool"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Searching & SPL Commands",
                "topics": [
                      "stats, chart, timechart & eval",
                      "Filtering with where and search",
                      "Search Optimization Techniques"
                ],
                "milestone": "Write Advanced SPL Multi-Dataset Queries"
          },
          {
                "week": "Week 2",
                "title": "Knowledge Objects & Lookups",
                "topics": [
                      "Field Extractions (Regex)",
                      "CSV & KV Store Lookups",
                      "Tags, Event Types & Calculated Fields"
                ],
                "milestone": "Enrich Machine Data with External Lookups"
          },
          {
                "week": "Week 3",
                "title": "Alerting, Dashboards & Visualizations",
                "topics": [
                      "Real-time & Scheduled Alerts",
                      "Splunk Dashboard Studio",
                      "Custom Visualizations & Drilldowns"
                ],
                "milestone": "Build Real-Time Security Operations Dashboard"
          },
          {
                "week": "Week 4",
                "title": "Data Models & Power User Exam",
                "topics": [
                      "Accelerated Data Models",
                      "Pivot Interface for Non-Technical Users",
                      "Splunk Power User Practice Exams"
                ],
                "milestone": "Pass Splunk Power User Certification Mock"
          }
    ]
  },
  {
    id: "sql-data-analytics",
    title: "Advanced SQL for Data Analytics & Database Engineering",
    category: "Data Analytics",
    categoryGroup: "Data & Analytics",
    duration: "1.5 Months",
    students: "26.4K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Divya Menon",
    mentorCompany: "Principal Data Scientist",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹7,999",
    originalPrice: "₹15,000",
    badge: "Analytics Expert",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=340&fit=crop&auto=format",
    features: ["Complex Multi-Table Joins & CTEs","Window Functions (ROW_NUMBER, DENSE_RANK)","Query Performance Optimization & Indexing","Real-World Business Case Studies"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Relational Foundations & Joins",
                "topics": [
                      "Inner, Left, Right & Full Outer Joins",
                      "Aggregations with GROUP BY & HAVING",
                      "Subqueries & Correlated Subqueries"
                ],
                "milestone": "Solve 40 Complex Business SQL Queries"
          },
          {
                "week": "Week 2",
                "title": "Common Table Expressions & Window Functions",
                "topics": [
                      "Recursive & Standard CTEs",
                      "ROW_NUMBER, RANK, DENSE_RANK",
                      "LEAD, LAG & Moving Window Averages"
                ],
                "milestone": "Calculate Month-over-Month Revenue Growth"
          },
          {
                "week": "Week 3",
                "title": "Database Indexing & Query Tuning",
                "topics": [
                      "B-Tree Indexes & Execution Plans (EXPLAIN)",
                      "Partitioning Large Datasets",
                      "Stored Procedures & Triggers"
                ],
                "milestone": "Optimize Slow Query from 12s to 80ms"
          },
          {
                "week": "Week 4",
                "title": "Business Case Studies & Interview Prep",
                "topics": [
                      "Customer Churn SQL Modeling",
                      "E-Commerce Funnel Analytics",
                      "One-on-One SQL Live Coding Interview Review"
                ],
                "milestone": "Deliver End-to-End SQL Analytics Capstone"
          }
    ]
  },
  {
    id: "excel-data-analytics",
    title: "Advanced Excel for Business & Data Analytics",
    category: "Data Analytics",
    categoryGroup: "Data & Analytics",
    duration: "1 Month",
    students: "22.8K",
    rating: "4.8",
    level: "Beginner",
    mentor: "Naveen Gupta",
    mentorCompany: "Financial & BI Analyst",
    mentorExp: "11+ Years",
    language: "English & Hindi",
    price: "₹5,999",
    originalPrice: "₹12,000",
    badge: "Analytics Expert",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format",
    features: ["Advanced Formulas (XLOOKUP, INDEX/MATCH)","Pivot Tables, Slicers & Timelines","Power Query in Excel for Automation","Executive Financial Dashboards"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Advanced Formulas & Logic",
                "topics": [
                      "XLOOKUP, INDEX, MATCH & FILTER",
                      "Nested IF, IFS, SUMIFS & COUNTIFS",
                      "Dynamic Array Formulas"
                ],
                "milestone": "Automate Financial Model Calculation Sheet"
          },
          {
                "week": "Week 2",
                "title": "Pivot Tables & Pivot Charts",
                "topics": [
                      "Calculated Fields & Grouping",
                      "Slicers, Timelines & Report Connections",
                      "Conditional Formatting Rules"
                ],
                "milestone": "Build Dynamic Multi-Currency Pivot Report"
          },
          {
                "week": "Week 3",
                "title": "Power Query in Excel",
                "topics": [
                      "Extracting & Merging Messy CSVs",
                      "Unpivoting Data & Column Splits",
                      "One-Click Data Refresh Setup"
                ],
                "milestone": "Automate Monthly Sales Cleaning Pipeline"
          },
          {
                "week": "Week 4",
                "title": "Executive Dashboards & VBA Intro",
                "topics": [
                      "Professional UI Design & KPI Cards",
                      "Macro Recording & Basic VBA",
                      "One-on-One Portfolio Review"
                ],
                "milestone": "Deliver C-Level Executive Financial Dashboard"
          }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. 📋 PROJECT MANAGEMENT & AGILE (5 Courses - Preserved)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "pmp-certification",
    title: "PMP (Project Management Professional) Certification Prep",
    category: "Project Management",
    categoryGroup: "Project Management",
    duration: "3 Months",
    students: "14.9K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Harish Venkat",
    mentorCompany: "PMP / PMI Authorized Trainer",
    mentorExp: "15+ Years",
    language: "English & Hindi",
    price: "₹16,999",
    originalPrice: "₹30,000",
    badge: "Project Manager",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop&auto=format",
    features: ["PMBOK Guide 7th Edition & Agile Practice Guide","People (42%), Process (50%), Business (8%)","35 Contact Hours / PDUs Certificate","2000+ Practice Question Pool"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "People Domain & Leadership",
                "topics": [
                      "Build & Lead Cross-Functional Teams",
                      "Conflict Management & Negotiation",
                      "Empowerment & Stakeholder Engagement"
                ],
                "milestone": "Draft Team Charter & Stakeholder Matrix"
          },
          {
                "week": "Week 2",
                "title": "Process Domain: Predictive Methods",
                "topics": [
                      "Scope, Schedule (CPM/PERT) & Budget (EVM)",
                      "Risk Management (Risk Register & Monte Carlo)",
                      "Procurement & Quality Assurance"
                ],
                "milestone": "Calculate Earned Value Management (EVM) Model"
          },
          {
                "week": "Week 3",
                "title": "Agile & Hybrid Methodologies",
                "topics": [
                      "Scrum, Kanban & XP Frameworks",
                      "Sprint Planning, Retrospectives & Burndown",
                      "Managing Hybrid Project Lifecycles"
                ],
                "milestone": "Create Hybrid Project Delivery Framework"
          },
          {
                "week": "Week 4",
                "title": "Business Environment & PMP Mocks",
                "topics": [
                      "Organizational Change Management",
                      "Compliance & Benefit Realization",
                      "Four Full-Length 180-Question Mocks"
                ],
                "milestone": "Score 85%+ on Full PMP Simulation"
          }
    ]
  },
  {
    id: "prince2-foundation",
    title: "PRINCE2 Foundation & Practitioner Certification",
    category: "Project Management",
    categoryGroup: "Project Management",
    duration: "2 Months",
    students: "8.7K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Harish Venkat",
    mentorCompany: "PRINCE2 Certified Practitioner",
    mentorExp: "15+ Years",
    language: "English & Hindi",
    price: "₹14,499",
    originalPrice: "₹26,000",
    badge: "Project Manager",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=340&fit=crop&auto=format",
    features: ["7 PRINCE2 Principles, Themes & Processes","Tailoring PRINCE2 for Projects","Business Case & Risk Management","Official Practice Exams"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "7 Principles & 7 Themes",
                "topics": [
                      "Continued Business Justification",
                      "Defined Roles & Responsibilities",
                      "Organization, Quality & Risk Themes"
                ],
                "milestone": "Draft PRINCE2 Business Case Document"
          },
          {
                "week": "Week 2",
                "title": "7 Processes: Starting to Directing",
                "topics": [
                      "Starting up a Project (SU) & Initiating (IP)",
                      "Directing a Project (DP)",
                      "Controlling a Stage (CS)"
                ],
                "milestone": "Build Project Initiation Document (PID)"
          },
          {
                "week": "Week 3",
                "title": "Managing Product Delivery & Stage Boundaries",
                "topics": [
                      "Managing Product Delivery (MP)",
                      "Managing a Stage Boundary (SB)",
                      "Closing a Project (CP) & Lessons Learned"
                ],
                "milestone": "Complete End-Stage Assessment Report"
          },
          {
                "week": "Week 4",
                "title": "Tailoring & PRINCE2 Practitioner Exam",
                "topics": [
                      "Tailoring for Agile & Small Projects",
                      "Scenario-Based Practitioner Questions",
                      "Timed Mock Simulations"
                ],
                "milestone": "Pass PRINCE2 Practitioner Simulation"
          }
    ]
  },
  {
    id: "scrum-master-csm",
    title: "Scrum Master Certification (CSM / PSM I & II)",
    category: "Project Management",
    categoryGroup: "Project Management",
    duration: "1.5 Months",
    students: "19.2K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Harish Venkat",
    mentorCompany: "Certified Scrum Trainer",
    mentorExp: "15+ Years",
    language: "English & Hindi",
    price: "₹9,999",
    originalPrice: "₹18,000",
    badge: "Project Manager",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=340&fit=crop&auto=format",
    features: ["Scrum Theory, Values & Pillars","Scrum Roles (Scrum Master, PO, Dev Team)","Scrum Events & Artifacts (Sprint, Backlog)","Facilitation & Servant Leadership Techniques"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Scrum Theory & 3 Pillars",
                "topics": [
                      "Transparency, Inspection & Adaptation",
                      "5 Scrum Values & Agile Manifesto",
                      "Accountabilities in Scrum"
                ],
                "milestone": "Establish Team Working Agreements"
          },
          {
                "week": "Week 2",
                "title": "Scrum Events & Facilitation",
                "topics": [
                      "Sprint Planning & Daily Scrum",
                      "Sprint Review & Sprint Retrospective",
                      "Effective Facilitation Techniques"
                ],
                "milestone": "Facilitate Live Sprint Simulation"
          },
          {
                "week": "Week 3",
                "title": "Artifacts, Commitments & Metrics",
                "topics": [
                      "Product Backlog & Sprint Backlog",
                      "Definition of Done (DoD) vs Acceptance Criteria",
                      "Velocity, Burndown & Burnup Charts"
                ],
                "milestone": "Refine Backlog & Define DoD"
          },
          {
                "week": "Week 4",
                "title": "Coaching & PSM / CSM Exam Drills",
                "topics": [
                      "Coaching Teams & Removing Impediments",
                      "Scaling Scrum Basics",
                      "PSM I & CSM Official Mock Tests"
                ],
                "milestone": "Pass PSM I with 95%+ Score"
          }
    ]
  },
  {
    id: "safe-agilist",
    title: "SAFe Agile (Scaled Agile Framework – Leading SAFe 6.0)",
    category: "Project Management",
    categoryGroup: "Project Management",
    duration: "2 Months",
    students: "7.8K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Harish Venkat",
    mentorCompany: "Certified SAFe Practice Consultant",
    mentorExp: "15+ Years",
    language: "English & Hindi",
    price: "₹15,499",
    originalPrice: "₹28,000",
    badge: "Project Manager",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop&auto=format",
    features: ["Lean-Agile Mindset & Core Competencies","Agile Release Trains (ART) & PI Planning","Customer Centricity & Design Thinking","Value Stream Mapping & Lean Portfolio"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Thriving in the Digital Age with SAFe",
                "topics": [
                      "Seven Core Competencies of Business Agility",
                      "Lean-Agile Leadership & Mindset",
                      "SAFe Core Values & Principles"
                ],
                "milestone": "Map Business Agility Competencies"
          },
          {
                "week": "Week 2",
                "title": "Agile Product Delivery & ARTs",
                "topics": [
                      "Customer Centricity & Design Thinking",
                      "Launching an Agile Release Train (ART)",
                      "Roles of System Architect & Product Manager"
                ],
                "milestone": "Design Agile Release Train Structure"
          },
          {
                "week": "Week 3",
                "title": "PI Planning & Execution Mastery",
                "topics": [
                      "Program Increment (PI) Planning Event",
                      "Managing Risks (ROAMing) & Dependencies",
                      "Inspect & Adapt (I&A) Workshop"
                ],
                "milestone": "Simulate Full 2-Day PI Planning Event"
          },
          {
                "week": "Week 4",
                "title": "Lean Portfolio & Leading SAFe Exam",
                "topics": [
                      "Strategic Themes & Portfolio Kanban",
                      "Lean Budgets & Guardrails",
                      "Leading SAFe 6.0 Practice Exams"
                ],
                "milestone": "Pass Leading SAFe Certification Mock"
          }
    ]
  },
  {
    id: "togaf-enterprise-architecture",
    title: "TOGAF Standard 10th Edition Enterprise Architecture",
    category: "Project Management",
    categoryGroup: "Project Management",
    duration: "3 Months",
    students: "5.4K",
    rating: "4.9",
    level: "Advanced",
    mentor: "Harish Venkat",
    mentorCompany: "Enterprise Architect & TOGAF Certified",
    mentorExp: "15+ Years",
    language: "English & Hindi",
    price: "₹18,999",
    originalPrice: "₹34,000",
    badge: "Enterprise Expert",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&auto=format",
    features: ["Architecture Development Method (ADM)","Business, Data, Application & Tech Architecture","Architecture Governance & Capability","Full-Length Part 1 & Part 2 Exam Drills"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "TOGAF Core Concepts & Preliminary Phase",
                "topics": [
                      "Enterprise Architecture Principles",
                      "Architecture Governance Framework",
                      "Establishing the Architecture Capability"
                ],
                "milestone": "Establish Enterprise Architecture Charter"
          },
          {
                "week": "Week 2",
                "title": "ADM Phases A through D",
                "topics": [
                      "Phase A: Architecture Vision & Stakeholders",
                      "Phase B: Business Architecture Modeling",
                      "Phase C & D: Information Systems & Tech Architecture"
                ],
                "milestone": "Draft Complete Architecture Vision Document"
          },
          {
                "week": "Week 3",
                "title": "ADM Phases E through H",
                "topics": [
                      "Phase E: Opportunities & Solutions",
                      "Phase F: Migration Planning & Roadmap",
                      "Phase G & H: Implementation Governance & Change"
                ],
                "milestone": "Build Architecture Roadmap & Transition Plan"
          },
          {
                "week": "Week 4",
                "title": "Architecture Content & TOGAF 10 Exam",
                "topics": [
                      "Architecture Metamodel & Artifacts",
                      "Architecture Contracts & Compliance Reviews",
                      "TOGAF Combined Part 1 & 2 Practice Mocks"
                ],
                "milestone": "Pass TOGAF 10 Combined Exam Simulation"
          }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. 🏢 ENTERPRISE TECHNOLOGIES (7 Courses - Preserved)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "salesforce-admin",
    title: "Salesforce Certified Administrator (ADM-201)",
    category: "Enterprise Technologies",
    categoryGroup: "Enterprise Technologies",
    duration: "2.5 Months",
    students: "16.4K",
    rating: "4.9",
    level: "Beginner",
    mentor: "Pooja Reddy",
    mentorCompany: "Salesforce Certified Master",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹12,499",
    originalPrice: "₹24,000",
    badge: "Enterprise Expert",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format",
    features: ["Configuration & Data Management","Flow Automation & Validation Rules","Security (Profiles, Permission Sets, OWD)","Reports & Dynamic Dashboards"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Data Model & Object Customization",
                "topics": [
                      "Standard vs Custom Objects & Fields",
                      "Lookup vs Master-Detail Relationships",
                      "Formula Fields & Validation Rules"
                ],
                "milestone": "Build Custom Talent Management App in Salesforce"
          },
          {
                "week": "Week 2",
                "title": "Security & Record Access Model",
                "topics": [
                      "Profiles & Permission Sets",
                      "Organization-Wide Defaults (OWD)",
                      "Role Hierarchy & Sharing Rules"
                ],
                "milestone": "Configure Enterprise Data Security Model"
          },
          {
                "week": "Week 3",
                "title": "Process Automation with Salesforce Flow",
                "topics": [
                      "Record-Triggered & Screen Flows",
                      "Fast Field Updates vs Asynchronous Actions",
                      "Approval Processes"
                ],
                "milestone": "Automate End-to-End Lead-to-Order Flow"
          },
          {
                "week": "Week 4",
                "title": "Data Loader, Reports & ADM-201 Exam",
                "topics": [
                      "Data Import Wizard & Data Loader",
                      "Custom Report Types & Dashboards",
                      "Official ADM-201 Exam Practice Tests"
                ],
                "milestone": "Pass Salesforce Admin Certification Simulation"
          }
    ]
  },
  {
    id: "salesforce-developer",
    title: "Salesforce Platform Developer I (PD-I / Apex & LWC)",
    category: "Enterprise Technologies",
    categoryGroup: "Enterprise Technologies",
    duration: "3 Months",
    students: "11.2K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Pooja Reddy",
    mentorCompany: "Salesforce Certified Master",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    price: "₹14,999",
    originalPrice: "₹27,000",
    badge: "Enterprise Expert",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop&auto=format",
    features: ["Apex OOP & Governor Limits","SOQL, SOSL & DML Operations","Lightning Web Components (LWC)","Asynchronous Apex & REST Callouts"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Apex Programming & SOQL",
                "topics": [
                      "Apex Classes, Triggers & Governor Limits",
                      "SOQL Relationships & SOSL Searches",
                      "Trigger Frameworks & Best Practices"
                ],
                "milestone": "Build Bulkified Apex Trigger Framework"
          },
          {
                "week": "Week 2",
                "title": "Asynchronous Apex & Integrations",
                "topics": [
                      "Batch Apex, Queueable & Future Methods",
                      "Schedulable Apex Schedulers",
                      "REST API Callouts & Custom Web Services"
                ],
                "milestone": "Integrate Salesforce with External REST API"
          },
          {
                "week": "Week 3",
                "title": "Lightning Web Components (LWC)",
                "topics": [
                      "LWC Architecture & Shadow DOM",
                      "Data Binding & Wire Service",
                      "Custom Events & Component Communication"
                ],
                "milestone": "Build Interactive Banking Portal LWC"
          },
          {
                "week": "Week 4",
                "title": "Unit Testing & PD-1 Certification",
                "topics": [
                      "Writing 90%+ Code Coverage Tests",
                      "Test.startTest() & Test.stopTest()",
                      "PD-1 Official Mock Exam Drills"
                ],
                "milestone": "Pass Platform Developer I Certification Prep"
          }
    ]
  },
  {
    id: "sap-fico",
    title: "SAP S/4HANA FICO (Financial Accounting & Controlling)",
    category: "Enterprise Technologies",
    categoryGroup: "Enterprise Technologies",
    duration: "3.5 Months",
    students: "13.8K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Rameshwar Iyer",
    mentorCompany: "Lead SAP FICO Solution Architect",
    mentorExp: "16+ Years",
    language: "English & Hindi",
    price: "₹16,999",
    originalPrice: "₹32,000",
    badge: "Enterprise Expert",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=340&fit=crop&auto=format",
    features: ["General Ledger (G/L) Accounting","Accounts Payable (AP) & Receivable (AR)","Asset Accounting & Bank Ledger","Cost Center & Profit Center Accounting"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "Enterprise Structure & General Ledger",
                "topics": [
                      "Company Code, Chart of Accounts & Fiscal Year",
                      "Universal Journal (ACDOCA Table)",
                      "Document Types & Number Ranges"
                ],
                "milestone": "Configure S/4HANA Enterprise Structure"
          },
          {
                "week": "Week 2",
                "title": "Accounts Payable (AP) & Receivable (AR)",
                "topics": [
                      "Vendor & Customer Master / Business Partner",
                      "Automatic Payment Program (F110)",
                      "Dunning Program & Credit Management"
                ],
                "milestone": "Execute Automated Vendor Payment Run"
          },
          {
                "week": "Week 3",
                "title": "Asset Accounting & Integration",
                "topics": [
                      "Chart of Depreciation & Asset Classes",
                      "Depreciation Run & Asset Transfer",
                      "MM-FI & SD-FI Integration Points"
                ],
                "milestone": "Configure Complete MM-FI Integration"
          },
          {
                "week": "Week 4",
                "title": "Controlling (CO) & S/4HANA Reporting",
                "topics": [
                      "Cost Elements, Cost Centers & Internal Orders",
                      "Profit Center Accounting & Allocations",
                      "Financial Closing Cockpit & Mock Tests"
                ],
                "milestone": "Deliver Full Financial Closing Cycle"
          }
    ]
  },
  {
    id: "sap-mm",
    title: "SAP S/4HANA MM (Materials Management & Sourcing)",
    category: "Enterprise Technologies",
    categoryGroup: "Enterprise Technologies",
    duration: "3 Months",
    students: "10.6K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Rameshwar Iyer",
    mentorCompany: "Lead SAP FICO Solution Architect",
    mentorExp: "16+ Years",
    language: "English & Hindi",
    price: "₹15,499",
    originalPrice: "₹28,000",
    badge: "Enterprise Expert",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=340&fit=crop&auto=format",
    features: ["Procurement Lifecycle & Purchase Orders","Inventory Management & Goods Movement","Invoice Verification (MIRO)","Valuation, Account Determination & MRP"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "MM Enterprise Structure & Material Master",
                "topics": [
                      "Plant, Storage Location & Purchasing Org",
                      "Material Types, Industry Sectors & Views",
                      "Business Partner (Vendor Master) Setup"
                ],
                "milestone": "Configure Complete Procurement Hierarchy"
          },
          {
                "week": "Week 2",
                "title": "Purchasing & Sourcing Lifecycle",
                "topics": [
                      "Purchase Requisitions (PR) & Purchase Orders (PO)",
                      "RFQ, Quotation & Price Comparison",
                      "Release Strategy with Classification"
                ],
                "milestone": "Implement Multi-Level PO Approval Flow"
          },
          {
                "week": "Week 3",
                "title": "Inventory Management & Physical Inventory",
                "topics": [
                      "Goods Receipt (MIGO) & Movement Types",
                      "Transfer Postings & Stock Transfers",
                      "Logistics Invoice Verification (MIRO)"
                ],
                "milestone": "Execute 3-Way Invoice Matching Run"
          },
          {
                "week": "Week 4",
                "title": "Automatic Account Determination & MRP",
                "topics": [
                      "Valuation Class & OBYC Account Mapping",
                      "Material Requirements Planning (MRP)",
                      "SAP MM Certification Exam Prep"
                ],
                "milestone": "Run Automated Material Requirements Run"
          }
    ]
  },
  {
    id: "sap-sd",
    title: "SAP S/4HANA SD (Sales & Distribution Logistics)",
    category: "Enterprise Technologies",
    categoryGroup: "Enterprise Technologies",
    duration: "3 Months",
    students: "9.9K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Rameshwar Iyer",
    mentorCompany: "Lead SAP FICO Solution Architect",
    mentorExp: "16+ Years",
    language: "English & Hindi",
    price: "₹15,499",
    originalPrice: "₹28,000",
    badge: "Enterprise Expert",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=340&fit=crop&auto=format",
    features: ["Sales Order Processing (Order-to-Cash)","Pricing & Condition Technique","Shipping, Delivery & Picking","Billing & SD-FI Integration"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "SD Enterprise Structure & Master Data",
                "topics": [
                      "Sales Org, Distribution Channel, Division",
                      "Customer Master / Business Partner Data",
                      "Customer-Material Info Records"
                ],
                "milestone": "Configure Sales Area & Organization"
          },
          {
                "week": "Week 2",
                "title": "Order-to-Cash (O2C) Processing",
                "topics": [
                      "Inquiry, Quotation & Standard Sales Orders",
                      "Item Categories & Schedule Line Categories",
                      "Availability Check (ATP) & Transfer of Req"
                ],
                "milestone": "Process Complete O2C Sales Order"
          },
          {
                "week": "Week 3",
                "title": "Pricing & Condition Technique",
                "topics": [
                      "Condition Tables, Access Sequences & Types",
                      "Pricing Procedures (V/08)",
                      "Discounts, Surcharges & Taxes"
                ],
                "milestone": "Build Complex Enterprise Pricing Model"
          },
          {
                "week": "Week 4",
                "title": "Shipping, Billing & SD-FI Revenue",
                "topics": [
                      "Outbound Deliveries & Picking / Packing",
                      "Billing Documents (Invoices, Credit Memos)",
                      "Revenue Account Determination (VKOA)"
                ],
                "milestone": "Deliver Integrated O2C Invoicing Cycle"
          }
    ]
  },
  {
    id: "sap-abap",
    title: "SAP ABAP on S/4HANA & Core Data Services (CDS)",
    category: "Enterprise Technologies",
    categoryGroup: "Enterprise Technologies",
    duration: "3.5 Months",
    students: "11.5K",
    rating: "4.9",
    level: "Intermediate",
    mentor: "Rameshwar Iyer",
    mentorCompany: "Lead SAP FICO Solution Architect",
    mentorExp: "16+ Years",
    language: "English & Hindi",
    price: "₹16,499",
    originalPrice: "₹30,000",
    badge: "Enterprise Expert",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop&auto=format",
    features: ["ABAP 7.5+ Modern Syntax","ABAP Dictionary (DDIC) & OpenSQL","Core Data Services (CDS Views)","ABAP RESTful Application Programming (RAP)"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "ABAP Workbench & DDIC Data Dictionary",
                "topics": [
                      "Database Tables, Structures & Data Elements",
                      "Lock Objects & Search Helps",
                      "Modern ABAP Syntax (INLINE, CONV, COND)"
                ],
                "milestone": "Build Custom DDIC Schema in SAP"
          },
          {
                "week": "Week 2",
                "title": "Modularization, Reports & BAPIs",
                "topics": [
                      "Subroutines, Function Modules & BAPIs",
                      "ALV Grid Reporting with Object Oriented ABAP",
                      "Selection Screens & Event Processing"
                ],
                "milestone": "Develop Interactive OO-ALV Report"
          },
          {
                "week": "Week 3",
                "title": "Enhancements & Core Data Services (CDS)",
                "topics": [
                      "BAdIs, User Exits & Enhancement Points",
                      "CDS Views with Associations & Joins",
                      "OData Service Generation with SEGW"
                ],
                "milestone": "Build S/4HANA Core Data Service View"
          },
          {
                "week": "Week 4",
                "title": "ABAP RESTful Application Programming (RAP)",
                "topics": [
                      "Business Object (BO) Definition in RAP",
                      "Behavior Definition & Implementation",
                      "Fiori Elements UI Integration"
                ],
                "milestone": "Deploy Full Fiori-Ready RAP App"
          }
    ]
  },
  {
    id: "sap-successfactors",
    title: "SAP SuccessFactors Employee Central (HR Cloud)",
    category: "Enterprise Technologies",
    categoryGroup: "Enterprise Technologies",
    duration: "2.5 Months",
    students: "8.2K",
    rating: "4.8",
    level: "Intermediate",
    mentor: "Rameshwar Iyer",
    mentorCompany: "Lead SAP FICO Solution Architect",
    mentorExp: "16+ Years",
    language: "English & Hindi",
    price: "₹14,999",
    originalPrice: "₹26,000",
    badge: "Enterprise Expert",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=340&fit=crop&auto=format",
    features: ["Employee Central Data Model & Metadata","Foundation Objects & Generic Objects (MDF)","Business Rules & Workflow Automation","Position Management & Role-Based Permissions (RBP)"],
    roadmap: [
          {
                "week": "Week 1",
                "title": "SuccessFactors Architecture & Data Models",
                "topics": [
                      "Corporate & Succession Data Model",
                      "Managing Picklists (Legacy vs MDF)",
                      "People Profile & Header Customization"
                ],
                "milestone": "Configure SuccessFactors People Profile"
          },
          {
                "week": "Week 2",
                "title": "Metadata Framework (MDF) & Foundation Objects",
                "topics": [
                      "Legal Entity, Business Unit & Division",
                      "Configuring Custom Generic Objects",
                      "Event Reasons & Employee Status"
                ],
                "milestone": "Build Custom Organizational Structure"
          },
          {
                "week": "Week 3",
                "title": "Business Rules & Workflows",
                "topics": [
                      "Rule Engine Configuration & Triggers",
                      "Workflow Routing & Dynamic Approvers",
                      "Position Management & Org Chart"
                ],
                "milestone": "Automate Employee Transfer Approval Flow"
          },
          {
                "week": "Week 4",
                "title": "Role-Based Permissions (RBP) & Certification",
                "topics": [
                      "Permission Groups & Permission Roles",
                      "Target Population Restrictions",
                      "Official Employee Central Exam Mocks"
                ],
                "milestone": "Pass SAP SuccessFactors Certification Mock"
          }
    ]
  }
];
