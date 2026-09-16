const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const Resource = require('./models/Resource');

const ALL_RESOURCES = [
  {
    id: "java-21-spring-boot-production-handbook",
    title: "Complete Java 21 & Spring Boot 3.x Production Handbook",
    category: "PDF Notes",
    description: "In-depth notes on Virtual Threads, Spring Security 6 filters, Hibernate 6 ORM, and Kafka event streaming.",
    format: "PDF",
    fileSize: "8.4 MB",
    downloadsCount: "14.2k",
    tags: ["Java", "Spring Boot", "Microservices", "Kafka"],
    author: "KR Tech Backend Guild",
    content: `
# Java 21 & Spring Boot 3.x Production Architecture Handbook
*Author: KR Tech Senior Architect Council · Version: 2026.1*

## 1. Java 21 Virtual Threads (Project Loom)
Virtual threads are lightweight threads managed by the Java Virtual Machine rather than the underlying operating system.
They allow millions of concurrent tasks to execute simultaneously without thread pool exhaustion.

\`\`\`java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
}
\`\`\`

## 2. Spring Security 6 Architecture
Spring Security 6 enforces stateless SecurityFilterChain bean configuration with zero WebSecurityConfigurerAdapter legacy code.

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }
}
\`\`\`

## 3. Distributed Microservices & Kafka Dead Letter Queues
Always decouple synchronous REST calls with event-driven message brokers:
- Producer: Acknowledgment level \`acks=all\` with idempotence enabled.
- Consumer: Dead Letter Queue (DLQ) retry backoff with exponential multiplier.
    `,
  },
  {
    id: "modern-react-19-nextjs-15-cheat-sheet",
    title: "Modern React 19 & Next.js 15 Cheat Sheet",
    category: "Cheat Sheets",
    description: "Essential syntax for Server Actions, useActionState, useOptimistic, Turbopack, and App Router caching patterns.",
    format: "PDF",
    fileSize: "4.2 MB",
    downloadsCount: "22.8k",
    tags: ["React 19", "Next.js 15", "TypeScript", "Frontend"],
    author: "KR Tech Frontend Chapter",
    content: `
# Modern React 19 & Next.js 15 App Router Architecture
*Author: KR Tech Web Architecture Team*

## 1. React 19 Actions & useActionState
Actions handle async transitions automatically with built-in pending states and error handling.

\`\`\`tsx
import { useActionState } from 'react';

async function updateName(prevState: any, formData: FormData) {
  const name = formData.get('name');
  await api.save(name);
  return { success: true, name };
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateName, null);
  return (
    <form action={formAction}>
      <input name="name" required />
      <button disabled={isPending}>{isPending ? 'Saving...' : 'Update'}</button>
    </form>
  );
}
\`\`\`

## 2. useOptimistic Hook
Instantly update the user interface while network requests resolve in the background.

\`\`\`tsx
const [optimisticMessages, setOptimisticMessages] = useOptimistic(
  messages,
  (state, newMessage) => [...state, { text: newMessage, sending: true }]
);
\`\`\`

## 3. Next.js 15 Caching Rules
- \`fetch\` requests are now un-cached by default (\`cache: 'no-store'\`).
- Use \`unstable_cache\` or \`revalidateTag\` for granular invalidation.
    `,
  },
  {
    id: "top-100-backend-system-design-interview-questions",
    title: "Top 100 Backend & System Design Interview Questions",
    category: "Interview Questions",
    description: "Curated questions asked at Google, Amazon, Microsoft, and Uber with detailed architectural diagrams.",
    format: "PDF",
    fileSize: "12.1 MB",
    downloadsCount: "38.5k",
    tags: ["System Design", "Backend", "Interviews", "Scalability"],
    author: "KR Tech Principal Mentors",
    content: `
# Top 100 Backend & System Design Master Preparation
*Author: KR Tech MAANG Interview Panel*

## 1. High-Level Architecture: Rate Limiter
### Token Bucket Algorithm
- **Capacity**: Bucket holds max $B$ tokens.
- **Refill Rate**: $R$ tokens per second added continuously.
- **Operation**: Each request consumes 1 token. Drop or queue if empty.
- **Redis Implementation**: Use \`EVAL\` script with \`HSET\` and timestamps to ensure atomic decrement across cluster nodes.

## 2. Designing a URL Shortener (Bitly)
- **Scale**: 100M URLs created per month, 10:1 read to write ratio.
- **Base62 Encoding**: 62 characters [a-z, A-Z, 0-9].
- With 7 characters: $62^7 \\approx 3.5$ trillion combinations.
- **Key Generation Service (KGS)**: Standalone microservice generating pre-computed random unique strings into DB to prevent race conditions.

## 3. Database Sharding vs Partitioning
- Vertical Partitioning: Separate columns into different tables.
- Horizontal Sharding: Distribute rows across multiple machines via consistent hashing.
    `,
  },
  {
    id: "ats-optimized-full-stack-developer-resume-template",
    title: "ATS-Optimized Full Stack Developer Resume Template",
    category: "Resume Templates",
    description: "Field-tested LaTeX and Word templates that pass 99% of Automated Tracking Systems with scoring rubrics.",
    format: "DOCX & PDF",
    fileSize: "1.8 MB",
    downloadsCount: "45.1k",
    tags: ["Career", "Resume", "ATS", "Job Search"],
    author: "KR Tech Placement Council",
    content: `
# ATS-Optimized Technical Resume Guide & Template
*Validated with Workday, Greenhouse, Taleo, and Lever ATS parsers*

## Key Formula for Impact Bullets (Google XYZ Formula)
**Accomplished [X] as measured by [Y], by doing [Z].**

### Good Example:
"Engineered distributed microservices in Java 21 & Kafka, reducing API latency from 320ms to 48ms (85% reduction) across 2.4M daily active users."

### Bad Example:
"Worked on Java microservices and improved performance."

## Recommended Resume Hierarchy:
1. Contact Header (Name, Phone, Professional Email, LinkedIn, GitHub, Portfolio)
2. Professional Summary (Optional, 2 lines max)
3. Technical Skills (Languages, Frameworks, Cloud & DevOps, Databases)
4. Professional Experience (Chronological, bulleted)
5. Production Projects (Include live links & GitHub)
6. Education & Certifications
    `,
  },
  {
    id: "complete-cloud-solutions-architect-2026-roadmap",
    title: "Complete Cloud Solutions Architect 2026 Roadmap",
    category: "Roadmaps",
    description: "Step-by-step career path covering AWS, Azure, GCP, Terraform, Kubernetes, and FinOps with milestone checklists.",
    format: "PDF",
    fileSize: "6.5 MB",
    downloadsCount: "29.4k",
    tags: ["Cloud", "DevOps", "AWS", "Kubernetes", "Terraform"],
    author: "KR Tech Cloud Architects",
    content: `
# Cloud Solutions Architect Roadmap (2026 Edition)
*Master cloud infrastructure, high-availability design, and cost governance.*

## Phase 1: Foundations
- Linux Kernel fundamentals, Bash scripting, TCP/IP, DNS, TLS 1.3
- GitOps workflows and CI/CD pipelines

## Phase 2: Core Cloud (AWS / Azure / GCP)
- Virtual Private Clouds (VPCs), Subnets, Route Tables, NAT Gateways
- Compute: Auto-scaling EC2, Lambda Serverless, ECS Fargate
- Storage: S3 lifecycle rules, Glacier deep archive, EBS gp3 volumes

## Phase 3: Infrastructure as Code (IaC)
- Terraform modules, remote state locking in S3 + DynamoDB
- Drift detection and automated terraform plan reviews in GitHub Actions

## Phase 4: Container Orchestration & Service Mesh
- Kubernetes cluster setup, Helm charts, Ingress NGINX, Istio service mesh
- Prometheus and Grafana observability stack
    `,
  },
  {
    id: "cyber-security-ethical-hacking-command-line-cheat-sheet",
    title: "Cyber Security & Ethical Hacking Command Line Cheat Sheet",
    category: "Cheat Sheets",
    description: "Quick reference for Nmap, Wireshark, Metasploit, Burp Suite, Hashcat, and active directory reconnaissance.",
    format: "PDF",
    fileSize: "5.1 MB",
    downloadsCount: "19.7k",
    tags: ["Cyber Security", "Networking", "Pen Testing", "Linux"],
    author: "KR Tech Security Operations",
    content: `
# Ethical Hacking & Red Team Command Reference
*Authorized penetration testing and defensive vulnerability assessment.*

## 1. Network Reconnaissance (Nmap)
\`\`\`bash
# Fast aggressive scan with service detection & default scripts
nmap -sC -sV -T4 -p- target-ip -oN nmap_all_ports.txt

# UDP port discovery for high-priority services (DNS, SNMP, NTP)
nmap -sU --top-ports 50 target-ip
\`\`\`

## 2. Web Vulnerability Discovery
\`\`\`bash
# Directory and file brute-forcing
gobuster dir -u http://target.local -w /usr/share/wordlists/dirb/common.txt -t 40 -x php,html,js

# SQL Injection automation testing
sqlmap -u "http://target.local/vuln.php?id=1" --batch --dbs
\`\`\`

## 3. Cryptography & Password Cracking
\`\`\`bash
# Hashcat dictionary attack with rule-based mutations
hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule
\`\`\`
    `,
  },
  {
    id: "power-bi-dax-formulas-data-modeling-field-guide",
    title: "Power BI DAX Formulas & Data Modeling Field Guide",
    category: "PDF Notes",
    description: "Master CALCULATE, FILTER, ALLSELECTED, Time Intelligence functions, Star Schema design, and performance tuning.",
    format: "PDF",
    fileSize: "9.7 MB",
    downloadsCount: "16.3k",
    tags: ["Power BI", "Data Analytics", "DAX", "SQL"],
    author: "KR Tech BI Guild",
    content: `
# Power BI DAX & High-Performance Data Modeling
*Author: KR Tech Data & Analytics Division*

## 1. The Soul of DAX: CALCULATE & Context Transition
\`\`\`dax
Total Sales YTD = 
CALCULATE(
    SUM(FactSales[Revenue]),
    DATESYTD(DimDate[FullDateAlternateKey])
)

Sales Prior Year = 
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR(DimDate[FullDateAlternateKey])
)
\`\`\`

## 2. Star Schema Best Practices
- Never create Many-to-Many bidirectional relationships without bridge tables.
- Keep Fact tables narrow and numeric; push textual descriptive columns to Dimension tables.
- Disable auto date/time in Power BI Options to reduce .pbix file sizes by up to 70%.
    `,
  },
  {
    id: "data-structures-algorithms-75-essential-patterns-roadmap",
    title: "Data Structures & Algorithms 75 Essential Patterns Roadmap",
    category: "Roadmaps",
    description: "The definitive 75 LeetCode problem patterns: Two Pointers, Sliding Window, Monotonic Stack, Backtracking, and DP.",
    format: "PDF",
    fileSize: "7.3 MB",
    downloadsCount: "52.0k",
    tags: ["DSA", "LeetCode", "Algorithms", "Coding"],
    author: "KR Tech Competitive Programming Lead",
    content: `
# 75 Essential DSA Coding Patterns & Roadmap
*Curated pattern categorization for FAANG/MNC coding rounds.*

## 1. Sliding Window (O(N) Time, O(1) Space)
Identify problems requiring subarray or substring calculation:
- Minimum Size Subarray Sum
- Longest Substring Without Repeating Characters
- Permutation in String

## 2. Two Pointers (Left & Right / Slow & Fast)
- Sorted array two sum
- 3Sum zero target
- Linked list cycle detection (Floyd's Tortoise & Hare)

## 3. Dynamic Programming 5-Step Recipe
1. Define the sub-problem state \`dp[i][j]\`.
2. Find the recurrence relation base cases.
3. Determine topological ordering (bottom-up vs memoized top-down).
4. Identify space optimization (e.g. tracking only previous 2 rows).
    `,
  },
  {
    id: "sap-s4hana-fico-business-process-flowcharts",
    title: "SAP S/4HANA FICO Business Process Flowcharts & T-Codes",
    category: "PDF Notes",
    description: "Complete guide covering General Ledger, Accounts Payable, Accounts Receivable, Asset Accounting, and T-Code index.",
    format: "PDF",
    fileSize: "11.2 MB",
    downloadsCount: "18.9k",
    tags: ["SAP", "FICO", "ERP", "Finance", "Enterprise"],
    author: "KR Tech SAP Enterprise Practice",
    content: `
# SAP S/4HANA Finance (FICO) Configuration & T-Code Blueprint
*Author: KR Tech Enterprise ERP Council*

## 1. General Ledger & Universal Journal (ACDOCA)
In SAP S/4HANA, the Universal Journal table \`ACDOCA\` brings together General Ledger, Asset Accounting, Controlling, and Material Ledger into a single source of financial truth.

### Key T-Codes:
- \`FB50\` / \`F-02\`: Enter G/L Account Document
- \`FAGLL03\`: Display G/L Account Line Items
- \`OB52\`: Open and Close Posting Periods
- \`FS00\`: Centrally Maintain Master G/L Records

## 2. Accounts Payable (P2P Cycle)
Purchase Order (ME21N) -> Goods Receipt (MIGO) -> Invoice Verification (MIRO) -> Automatic Payment Program (F110).

## 3. Asset Accounting (FI-AA)
- \`AS01\`: Create Asset Master
- \`AFAB\`: Execute Depreciation Run
    `,
  },
  {
    id: "salesforce-admin-apex-developer-interview-guide",
    title: "Salesforce Admin & Apex Developer Interview Questions",
    category: "Interview Questions",
    description: "120+ scenario questions covering Governor Limits, Triggers, Lightning Web Components (LWC), and Security Models.",
    format: "Interview Questions",
    fileSize: "8.1 MB",
    downloadsCount: "21.4k",
    tags: ["Salesforce", "Apex", "LWC", "CRM", "Cloud"],
    author: "KR Tech Salesforce Alliance",
    content: `
# Salesforce Admin & Apex Developer Mastery Guide
*Author: KR Tech Salesforce Center of Excellence*

## 1. Apex Governor Limits & Bulkification
Always write triggers that handle collections of sObjects, never single records.

\`\`\`java
trigger AccountTrigger on Account (after update) {
    List<Contact> contactsToUpdate = new List<Contact>();
    Set<Id> accountIds = Trigger.newMap.keySet();
    
    // SOQL query outside loop
    for (Contact c : [SELECT Id, AccountId, MailingCity FROM Contact WHERE AccountId IN :accountIds]) {
        Account parentAcc = Trigger.newMap.get(c.AccountId);
        c.MailingCity = parentAcc.BillingCity;
        contactsToUpdate.add(c);
    }
    
    // DML statement outside loop
    if (!contactsToUpdate.isEmpty()) {
        update contactsToUpdate;
    }
}
\`\`\`

## 2. Lightning Web Components (LWC) Architecture
- Shadow DOM encapsulation for component styles.
- \`@wire\` adapter for automatic reactive caching with Lightning Data Service.
    `,
  },
  {
    id: "aws-solutions-architect-associate-saa-c03-guide",
    title: "AWS Solutions Architect Associate SAA-C03 Quick Revision Guide",
    category: "Cheat Sheets",
    description: "High-yield summary of VPC peering, transit gateways, RDS Multi-AZ vs Read Replicas, SQS FIFO, and IAM roles.",
    format: "PDF",
    fileSize: "6.9 MB",
    downloadsCount: "34.1k",
    tags: ["AWS", "SAA-C03", "Certifications", "Cloud Architecture"],
    author: "KR Tech AWS Certified Champions",
    content: `
# AWS SAA-C03 High-Yield Exam Cram Sheet
*Author: KR Tech AWS Certification Chapter*

## 1. Storage Comparison
- **S3 Standard**: 99.999999999% (11 9's) durability. Millisecond access.
- **S3 Intelligent-Tiering**: Auto cost optimization without retrieval fees.
- **EFS**: Linux network file system accessible across multiple EC2 instances simultaneously.
- **EBS**: Block storage attached to a single EC2 within the SAME Availability Zone.

## 2. High Availability & Disaster Recovery
- **RDS Multi-AZ**: Synchronous standby replica in another AZ for disaster recovery (automatic failover).
- **RDS Read Replicas**: Asynchronous replication for read-heavy scaling (up to 15 replicas across regions).
- **Route 53 Routing Policies**: Weighted, Latency, Failover (Health checks), Geolocation, and Multi-Value Answer.
    `,
  },
  {
    id: "ceh-v12-certified-ethical-hacker-reference",
    title: "Certified Ethical Hacker (CEH v12) Tools & Commands Reference",
    category: "Cheat Sheets",
    description: "Comprehensive blueprint of reconnaissance tools, cryptography standards, wireless attack vectors, and incident response.",
    format: "PDF",
    fileSize: "7.8 MB",
    downloadsCount: "25.7k",
    tags: ["CEH", "Ethical Hacking", "Security", "Tools"],
    author: "KR Tech Cyber Defense Force",
    content: `
# CEH v12 Tools & Defense Operations Manual
*Practical commands and defensive countermeasures.*

## 1. Footprinting & OSINT
- Whois, Netcraft, Maltego, theHarvester
\`\`\`bash
theHarvester -d example.com -l 500 -b google,linkedin
\`\`\`

## 2. Cryptographic Protocols
- Asymmetric: RSA (factoring primes), ECC (Elliptic curves - smaller key size, equal strength).
- Symmetric: AES-256 (GCM mode preferred for authenticated encryption).
- Hashing: SHA-256 / SHA-3 for integrity verification (avoid MD5 and SHA-1).

## 3. Incident Response Lifecycle
1. Preparation -> 2. Detection & Analysis -> 3. Containment -> 4. Eradication -> 5. Recovery -> 6. Lessons Learned.
    `,
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('Connected to Atlas successfully!');

    // First, clear out old partial/unformatted documents
    console.log('Cleaning old duplicate/partial resources...');
    await Resource.deleteMany({});

    console.log(`Inserting ${ALL_RESOURCES.length} enriched production resources...`);
    for (const item of ALL_RESOURCES) {
      await Resource.create({
        ...item,
        downloadUrl: `/api/resources/${item.id}/download`,
      });
      console.log(`+ Added: "${item.title}" (${item.category})`);
    }

    const count = await Resource.countDocuments();
    console.log(`\nAll done! Final resource count in MongoDB Atlas: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
