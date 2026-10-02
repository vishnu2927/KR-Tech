const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const SEED_BLOGS = [
  {
    title: 'Building Resilient Microservices with Spring Boot 3 & Kafka Event Sourcing',
    slug: 'spring-boot-3-kafka-event-sourcing',
    excerpt: 'Deep dive into event-driven choreography, idempotent consumers, outbox pattern, and distributed transaction boundaries in high-throughput enterprise systems.',
    category: 'Backend Engineering',
    tags: ['Spring Boot 3', 'Kafka', 'Microservices', 'Distributed Systems', 'Architecture'],
    featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop&auto=format',
    author: {
      name: 'Rajesh Kumar',
      role: 'Senior Technical Architect · Principal Technical Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&auto=format',
    },
    readTime: '8 min read',
    views: 1840,
    likes: 142,
    status: 'published',
    publishedAt: new Date('2026-09-10T10:00:00Z'),
    seo: {
      metaTitle: 'Spring Boot 3 & Kafka Event Sourcing Guide (2026) | KR Tech',
      metaDescription: 'Master enterprise microservices resilience with Spring Boot 3 and Kafka event sourcing. Learn transactional outbox and idempotent processing patterns.',
      canonicalUrl: 'https://krtech.edu/blogs/spring-boot-3-kafka-event-sourcing',
      keywords: ['Spring Boot 3', 'Kafka', 'Microservices', 'Outbox Pattern', 'Distributed Systems'],
    },
    content: `# Building Resilient Microservices with Spring Boot 3 & Kafka Event Sourcing

## Introduction
In distributed enterprise architectures, standard synchronous REST orchestration frequently leads to cascading failures, high tail latencies, and tight service coupling. Event sourcing with Apache Kafka combined with the reactive enhancements in **Spring Boot 3.2** provides an exceptional blueprint for resilient distributed architectures.

## The Transactional Outbox Pattern
When emitting events after database persistence, dual-write anomalies can leave your state out of sync if the broker goes offline. The **Transactional Outbox Pattern** ensures that state mutation and event recording occur within the same local ACID transaction.

\`\`\`java
@Transactional
public Order createOrder(OrderRequest request) {
    Order order = orderRepository.save(new Order(request));
    OutboxEvent event = new OutboxEvent(
        "OrderCreated",
        order.getId(),
        objectMapper.writeValueAsString(order)
    );
    outboxRepository.save(event);
    return order;
}
\`\`\`

## Consumer Idempotency & De-duplication
Networks are unreliable; messages will be redelivered. Ensure all message listeners enforce consumer deduplication using distributed Redis locks or relational unique constraints on \`messageId\`.

## Conclusion
Adopting event sourcing with Spring Boot 3 empowers engineering teams to scale throughput past 25,000 events/second while preserving strict auditability and disaster recovery guarantees.`,
  },
  {
    title: 'High-Scale Distributed Caching: Redis Multi-Level Patterns at 50,000 QPS',
    slug: 'redis-multi-level-caching-patterns',
    excerpt: 'Architecting ultra-low latency cache hierarchies with local in-memory L1 cache (Caffeine) and distributed L2 Redis cluster with probabilistic cache stampede prevention.',
    category: 'System Design',
    tags: ['Redis', 'System Design', 'Caching', 'Scalability', 'High Availability'],
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&auto=format',
    author: {
      name: 'Vishnu Vardhan',
      role: 'Principal System Architect · KR Tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&auto=format',
    },
    readTime: '7 min read',
    views: 2450,
    likes: 218,
    status: 'published',
    publishedAt: new Date('2026-09-08T12:00:00Z'),
    seo: {
      metaTitle: 'Distributed Caching: Redis Multi-Level Patterns at 50k QPS | KR Tech',
      metaDescription: 'Learn how to architect high-throughput cache hierarchies with L1 Caffeine and L2 Redis to handle 50,000 QPS without cache stampedes.',
      canonicalUrl: 'https://krtech.edu/blogs/redis-multi-level-caching-patterns',
      keywords: ['Redis', 'System Design', 'Cache Stampede', 'Caffeine', 'Scalability'],
    },
    content: `# High-Scale Distributed Caching: Redis Multi-Level Patterns at 50,000 QPS

## The Challenge: Database Saturation at Peak Traffic
When user concurrency spikes, hitting a centralized relational database for read-heavy operations causes connection pool exhaustion and thread lock contention. A single Redis instance caps around 80,000 operations/second on modern hardware.

## The Dual-Layer Hierarchy (L1 + L2)
- **L1 In-Process Cache (Caffeine / Guava)**: Sub-microsecond reads stored directly in application JVM heap memory (10,000 hot keys, 30-second TTL).
- **L2 Distributed Cluster (Redis 7.2)**: Shared multi-replica cluster accessed over TCP with Redis Sentinel or Cluster Mode enabled (10-minute TTL).

\`\`\`typescript
async function getCachedUser(userId: string): Promise<User> {
  // Check L1 In-Memory Cache
  const localHit = l1Cache.get(userId);
  if (localHit) return localHit;

  // Check L2 Redis Cache
  const redisHit = await redisClient.get(\`user:\${userId}\`);
  if (redisHit) {
    const user = JSON.parse(redisHit);
    l1Cache.set(userId, user);
    return user;
  }

  // Fallback to Primary Database
  const dbUser = await db.users.findUnique({ where: { id: userId } });
  await redisClient.setEx(\`user:\${userId}\`, 600, JSON.stringify(dbUser));
  l1Cache.set(userId, dbUser);
  return dbUser;
}
\`\`\`

## Mitigating the Cache Stampede (Thundering Herd)
When a high-traffic key expires, thousands of parallel requests simultaneously miss the cache and overwhelm the database. Solve this with **XFetch Probabilistic Early Expiration** or a distributed mutex lock using Redis \`SET NX EX\`.`,
  },
  {
    title: 'AWS EKS & GitOps Production Deployment Playbook for 2026',
    slug: 'aws-eks-gitops-production-playbook',
    excerpt: 'Step-by-step enterprise Kubernetes blueprint featuring ArgoCD declarative reconciliations, Karpenter autoscaling, and zero-trust IAM Roles for Service Accounts (IRSA).',
    category: 'Cloud & DevOps',
    tags: ['AWS', 'Kubernetes', 'EKS', 'ArgoCD', 'DevOps', 'Terraform'],
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop&auto=format',
    author: {
      name: 'Vikram Nair',
      role: 'Cloud Specialist · Staff Software Engineer Cloud',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&auto=format',
    },
    readTime: '9 min read',
    views: 1980,
    likes: 165,
    status: 'published',
    publishedAt: new Date('2026-09-05T08:30:00Z'),
    seo: {
      metaTitle: 'AWS EKS & GitOps Production Playbook (2026) | KR Tech',
      metaDescription: 'Complete guide to deploying enterprise Kubernetes on AWS EKS with ArgoCD GitOps, Karpenter automated node provisioning, and IRSA security.',
      canonicalUrl: 'https://krtech.edu/blogs/aws-eks-gitops-production-playbook',
      keywords: ['AWS EKS', 'ArgoCD', 'Kubernetes', 'GitOps', 'DevOps', 'Karpenter'],
    },
    content: `# AWS EKS & GitOps Production Deployment Playbook for 2026

## Declarative Infrastructure with Git as Single Source of Truth
Manual \`kubectl apply\` commands violate auditability and introduce configuration drift. With **GitOps**, any change to your Kubernetes cluster is represented as a Git commit and automatically synced by an in-cluster operator like **ArgoCD**.

## Fast Node Autoscaling with Karpenter
Legacy Cluster Autoscaler relies on AWS Auto Scaling Groups (ASGs), taking 4 to 8 minutes to provision worker nodes. **Karpenter** bypasses ASGs and directly launches customized EC2 instances in under 45 seconds based on specific pod resource requests.

\`\`\`yaml
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: general-compute
spec:
  template:
    spec:
      requirements:
        - key: "karpenter.k8s.aws/instance-category"
          operator: In
          values: ["c", "m", "r"]
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["spot", "on-demand"]
\`\`\`

## Security: Least-Privilege with IRSA
Never assign IAM permissions to entire EC2 node groups. Bind fine-grained AWS IAM roles to specific Kubernetes ServiceAccounts using OpenID Connect (OIDC) federation.`,
  },
  {
    title: 'How to Clear L6 Staff Software Engineer System Design Interviews at MAANG',
    slug: 'clear-l6-staff-system-design-interview-maang',
    excerpt: 'The comprehensive framework for breaking down ambiguous problems, driving trade-off discussions, estimating order-of-magnitude scale, and demonstrating technical leadership.',
    category: 'Career & Interviews',
    tags: ['System Design', 'Interview Prep', 'Career', 'Staff Engineer', 'MAANG'],
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=630&fit=crop&auto=format',
    author: {
      name: 'Rajesh Kumar',
      role: 'Senior Technical Architect · Principal Technical Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&auto=format',
    },
    readTime: '10 min read',
    views: 3820,
    likes: 389,
    status: 'published',
    publishedAt: new Date('2026-09-02T14:00:00Z'),
    seo: {
      metaTitle: 'Mastering Staff Engineer (L6) System Design Interviews | KR Tech',
      metaDescription: 'A proven step-by-step interview strategy for L6/L7 Staff Software Engineer system design rounds at Google, Meta, and Amazon.',
      canonicalUrl: 'https://krtech.edu/blogs/clear-l6-staff-system-design-interview-maang',
      keywords: ['System Design', 'Staff Engineer', 'Interview Prep', 'Google', 'Amazon', 'Meta'],
    },
    content: `# How to Clear L6 Staff Software Engineer System Design Interviews at MAANG

## What Distinguishes L6 from L4/L5?
In an L4/L5 interview, interviewers evaluate whether you know standard building blocks: load balancers, caching, SQL vs NoSQL, and message queues. 
In an **L6 Staff Engineer interview**, the prompt is deliberately vague:
> *"Design a real-time collaborative code execution platform for 10 million concurrent users."*

The interviewer is grading your ability to **drive requirements**, prioritize ambiguous trade-offs, identify non-functional failure modes, and think in terms of operational cost and failure domains.

## The 45-Minute Battle Plan
1. **Requirements & Boundary Scoping (7 mins)**: Clarify functional expectations, SLAs (99.99%), latency targets (<50ms P99), and scale parameters.
2. **High-Level Diagram & Core Entities (10 mins)**: Sketch ingress API gateway, authentication, data flow, and primary datastores.
3. **Deep Dive into Technical Bottlenecks (20 mins)**: Focus on the hardest 1 or 2 subsystems. For collaborative editing: Operational Transformation vs CRDTs, WebSocket connection termination, and distributed state coordination.
4. **Resilience & Fault Tolerance (8 mins)**: Multi-region failover, circuit breaking, data backup, and catastrophic disaster recovery.`,
  },
  {
    title: 'React 19 Server Actions vs Next.js 15 App Router: The Comprehensive Benchmark',
    slug: 'react-19-server-actions-vs-nextjs-15-benchmark',
    excerpt: 'Detailed technical analysis of Server Components, Form Actions, Optimistic UI updates, streaming SSR, and edge deployment architectures in React 19.',
    category: 'Frontend & Full Stack',
    tags: ['React 19', 'Next.js 15', 'Full Stack', 'Web Development', 'TypeScript'],
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop&auto=format',
    author: {
      name: 'Amit Verma',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&auto=format',
    },
    readTime: '7 min read',
    views: 2910,
    likes: 245,
    status: 'published',
    publishedAt: new Date('2026-08-30T11:00:00Z'),
    seo: {
      metaTitle: 'React 19 Server Actions vs Next.js 15 App Router | KR Tech',
      metaDescription: 'Hands-on benchmark comparing React 19 Server Actions with Next.js 15 App Router. Explore bundle sizes, TTFB latency, and form handling paradigms.',
      canonicalUrl: 'https://krtech.edu/blogs/react-19-server-actions-vs-nextjs-15-benchmark',
      keywords: ['React 19', 'Next.js 15', 'Server Actions', 'Full Stack', 'SSR'],
    },
    content: `# React 19 Server Actions vs Next.js 15 App Router: The Comprehensive Benchmark

## The Evolution of React Form Handlers
Prior to React 19, submitting a form required boilerplate: tracking \`useState(loading)\`, creating API route handlers, manual serialization, and error state mapping. 
With **React 19 Server Actions**, functions declared with \`'use server'\` can be executed directly as form actions:

\`\`\`tsx
// Server Action
async function updateProfile(formData: FormData) {
  'use server';
  const name = formData.get('name');
  await db.user.update({ where: { id: session.id }, data: { name } });
  revalidatePath('/dashboard');
}

// Client Component
export default function ProfileForm() {
  return (
    <form action={updateProfile}>
      <input name="name" defaultValue="Aditya Sharma" />
      <button type="submit">Update Profile</button>
    </form>
  );
}
\`\`\`

## Bundle Size Savings
Because Server Components run exclusively on the server, massive dependencies like Markdown parsers, date formatters, and encryption packages are never shipped to the client's browser bundle, resulting in **40% smaller JavaScript bundles**.`,
  },
  {
    title: 'Zero-Trust Security Architecture for Cloud-Native Microservices',
    slug: 'zero-trust-security-cloud-native-microservices',
    excerpt: 'Implementing mutual TLS (mTLS), SPIFFE/SPIRE cryptographic workload identities, and continuous token verification across hybrid Kubernetes clusters.',
    category: 'Cloud & DevOps',
    tags: ['Security', 'Zero Trust', 'mTLS', 'Cloud Native', 'Cyber Security'],
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop&auto=format',
    author: {
      name: 'Vikram Nair',
      role: 'Cloud Specialist · Staff Software Engineer Cloud',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&auto=format',
    },
    readTime: '8 min read',
    views: 1620,
    likes: 138,
    status: 'published',
    publishedAt: new Date('2026-08-25T16:00:00Z'),
    seo: {
      metaTitle: 'Zero-Trust Architecture for Cloud-Native Microservices | KR Tech',
      metaDescription: 'A practical implementation guide to Zero-Trust security in cloud-native microservices using mTLS, SPIFFE workload identities, and token verification.',
      canonicalUrl: 'https://krtech.edu/blogs/zero-trust-security-cloud-native-microservices',
      keywords: ['Zero Trust', 'Microservices Security', 'mTLS', 'SPIFFE', 'Cyber Security'],
    },
    content: `# Zero-Trust Security Architecture for Cloud-Native Microservices

## The Perimeter Security Illusion
Traditional enterprise security relied on a "castle-and-moat" model: traffic inside the corporate VPN or VPC was trusted implicitly. However, with sophisticated supply-chain attacks and insider lateral movement, **Never Trust, Always Verify** is now the required industry standard.

## 1. Workload Identity with SPIFFE/SPIRE
Instead of distributing static API keys or long-lived database credentials, workloads obtain cryptographically verifiable X.509 SVID certificates that rotate every hour.

## 2. Universal Mutual TLS (mTLS)
Encrypt all service-to-service communications at Layer 4/7 with strict cryptographic handshake validation managed transparently by service meshes like Istio or Linkerd.`,
  },
];

async function seedBlogs() {
  console.log('Connecting to MongoDB Atlas to seed Blog CMS articles...');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected to: ${mongoose.connection.name}`);

  for (const b of SEED_BLOGS) {
    await Blog.findOneAndUpdate(
      { slug: b.slug },
      b,
      { upsert: true, new: true }
    );
    console.log(`✓ Seeded Blog: ${b.title.slice(0, 50)}...`);
  }

  const count = await Blog.countDocuments();
  console.log(`\n✅ Total Blog Articles in MongoDB Atlas: ${count}`);
  await mongoose.disconnect();
}

seedBlogs().catch((err) => {
  console.error('Blog seeding error:', err);
  process.exit(1);
});
