const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Lead = require('./models/Lead');
const Course = require('./models/Course');
const Mentor = require('./models/Mentor');
const Resource = require('./models/Resource');
const Certificate = require('./models/Certificate');

// 55+ KR Tech Certification Courses
const ALL_55_COURSES = [
  // 1. Software Development
  {
    title: "Complete Java Backend Development with Spring Boot & Microservices",
    category: "Java Backend",
    description: "Core Java 21, Spring Boot 3.x, Microservices, Kafka, Docker & 1:1 Capstone Architecture.",
    duration: "6 Months",
    level: "Intermediate",
    rating: 4.95,
    studentsCount: 18200,
    price: 12999,
    originalPrice: 24999,
    isPopular: true,
    highlights: ["Core Java 21 & Virtual Threads", "Spring Boot 3.x & Security", "Kafka Event-Driven Microservices", "1:1 Live Capstone Architecture"],
  },
  {
    title: "MERN Stack Full Stack Web Development Mastery Bootcamp",
    category: "MERN Stack",
    description: "React 19, Next.js 15, Node.js, Express, MongoDB, Redis & Full Stack SaaS Capstone.",
    duration: "5 Months",
    level: "Beginner",
    rating: 4.92,
    studentsCount: 22100,
    price: 14999,
    originalPrice: 26999,
    isPopular: true,
    highlights: ["React 19 & Next.js 15", "Node.js & Express REST APIs", "MongoDB Aggregations & Indexes", "Full Stack SaaS Capstone"],
  },
  {
    title: "Modern React 19, TypeScript & Next.js Frontend Architecture",
    category: "React",
    description: "React 19 Server Components, Actions, Zustand, Tailwind CSS UI Systems & SSR.",
    duration: "3 Months",
    level: "Intermediate",
    rating: 4.9,
    studentsCount: 16500,
    price: 9999,
    originalPrice: 18999,
    isPopular: false,
    highlights: ["React 19 & Next.js 15 App Router", "TypeScript 5 Strict Typing", "Zustand & TanStack Query", "Enterprise Design System"],
  },
  {
    title: "Python Full Stack Development with FastAPI & PostgreSQL",
    category: "Python",
    description: "Python 3.12, FastAPI, SQLAlchemy ORM, Pydantic, Celery, Redis & Dockerized Microservices.",
    duration: "4 Months",
    level: "Beginner",
    rating: 4.88,
    studentsCount: 14200,
    price: 11999,
    originalPrice: 21999,
    isPopular: false,
    highlights: ["Python 3.12 Modern Features", "Async FastAPI & Pydantic v2", "PostgreSQL & SQLAlchemy ORM", "Docker & Background Celery Workers"],
  },
  {
    title: "Data Structures & Algorithms Mastery in Java/C++",
    category: "DSA",
    description: "75 Essential LeetCode patterns, Dynamic Programming, Graphs, Trees & FAANG Mock Interviews.",
    duration: "3.5 Months",
    level: "All Levels",
    rating: 4.97,
    studentsCount: 31000,
    price: 8999,
    originalPrice: 16999,
    isPopular: true,
    highlights: ["Arrays, Two Pointers & Sliding Window", "Binary Trees, BSTs & Tries", "Dynamic Programming Mastery", "1:1 FAANG SDE Mock Interviews"],
  },
  {
    title: "Artificial Intelligence & Generative AI with PyTorch & LLMs",
    category: "AI & ML",
    description: "Deep Learning, PyTorch, Transformer Architecture, LangChain, RAG Pipelines & Fine-tuning LLMs.",
    duration: "5 Months",
    level: "Advanced",
    rating: 4.96,
    studentsCount: 11800,
    price: 16999,
    originalPrice: 32999,
    isPopular: true,
    highlights: ["Neural Networks & PyTorch", "Transformers & Attention Mechanism", "LangChain, LlamaIndex & Vector DBs", "Fine-Tuning Llama 3 & Mistral"],
  },
  {
    title: "Golang High-Performance Microservices & Distributed Systems",
    category: "Software Development",
    description: "Go Routines, Channels, gRPC, Protobuf, Kafka, Distributed Tracing & Kubernetes Deployment.",
    duration: "3 Months",
    level: "Advanced",
    rating: 4.91,
    studentsCount: 7800,
    price: 13999,
    originalPrice: 24999,
    isPopular: false,
    highlights: ["Go Concurrency & Goroutines", "gRPC & Protocol Buffers", "Distributed Caching with Redis", "Kubernetes Operator Patterns"],
  },
  {
    title: "Spring Boot 3.x Cloud Microservices & Security Architecture",
    category: "Java Backend",
    description: "OAuth2, JWT, Keycloak, Spring Cloud Gateway, Resilience4j, Zipkin & OpenTelemetry.",
    duration: "3 Months",
    level: "Advanced",
    rating: 4.93,
    studentsCount: 9400,
    price: 11499,
    originalPrice: 21999,
    isPopular: false,
    highlights: ["Spring Security 6 & OAuth2", "Resilience4j Circuit Breakers", "Distributed Tracing with OpenTelemetry", "Keycloak SSO Integration"],
  },

  // 2. Cloud Computing (AWS, Azure, GCP)
  {
    title: "AWS Certified Solutions Architect Associate (SAA-C03)",
    category: "AWS",
    description: "VPC, EC2, S3, RDS, ECS Fargate, Lambda, IAM, CloudFormation & Exam Simulator Labs.",
    duration: "3 Months",
    level: "Intermediate",
    rating: 4.98,
    studentsCount: 26400,
    price: 13999,
    originalPrice: 25000,
    isPopular: true,
    highlights: ["AWS Multi-Tier VPC Design", "Serverless Lambda & API Gateway", "ECS Fargate & Container Workloads", "100% Exam Pass Guarantee Practice"],
  },
  {
    title: "AWS Certified DevOps Engineer Professional (DOP-C02)",
    category: "AWS",
    description: "CI/CD Pipelines, CodePipeline, CodeBuild, Terraform, Infrastructure as Code & CloudWatch.",
    duration: "3.5 Months",
    level: "Advanced",
    rating: 4.94,
    studentsCount: 12200,
    price: 15999,
    originalPrice: 28000,
    isPopular: false,
    highlights: ["CodePipeline & Multi-Account Deployment", "Terraform & AWS CDK", "Automated Security & Governance", "Disaster Recovery & Multi-Region"],
  },
  {
    title: "AWS Certified Developer Associate (DVA-C02)",
    category: "AWS",
    description: "DynamoDB, AWS SDK, SQS, SNS, EventBridge, Cognito, Step Functions & Serverless SAM.",
    duration: "2.5 Months",
    level: "Intermediate",
    rating: 4.89,
    studentsCount: 14500,
    price: 11999,
    originalPrice: 22000,
    isPopular: false,
    highlights: ["DynamoDB Single-Table Design", "Serverless Application Model (SAM)", "EventBridge & Step Functions", "Cognito User Pools & OAuth2"],
  },
  {
    title: "AWS Certified Security Specialty (SCS-C02)",
    category: "AWS",
    description: "AWS KMS, IAM Policy Evaluation, GuardDuty, Security Hub, WAF, Shield & CloudTrail Analysis.",
    duration: "2.5 Months",
    level: "Advanced",
    rating: 4.92,
    studentsCount: 8900,
    price: 14499,
    originalPrice: 26000,
    isPopular: false,
    highlights: ["KMS Key Policies & Encryption", "GuardDuty & Security Hub Automation", "AWS WAF Rule Tuning", "IAM Permission Boundaries"],
  },
  {
    title: "Microsoft Certified Azure Administrator (AZ-104)",
    category: "Azure",
    description: "Entra ID, Azure VMs, VNet Peering, Storage Accounts, ARM/Bicep Templates & Azure Backup.",
    duration: "3 Months",
    level: "Intermediate",
    rating: 4.95,
    studentsCount: 19800,
    price: 13499,
    originalPrice: 24000,
    isPopular: true,
    highlights: ["Microsoft Entra ID & RBAC", "Virtual Network Peering & VPNs", "ARM & Bicep IaC Provisioning", "Azure Backup & Disaster Recovery"],
  },
  {
    title: "Microsoft Azure Solutions Architect Expert (AZ-305)",
    category: "Azure",
    description: "High-Availability Azure Architecture, AKS, Azure SQL, CosmosDB, Event Hubs & Zero Trust.",
    duration: "3.5 Months",
    level: "Advanced",
    rating: 4.96,
    studentsCount: 11400,
    price: 16499,
    originalPrice: 30000,
    isPopular: true,
    highlights: ["Azure Kubernetes Service (AKS)", "CosmosDB Multi-Region Replication", "Zero-Trust Security Architecture", "Hybrid Cloud with Azure Arc"],
  },
  {
    title: "Microsoft Certified Azure DevOps Engineer (AZ-400)",
    category: "Azure",
    description: "Azure Pipelines, YAML Multi-stage Deployments, GitHub Actions, Terraform & SonarQube.",
    duration: "3 Months",
    level: "Advanced",
    rating: 4.91,
    studentsCount: 10200,
    price: 14999,
    originalPrice: 27000,
    isPopular: false,
    highlights: ["Azure DevOps YAML Pipelines", "GitHub Actions Enterprise CI/CD", "Terraform on Azure", "Security & Static Code Analysis"],
  },
  {
    title: "Google Cloud Associate Cloud Engineer (GCP ACE)",
    category: "GCP",
    description: "Compute Engine, GKE, Cloud Storage, VPC Peering, BigQuery, IAM & Cloud Run.",
    duration: "2.5 Months",
    level: "Intermediate",
    rating: 4.88,
    studentsCount: 9600,
    price: 12999,
    originalPrice: 23000,
    isPopular: false,
    highlights: ["Google Kubernetes Engine (GKE)", "Cloud Run & Serverless Containers", "VPC Shared & Peered Networks", "BigQuery Analytics & IAM"],
  },
  {
    title: "Google Cloud Professional Cloud Architect (GCP PCA)",
    category: "GCP",
    description: "Enterprise GCP Solution Design, Hybrid Interconnect, Anthos, Cloud Spanner & Security.",
    duration: "3.5 Months",
    level: "Advanced",
    rating: 4.93,
    studentsCount: 7100,
    price: 16999,
    originalPrice: 31000,
    isPopular: false,
    highlights: ["Multi-Region High Availability", "Google Anthos Hybrid Multi-Cloud", "Cloud Spanner Global Distributed SQL", "Security Command Center Pro"],
  },

  // 3. Cyber Security
  {
    title: "Certified Ethical Hacker (CEH v12) Practical Training",
    category: "Cyber Security",
    description: "Reconnaissance, Nmap, Metasploit, Wireshark, Web App Penetration, Burp Suite & Privilege Escalation.",
    duration: "3.5 Months",
    level: "Intermediate",
    rating: 4.97,
    studentsCount: 18700,
    price: 15499,
    originalPrice: 28000,
    isPopular: true,
    highlights: ["Network Footprinting & Scanning", "System Hacking & Metasploit", "Web App Pentesting with Burp Suite", "1:1 Live Capture the Flag (CTF)"],
  },
  {
    title: "CompTIA Security+ (SY0-701) Comprehensive Certification",
    category: "Cyber Security",
    description: "Threats, Attacks, Vulnerabilities, Cryptography, PKI, Incident Response & Identity Security.",
    duration: "2.5 Months",
    level: "Beginner",
    rating: 4.91,
    studentsCount: 15300,
    price: 11499,
    originalPrice: 21000,
    isPopular: false,
    highlights: ["Cyber Threat Vectors & Mitigation", "Public Key Infrastructure (PKI)", "Security Operations & Incident Response", "CompTIA Exam Question Simulator"],
  },
  {
    title: "SOC Analyst & Threat Hunting with SIEM (Splunk & Sentinel)",
    category: "Cyber Security",
    description: "Splunk Enterprise Security, Microsoft Sentinel, KQL Queries, Incident Triage & MITRE ATT&CK.",
    duration: "3 Months",
    level: "Intermediate",
    rating: 4.94,
    studentsCount: 10800,
    price: 14299,
    originalPrice: 26000,
    isPopular: true,
    highlights: ["Splunk SPL & Enterprise Security", "Microsoft Sentinel & KQL Rules", "MITRE ATT&CK Framework Mapping", "Real-World Ransomware Triage"],
  },
  {
    title: "Web Application Penetration Testing (OWASP Top 10)",
    category: "Cyber Security",
    description: "SQLi, XSS, SSRF, CSRF, IDOR, Authentication Bypass, API Pentesting with Postman & Burp Suite.",
    duration: "3 Months",
    level: "Advanced",
    rating: 4.93,
    studentsCount: 8900,
    price: 13999,
    originalPrice: 25000,
    isPopular: false,
    highlights: ["OWASP Top 10 In-Depth Labs", "GraphQL & REST API Pentesting", "JWT Vulnerabilities & Exploitation", "Automated & Manual Code Audit"],
  },
  {
    title: "Cloud Security & DevSecOps Engineering (SAST/DAST)",
    category: "Cyber Security",
    description: "SonarQube, Trivy, Snyk, Aqua Security, HashiCorp Vault, Kubernetes Security & CIS Benchmarks.",
    duration: "3.5 Months",
    level: "Advanced",
    rating: 4.95,
    studentsCount: 7600,
    price: 16499,
    originalPrice: 30000,
    isPopular: false,
    highlights: ["CI/CD Pipeline Security Gateways", "Container & K8s Security Scanning", "Secrets Management with Vault", "Infrastructure as Code Security"],
  },

  // 4. Networking (Cisco & Network Automation)
  {
    title: "Cisco Certified Network Associate (CCNA 200-301)",
    category: "Cisco",
    description: "IPv4/IPv6 Subnetting, VLANs, 802.1Q Trunks, STP, OSPFv2, NAT, ACLs & Python Network Automation.",
    duration: "3 Months",
    level: "Beginner",
    rating: 4.96,
    studentsCount: 23500,
    price: 12499,
    originalPrice: 22000,
    isPopular: true,
    highlights: ["Subnetting IPv4 & IPv6 Fast-Track", "Layer 2 Switching, VLANs & STP", "OSPFv2 Routing & NAT/ACLs", "Cisco Packet Tracer / GNS3 Labs"],
  },
  {
    title: "Cisco Certified Network Professional (CCNP Enterprise ENCOR)",
    category: "Cisco",
    description: "Dual-Stack Routing (BGP, EIGRP, OSPF), SD-WAN, Cisco DNA Center, QoS & Network Automation.",
    duration: "4 Months",
    level: "Advanced",
    rating: 4.94,
    studentsCount: 9200,
    price: 17499,
    originalPrice: 32000,
    isPopular: false,
    highlights: ["BGP Protocol & Enterprise WAN", "Cisco SD-WAN Architecture", "Wireless & QoS Optimization", "Python RESTCONF & NETCONF APIs"],
  },
  {
    title: "Network Automation with Python, Ansible & Nornir",
    category: "Cisco",
    description: "Netmiko, Scrapli, Paramiko, Jinja2 Templates, Ansible Network Playbooks & RESTCONF.",
    duration: "2.5 Months",
    level: "Intermediate",
    rating: 4.9,
    studentsCount: 6800,
    price: 11999,
    originalPrice: 21000,
    isPopular: false,
    highlights: ["Automating 100+ Routers with Python", "Ansible Network Configuration", "Jinja2 Configuration Templating", "GitOps for Network Engineering"],
  },

  // 5. Data & Analytics (Power BI, Tableau, SQL)
  {
    title: "Microsoft Power BI Data Analyst Associate (PL-300)",
    category: "Power BI",
    description: "Power Query (M Language), Star Schema Modeling, Complex DAX, Row-Level Security & Power BI Service.",
    duration: "2.5 Months",
    level: "Beginner",
    rating: 4.97,
    studentsCount: 28400,
    price: 10999,
    originalPrice: 20000,
    isPopular: true,
    highlights: ["Power Query ETL Transformations", "Star Schema & Data Modeling", "Advanced DAX Calculations", "Official PL-300 Exam Prep"],
  },
  {
    title: "Tableau Desktop & Server Business Intelligence Specialist",
    category: "Tableau",
    description: "Calculated Fields, LOD Expressions, Parameters, Dual-Axis Visualizations & Tableau Prep Builder.",
    duration: "2.5 Months",
    level: "Beginner",
    rating: 4.92,
    studentsCount: 16100,
    price: 10499,
    originalPrice: 19000,
    isPopular: false,
    highlights: ["Tableau Visual Analytics Best Practices", "Level of Detail (LOD) Expressions", "Interactive Storyboarding & Dashboards", "Tableau Server Deployment"],
  },
  {
    title: "Advanced SQL & Database Engineering for Analytics",
    category: "Data & Analytics",
    description: "Window Functions, CTEs, Recursive Queries, Query Execution Plans, Index Tuning & Stored Procedures.",
    duration: "2 Months",
    level: "Intermediate",
    rating: 4.95,
    studentsCount: 24700,
    price: 7999,
    originalPrice: 14000,
    isPopular: true,
    highlights: ["Advanced Analytical Window Functions", "Query Plan Optimization & Indexing", "Stored Procedures & Triggers", "Real-World Business KPI Queries"],
  },
  {
    title: "Data Engineering with Apache Spark, Kafka & Snowflake",
    category: "Data & Analytics",
    description: "PySpark DataFrames, Delta Lake, Structured Streaming, Snowflake Data Warehouse & dbt Core.",
    duration: "4 Months",
    level: "Advanced",
    rating: 4.96,
    studentsCount: 13900,
    price: 16999,
    originalPrice: 32000,
    isPopular: true,
    highlights: ["PySpark Distributed Computing", "Kafka Real-Time Data Pipelines", "Snowflake Cloud Data Warehouse", "dbt Data Transformation & CI/CD"],
  },

  // 6. Enterprise Technologies (SAP, Salesforce, ServiceNow)
  {
    title: "SAP S/4HANA Financial Accounting (FICO) Certification",
    category: "SAP",
    description: "General Ledger (G/L), Accounts Payable/Receivable, Asset Accounting, Cost Center & Profit Center Accounting.",
    duration: "3.5 Months",
    level: "Intermediate",
    rating: 4.96,
    studentsCount: 18900,
    price: 16499,
    originalPrice: 30000,
    isPopular: true,
    highlights: ["S/4HANA Universal Journal (ACDOCA)", "Accounts Payable & Receivable Automation", "Asset Accounting & Depreciation", "Controlling (CO) Profitability Analysis"],
  },
  {
    title: "SAP S/4HANA Materials Management (MM) & Sourcing",
    category: "SAP",
    description: "Purchasing, Inventory Management, Physical Inventory, Material Valuation & Invoice Verification (LIV).",
    duration: "3.5 Months",
    level: "Intermediate",
    rating: 4.91,
    studentsCount: 14300,
    price: 15499,
    originalPrice: 28000,
    isPopular: false,
    highlights: ["Procure-to-Pay (P2P) Full Lifecycle", "Material Master & Vendor Master Data", "Automatic Account Determination", "Inventory Movement Types & Stock"],
  },
  {
    title: "SAP S/4HANA Sales & Distribution (SD) Order-to-Cash",
    category: "SAP",
    description: "Sales Order Processing, Pricing Condition Technique, Outbound Delivery, Picking, Packing & Billing.",
    duration: "3.5 Months",
    level: "Intermediate",
    rating: 4.9,
    studentsCount: 13700,
    price: 15499,
    originalPrice: 28000,
    isPopular: false,
    highlights: ["Order-to-Cash (O2C) Business Cycle", "Condition Technique & Enterprise Pricing", "Shipping, Packing & Billing Documents", "Revenue Account Determination"],
  },
  {
    title: "SAP ABAP on S/4HANA & Core Data Services (CDS Views)",
    category: "SAP",
    description: "Modern ABAP 7.5+ Syntax, ABAP Dictionary (DDIC), CDS Views, AMDP & ABAP RESTful (RAP) Model.",
    duration: "3.5 Months",
    level: "Intermediate",
    rating: 4.93,
    studentsCount: 11500,
    price: 16499,
    originalPrice: 30000,
    isPopular: false,
    highlights: ["Modern ABAP Expression Syntax", "Core Data Services (CDS Views)", "ABAP Managed Database Procedures", "RESTful Application Programming (RAP)"],
  },
  {
    title: "Salesforce Certified Administrator (ADM-201)",
    category: "Salesforce",
    description: "Custom Objects, Schema Builder, Flow Automation, Validation Rules, Security & Reports/Dashboards.",
    duration: "2.5 Months",
    level: "Beginner",
    rating: 4.97,
    studentsCount: 22800,
    price: 12999,
    originalPrice: 24000,
    isPopular: true,
    highlights: ["Salesforce Data Security & Profiles", "Lightning Flow Builder Automation", "Custom Objects & Relationships", "Official ADM-201 Exam Simulator"],
  },
  {
    title: "Salesforce Platform Developer I (PD1) with Apex & LWC",
    category: "Salesforce",
    description: "Apex Triggers, SOQL/SOSL, Asynchronous Apex, Lightning Web Components (LWC) & Test Classes.",
    duration: "3.5 Months",
    level: "Intermediate",
    rating: 4.94,
    studentsCount: 15400,
    price: 15999,
    originalPrice: 29000,
    isPopular: true,
    highlights: ["Apex OOP & Trigger Design Patterns", "SOQL/SOSL Query Optimization", "Lightning Web Components (LWC)", "Unit Testing & Governor Limits"],
  },
  {
    title: "ServiceNow Certified System Administrator (CSA)",
    category: "ServiceNow",
    description: "ITSM Modules (Incident, Problem, Change), Service Catalog, Workflows, Flow Designer & ACLs.",
    duration: "2.5 Months",
    level: "Beginner",
    rating: 4.92,
    studentsCount: 12600,
    price: 13499,
    originalPrice: 25000,
    isPopular: false,
    highlights: ["ITSM Incident & Change Management", "Flow Designer & Workflow Automation", "Service Catalog & Client Scripts", "Access Control Lists (ACLs) Security"],
  },

  // 7. Project Management & Agile (PMP, Scrum, TOGAF)
  {
    title: "Project Management Professional (PMP) Exam Prep",
    category: "PMP",
    description: "PMBOK 7th Edition, Predictive, Agile & Hybrid Methodologies, People, Process & Business Environment.",
    duration: "2.5 Months",
    level: "Advanced",
    rating: 4.98,
    studentsCount: 19100,
    price: 14999,
    originalPrice: 28000,
    isPopular: true,
    highlights: ["35 Contact Hours Certificate", "PMBOK 7 & Agile Practice Guide", "Real-World Scenario Mock Exams", "PMP Application Review & Mentoring"],
  },
  {
    title: "Professional Scrum Master (PSM I & II) Certification",
    category: "Scrum",
    description: "Scrum Framework, Sprint Planning, Daily Scrum, Sprint Review/Retrospective & Agile Coaching.",
    duration: "1.5 Months",
    level: "Beginner",
    rating: 4.94,
    studentsCount: 14700,
    price: 8999,
    originalPrice: 16000,
    isPopular: false,
    highlights: ["Scrum Theory & Values", "Scrum Events & Artifacts Deep Dive", "Servant Leadership & Facilitation", "Scrum.org PSM I & II Exam Mocks"],
  },
  {
    title: "TOGAF Standard Version 9.2 Enterprise Architecture",
    category: "TOGAF",
    description: "Architecture Development Method (ADM), Business, Data, Application & Technology Architecture.",
    duration: "2 Months",
    level: "Advanced",
    rating: 4.89,
    studentsCount: 6400,
    price: 15499,
    originalPrice: 29000,
    isPopular: false,
    highlights: ["TOGAF ADM Phases A through H", "Enterprise Architecture Governance", "Business & Technology Transformation", "Official TOGAF Exam Practice"],
  },
  {
    title: "ITIL 4 Foundation IT Service Management",
    category: "Project Management",
    description: "Service Value System (SVS), Four Dimensions of Service Management & 34 ITIL Practices.",
    duration: "1.5 Months",
    level: "Beginner",
    rating: 4.91,
    studentsCount: 11200,
    price: 8499,
    originalPrice: 15000,
    isPopular: false,
    highlights: ["Service Value System (SVS)", "Guiding Principles of ITIL", "Continual Improvement Model", "ITIL 4 Foundation Practice Tests"],
  },

  // 8. Microsoft Server & IT Infrastructure
  {
    title: "Windows Server 2022 Hybrid Core Infrastructure (AZ-800)",
    category: "Microsoft",
    description: "Active Directory Domain Services (AD DS), Hyper-V, Storage Spaces, Azure Arc & Group Policy.",
    duration: "3 Months",
    level: "Intermediate",
    rating: 4.93,
    studentsCount: 13200,
    price: 12999,
    originalPrice: 24000,
    isPopular: false,
    highlights: ["Active Directory Domain Services", "Group Policy Objects (GPOs)", "Hyper-V Virtualization & Clustering", "Azure Arc Hybrid Management"],
  },
  {
    title: "Windows PowerShell & DevOps Automation Scripting",
    category: "Microsoft",
    description: "PowerShell 7+, Cmdlets, Script Modules, Regex, API Callouts, WMI/CIM & Desired State Configuration.",
    duration: "2 Months",
    level: "Intermediate",
    rating: 4.92,
    studentsCount: 10400,
    price: 8499,
    originalPrice: 15000,
    isPopular: false,
    highlights: ["PowerShell 7 Pipeline Mastery", "Custom Script Modules & Functions", "Active Directory & Office 365 Automation", "REST API & JSON Parsing in Scripts"],
  },
];

// 10 Principal Industry Mentors
const ALL_10_MENTORS = [
  {
    name: "Rajesh Kumar",
    role: "Principal Backend Architect",
    company: "Ex-Amazon",
    experience: "12+ Years",
    rating: 4.96,
    studentsMentored: 2400,
    skills: ["Java 21", "Spring Boot 3.x", "Microservices", "Kafka", "Docker", "AWS"],
    languages: ["English", "Hindi"],
    bio: "Ex-Amazon architect specializing in high-throughput distributed transaction engines and 1:1 systems coaching.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Vikram Nair",
    role: "Lead Full Stack Engineer",
    company: "Ex-Razorpay",
    experience: "10+ Years",
    rating: 4.95,
    studentsMentored: 2100,
    skills: ["React 19", "Next.js 15", "Node.js", "Express", "MongoDB", "TypeScript"],
    languages: ["English", "Hindi"],
    bio: "Ex-Razorpay engineer leading fintech payments and real-time dashboard architectures.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Priya Swaminathan",
    role: "Principal Cloud Security Architect",
    company: "Ex-Google Cloud",
    experience: "14+ Years",
    rating: 4.98,
    studentsMentored: 3200,
    skills: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "DevSecOps"],
    languages: ["English", "Tamil", "Hindi"],
    bio: "Principal Cloud Architect who has designed multi-region infrastructure for Fortune 500 tech firms.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Aditya Hegde",
    role: "Staff AI/ML Research Engineer",
    company: "Ex-Microsoft AI",
    experience: "11+ Years",
    rating: 4.97,
    studentsMentored: 1950,
    skills: ["PyTorch", "LLMs", "RAG Systems", "LangChain", "Deep Learning", "Python"],
    languages: ["English", "Kannada", "Hindi"],
    bio: "Specializing in Large Language Models (LLMs), RAG pipelines, and enterprise generative AI solutions.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Rameshwar Iyer",
    role: "Lead SAP FICO Solution Architect",
    company: "Ex-Accenture Strategy",
    experience: "16+ Years",
    rating: 4.99,
    studentsMentored: 4100,
    skills: ["SAP S/4HANA", "FICO", "MM", "SD", "ABAP CDS", "SuccessFactors"],
    languages: ["English", "Hindi", "Tamil"],
    bio: "Global SAP implementation consultant with 16+ years experience across 12 enterprise ERP rollouts.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Shreya Mukherjee",
    role: "Lead Salesforce Technical Architect",
    company: "Ex-Salesforce Partner",
    experience: "10+ Years",
    rating: 4.94,
    studentsMentored: 1850,
    skills: ["Salesforce Admin", "Apex", "LWC", "Service Cloud", "Sales Cloud", "Integrations"],
    languages: ["English", "Bengali", "Hindi"],
    bio: "Certified Salesforce Application & System Architect specializing in complex Lightning Web Components.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Sameer Deshpande",
    role: "Principal Network Solutions Architect",
    company: "Ex-Cisco Systems",
    experience: "15+ Years",
    rating: 4.96,
    studentsMentored: 2750,
    skills: ["CCNA", "CCNP", "BGP", "OSPF", "SD-WAN", "Python Network Automation"],
    languages: ["English", "Marathi", "Hindi"],
    bio: "CCIE Enterprise-certified architect training future network engineers on high-availability infrastructures.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Meera Krishnan",
    role: "Lead Business Intelligence Architect",
    company: "Ex-Deloitte Analytics",
    experience: "11+ Years",
    rating: 4.96,
    studentsMentored: 2300,
    skills: ["Power BI", "Tableau", "DAX", "SQL", "Snowflake", "Data Modeling"],
    languages: ["English", "Malayalam", "Hindi"],
    bio: "Enterprise BI consultant helping analysts master complex DAX calculations and data pipelines.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Anand Rathi",
    role: "Senior Enterprise Agile Coach",
    company: "Ex-Wipro Digital",
    experience: "14+ Years",
    rating: 4.93,
    studentsMentored: 2150,
    skills: ["PMP", "Scrum Master (PSM)", "Agile Coaching", "TOGAF", "ITIL 4", "Jira"],
    languages: ["English", "Hindi"],
    bio: "Certified PMP and enterprise agile coach training project managers across Fortune 500 corporations.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Zainab Fatima",
    role: "Lead Penetration Tester & SOC Lead",
    company: "Ex-KPMG Cyber",
    experience: "9+ Years",
    rating: 4.97,
    studentsMentored: 1650,
    skills: ["CEH", "Security+", "Splunk SIEM", "Burp Suite", "Metasploit", "Threat Hunting"],
    languages: ["English", "Urdu", "Hindi"],
    bio: "Offensive security practitioner and CEH trainer specializing in web application security and SIEM defense.",
    hourlyRate: "Free 1:1 Demo",
    linkedin: "https://linkedin.com",
  },
];

// Initial Resources
const INITIAL_RESOURCES = [
  {
    title: "Complete Java 21 & Spring Boot 3.x Production Handbook",
    category: "PDF Notes",
    description: "In-depth notes on Virtual Threads, Spring Security filters, Hibernate ORM, and Kafka event streaming.",
    format: "PDF",
    fileSize: "8.4 MB",
    downloadsCount: "14.2k",
    tags: ["Java", "Spring Boot", "Microservices"],
  },
  {
    title: "Modern React 19 & Next.js 15 Cheat Sheet",
    category: "Cheat Sheets",
    description: "Syntax reference for Server Components, Server Actions, Custom Hooks, Zustand, and Tailwind styling.",
    format: "PDF",
    fileSize: "2.8 MB",
    downloadsCount: "18.9k",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    title: "Top 100 Backend & System Design Interview Questions",
    category: "Interview Questions",
    description: "Curated questions with detailed architectural answers for SDE 1, SDE 2, and Senior Backend roles.",
    format: "PDF",
    fileSize: "5.1 MB",
    downloadsCount: "22.5k",
    tags: ["System Design", "HLD / LLD", "Interviews"],
  },
  {
    title: "ATS-Optimized Full Stack Developer Resume Template",
    category: "Resume Templates",
    description: "Pre-formatted, recruiter-tested LaTeX and Word template designed to score 95+ on enterprise ATS scanners.",
    format: "DOCX",
    fileSize: "1.2 MB",
    downloadsCount: "29.1k",
    tags: ["Resume", "ATS Friendly", "Career"],
  },
  {
    title: "AWS Solutions Architect Associate SAA-C03 Quick Revision Guide",
    category: "PDF Notes",
    description: "High-yield summary notes covering VPC, S3 storage tiers, IAM policies, and serverless compute.",
    format: "PDF",
    fileSize: "6.7 MB",
    downloadsCount: "16.4k",
    tags: ["AWS", "Cloud", "SAA-C03"],
  },
  {
    title: "Certified Ethical Hacker (CEH v12) Tools & Commands Reference",
    category: "Cheat Sheets",
    description: "Quick commands handbook for Nmap, Wireshark, Metasploit, Gobuster, SQLmap, and Hydra.",
    format: "PDF",
    fileSize: "3.4 MB",
    downloadsCount: "11.3k",
    tags: ["Security", "CEH", "Ethical Hacking"],
  },
  {
    title: "Power BI DAX Formulas & Data Modeling Field Guide",
    category: "PDF Notes",
    description: "Comprehensive guide to Time Intelligence DAX functions, Star Schemas, and Power Query transformations.",
    format: "PDF",
    fileSize: "4.6 MB",
    downloadsCount: "9.7k",
    tags: ["Power BI", "DAX", "SQL"],
  },
  {
    title: "Salesforce Admin & Apex Developer Interview Questions",
    category: "Interview Questions",
    description: "Triggers, Governor Limits, LWC lifecycle hooks, and asynchronous Apex scenario-based questions.",
    format: "PDF",
    fileSize: "3.9 MB",
    downloadsCount: "8.2k",
    tags: ["Salesforce", "Apex", "LWC"],
  },
  {
    title: "SAP S/4HANA FICO Business Process Flowcharts & T-Codes",
    category: "PDF Notes",
    description: "End-to-end P2P and O2C financial integration cheat sheet with essential S/4HANA transaction codes.",
    format: "PDF",
    fileSize: "5.8 MB",
    downloadsCount: "12.8k",
    tags: ["SAP", "FICO", "ERP"],
  },
  {
    title: "Data Structures & Algorithms 75 Essential Patterns Roadmap",
    category: "Roadmaps",
    description: "High-yield LeetCode patterns visual flowchart with code templates in Java, Python, and C++.",
    format: "PDF",
    fileSize: "4.1 MB",
    downloadsCount: "35.4k",
    tags: ["DSA", "LeetCode", "Algorithms"],
  },
];

// Initial Certificates
const INITIAL_CERTIFICATES = [
  {
    title: "Java Backend & Spring Boot Microservices Architecture",
    category: "Java Backend",
    studentName: "Aditya Sharma",
    completionDate: "Aug 2026",
    credentialId: "KRT-2026-JAVA-9102",
    grade: "Grade A+ (96%)",
    skills: ["Java 21", "Spring Boot 3.x", "Microservices", "Kafka", "Docker"],
  },
  {
    title: "MERN Full Stack & Next.js 15 SaaS Engineering",
    category: "MERN Stack",
    studentName: "Kavya Patel",
    completionDate: "Jul 2026",
    credentialId: "KRT-2026-MERN-8401",
    grade: "Grade A (94%)",
    skills: ["React 19", "Node.js", "Express", "MongoDB", "Next.js"],
  },
  {
    title: "AWS Certified Solutions Architect Associate Track",
    category: "AWS",
    studentName: "Siddharth Verma",
    completionDate: "Aug 2026",
    credentialId: "KRT-2026-AWS-7729",
    grade: "Grade A+ (98%)",
    skills: ["AWS VPC", "EC2 & S3", "IAM", "ECS Fargate", "CloudFormation"],
  },
  {
    title: "Microsoft Azure Administrator (AZ-104) & Hybrid Cloud",
    category: "Azure",
    studentName: "Meenakshi Iyer",
    completionDate: "Aug 2026",
    credentialId: "KRT-2026-AZ-6612",
    grade: "Grade A (92%)",
    skills: ["Azure Entra ID", "Virtual Networks", "ARM Templates", "Azure Backup"],
  },
  {
    title: "Certified Ethical Hacker (CEH) & SOC Threat Hunting",
    category: "Cyber Security",
    studentName: "Rohan Deshmukh",
    completionDate: "Jul 2026",
    credentialId: "KRT-2026-CEH-5503",
    grade: "Grade A+ (97%)",
    skills: ["Burp Suite", "Metasploit", "Splunk", "Nmap", "Wireshark"],
  },
  {
    title: "SAP S/4HANA Financial Accounting (FICO) Specialist",
    category: "SAP",
    studentName: "Ananya Roy",
    completionDate: "Aug 2026",
    credentialId: "KRT-2026-SAP-4391",
    grade: "Grade A (95%)",
    skills: ["SAP FICO", "General Ledger", "Accounts Payable", "Asset Accounting"],
  },
];

// Initial Demo Leads
const INITIAL_LEADS = [
  {
    name: "Aakash Sharma",
    email: "aakash.s@gmail.com",
    phone: "+91 98765 43210",
    course: "Complete Java Backend Development with Spring Boot & Microservices",
    preferredTime: "Evening (7:00 PM - 9:00 PM IST)",
    timeZone: "IST (India · UTC+5:30)",
    message: "Interested in 1:1 mentorship for microservices architecture.",
    status: "New",
  },
  {
    name: "Sneha Reddy",
    email: "sneha.reddy@outlook.com",
    phone: "+91 98123 45678",
    course: "MERN Stack Full Stack Web Development Mastery Bootcamp",
    preferredTime: "Morning (10:00 AM - 12:00 PM IST)",
    timeZone: "IST (India · UTC+5:30)",
    message: "Transitioning from frontend to full stack development.",
    status: "Scheduled",
  },
  {
    name: "Rohan Varma",
    email: "rohan.varma@techmail.com",
    phone: "+91 99887 66554",
    course: "AWS Certified Solutions Architect Associate (SAA-C03)",
    preferredTime: "Night (8:30 PM - 10:30 PM IST)",
    timeZone: "EST (USA East · UTC-5)",
    message: "Looking for real-world project mentorship on fine-tuning architectures.",
    status: "Contacted",
  },
];

async function seedDatabase() {
  console.log('--- Seeding KR Tech MongoDB Database ---');
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB:', mongoose.connection.name);

    // 1. Seed Admin User
    let adminUser = await User.findOne({ email: 'admin@krtech.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'KR Tech Administrator',
        email: 'admin@krtech.com',
        password: 'admin123',
        phone: '+91 98765 43210',
        role: 'admin',
      });
      console.log('✅ Admin User Created: admin@krtech.com / admin123');
    } else {
      console.log('ℹ️ Admin User already exists: admin@krtech.com');
    }

    // 2. Seed Default Student User
    let studentUser = await User.findOne({ email: 'aditya.sharma@krtech.edu' });
    if (!studentUser) {
      studentUser = await User.create({
        name: 'Aditya Sharma',
        email: 'aditya.sharma@krtech.edu',
        password: 'Password@123',
        phone: '+91 98765 00001',
        role: 'student',
        enrolledCourses: [
          {
            courseId: 'java-backend',
            title: 'Complete Java Backend Development with Spring Boot & Microservices',
            progress: 72,
          }
        ]
      });
      console.log('✅ Student User Created: aditya.sharma@krtech.edu');
    }

    // 3. Seed Courses (55 courses)
    await Course.deleteMany({});
    const coursesWithSlugs = ALL_55_COURSES.map(c => ({
      ...c,
      id: c.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
    const insertedCourses = await Course.insertMany(coursesWithSlugs);
    console.log(`✅ Courses Seeded: ${insertedCourses.length} courses inserted.`);

    // 4. Seed Mentors (10 mentors)
    await Mentor.deleteMany({});
    const insertedMentors = await Mentor.insertMany(ALL_10_MENTORS);
    console.log(`✅ Mentors Seeded: ${insertedMentors.length} mentors inserted.`);

    // 5. Seed Resources
    await Resource.deleteMany({});
    const insertedResources = await Resource.insertMany(INITIAL_RESOURCES);
    console.log(`✅ Resources Seeded: ${insertedResources.length} resources inserted.`);

    // 6. Seed Certificates
    await Certificate.deleteMany({});
    const insertedCertificates = await Certificate.insertMany(INITIAL_CERTIFICATES);
    console.log(`✅ Certificates Seeded: ${insertedCertificates.length} certificates inserted.`);

    // 7. Seed Leads
    const existingLeadsCount = await Lead.countDocuments();
    if (existingLeadsCount === 0) {
      await Lead.insertMany(INITIAL_LEADS);
      console.log(`✅ Leads Seeded: ${INITIAL_LEADS.length} demo leads inserted.`);
    }

    // Print Collection Summary
    const userCount = await User.countDocuments();
    const leadCount = await Lead.countDocuments();
    const courseCount = await Course.countDocuments();
    const mentorCount = await Mentor.countDocuments();
    const resourceCount = await Resource.countDocuments();
    const certCount = await Certificate.countDocuments();

    console.log('\n=======================================');
    console.log('       MONGODB COLLECTION COUNTS       ');
    console.log('=======================================');
    console.log(`users        -> ${userCount} document(s)`);
    console.log(`leads        -> ${leadCount} document(s)`);
    console.log(`courses      -> ${courseCount} document(s)`);
    console.log(`mentors      -> ${mentorCount} document(s)`);
    console.log(`resources    -> ${resourceCount} document(s)`);
    console.log(`certificates -> ${certCount} document(s)`);
    console.log('=======================================\n');

    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    return false;
  }
}

seedDatabase().then(success => process.exit(success ? 0 : 1));
