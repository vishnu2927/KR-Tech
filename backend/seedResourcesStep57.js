const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const Resource = require('./models/Resource');

const RESOURCES = [
  {
    id: 'spring-boot-3-microservices-handbook',
    title: 'Enterprise Spring Boot 3 & Distributed Microservices Architecture Handbook',
    category: 'PDF Notes',
    description: 'A comprehensive architectural blueprint covering Kafka event-driven choreography, distributed tracing with OpenTelemetry, and Redis multi-level caching.',
    format: 'PDF',
    fileSize: '4.8 MB',
    downloadCount: 14200,
    downloadsCount: '14.2k',
    tags: ['Spring Boot 3', 'Kafka', 'Microservices', 'Redis', 'Docker'],
    author: 'Rajesh Kumar (Principal Technical Architect Staff)',
    content: `# Enterprise Spring Boot 3 & Distributed Microservices

## Executive Summary
This handbook provides real-world patterns for building fault-tolerant microservices running on Java 21 and Spring Boot 3.2.

## Key Architectural Highlights
- Event-Driven Sagas using Apache Kafka
- Distributed Tracing via OpenTelemetry & Micrometer
- Resilience4j Circuit Breakers & Rate Limiters
- Second-Level Caching with Redis & PostgreSQL replication`,
  },
  {
    id: 'system-design-interview-cheatsheet',
    title: 'Top 50 High-Scale System Design Interview Patterns & Blueprints',
    category: 'Cheat Sheets',
    description: 'Essential calculations, CAP theorem tradeoffs, database sharding strategies, and load balancer algorithm cheat sheet for L5/L6 interviews.',
    format: 'PDF',
    fileSize: '3.2 MB',
    downloadCount: 22800,
    downloadsCount: '22.8k',
    tags: ['System Design', 'Scalability', 'Interview Prep', 'CAP Theorem', 'Sharding'],
    author: 'Vishnu Vardhan (KR Tech Lead)',
    content: `# Top 50 High-Scale System Design Interview Patterns

## 1. Capacity Estimations (Back of the Envelope)
- 1 Million Daily Active Users (DAU) * 10 requests = 10M requests/day ≈ 115 requests/sec
- Peak load factor: 3x - 5x = 350 - 575 QPS

## 2. Caching Strategies
- Cache-Aside (Lazy Loading)
- Write-Through & Write-Behind
- Eviction Policies: LRU, LFU, FIFO

## 3. Database Scaling
- Horizontal Partitioning (Sharding by Tenant ID or User Hash)
- Read Replicas with asynchronous CDC`,
  },
  {
    id: 'faang-java-backend-interview-questions',
    title: 'MAANG Java 21 Backend Engineering Interview Question Bank (2026 Edition)',
    category: 'Interview Questions',
    description: '100+ vetted technical questions asked at Amazon, Google, and Meta for Senior Backend Engineer roles with detailed solution explanations.',
    format: 'PDF',
    fileSize: '5.1 MB',
    downloadCount: 18400,
    downloadsCount: '18.4k',
    tags: ['Java 21', 'Concurrency', 'JVM Tuning', 'Garbage Collection', 'Spring'],
    author: 'Rajesh Kumar (Principal Technical Architect Staff)',
    content: `# MAANG Java 21 Backend Engineering Questions

## Concurrency & Virtual Threads
Q1: How do Java 21 Virtual Threads (Project Loom) differ from platform threads?
Virtual threads are managed by the JVM rather than the underlying OS, allowing applications to sustain millions of concurrent execution paths without exhausting kernel stack memory.

Q2: What is the impact of synchronized blocks on Virtual Thread pinning?
Using 'synchronized' can pin the virtual thread to the carrier thread; modern Spring Boot 3 uses ReentrantLock to prevent pinning.`,
  },
  {
    id: 'faang-software-engineer-resume-template',
    title: 'ATS-Optimized FAANG Software Engineer LaTeX & Word Resume Template',
    category: 'Resume Templates',
    description: 'Clean, parseable resume layout proven to achieve 92%+ interview shortlist rates at top-tier product companies with impact metrics framework.',
    format: 'DOCX / PDF',
    fileSize: '1.4 MB',
    downloadCount: 31200,
    downloadsCount: '31.2k',
    tags: ['Resume', 'Career', 'FAANG', 'ATS Friendly', 'Templates'],
    author: 'KR Tech Career Strategy Council',
    content: `# ATS-Optimized FAANG Software Engineer Resume Template

## Impact Formula (Google XYZ Method)
"Accomplished [X] as measured by [Y] by doing [Z]"

### Example Bullet Points:
- Architected distributed payment orchestration engine handling 12,000 TPS, reducing latency by 45% through Redis caching and Netty non-blocking IO.
- Migrated monolith to 8 containerized microservices on AWS EKS, reducing deployment downtime from 2 hours to 0 seconds.`,
  },
  {
    id: 'full-stack-cloud-architect-roadmap-2026',
    title: 'The Complete 2026 Full Stack & Cloud Architect learning roadmap',
    category: 'Roadmaps',
    description: 'Step-by-step visual learning progression from foundational Data Structures to Kubernetes, Kafka, Terraform, and Multi-Cloud Architecture.',
    format: 'PDF',
    fileSize: '6.5 MB',
    downloadCount: 26500,
    downloadsCount: '26.5k',
    tags: ['Roadmap', 'Cloud Architect', 'DevOps', 'Full Stack', 'Career'],
    author: 'Vikram Nair (Staff Software Engineer Cloud)',
    content: `# 2026 Full Stack & Cloud Architect learning roadmap

## Stage 1: Core Fundamentals & Concurrency
- Master Java 21 or TypeScript / Go
- Clean Architecture, SOLID Principles, Hexagonal Design

## Stage 2: Microservices & Event Streaming
- Spring Boot 3 & NestJS
- Apache Kafka Event Choreography & Schema Registry

## Stage 3: Cloud Infrastructure & DevOps
- AWS Solutions Architecture (SAA-C03)
- Docker, Kubernetes (EKS), Terraform IaC, ArgoCD CI/CD`,
  },
  {
    id: 'aws-cloud-security-compliance-guide',
    title: 'AWS Production Cloud Security & IAM Least-Privilege Architecture Guide',
    category: 'PDF Notes',
    description: 'Hardening multi-account AWS environments with AWS Organizations, Service Control Policies (SCPs), GuardDuty, and KMS envelope encryption.',
    format: 'PDF',
    fileSize: '4.2 MB',
    downloadCount: 11900,
    downloadsCount: '11.9k',
    tags: ['AWS', 'Cloud Security', 'IAM', 'KMS', 'Compliance'],
    author: 'Vikram Nair (Staff Software Engineer Cloud)',
    content: `# AWS Production Cloud Security & IAM Architecture Guide

## 1. Multi-Account Structure
- Master Payer Account
- Security Tooling & Audit Account
- Log Archive Account (write-once S3 with Object Lock)
- Isolated Dev / Staging / Production Workloads

## 2. Data Protection at Rest
- Customer Managed KMS Keys with automatic annual key rotation
- Envelope Encryption for high throughput payload secrecy`,
  },
];

async function seedResources() {
  console.log('Connecting to MongoDB Atlas to synchronize resource download center...');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected to: ${mongoose.connection.name}`);

  for (const item of RESOURCES) {
    await Resource.findOneAndUpdate(
      { id: item.id },
      {
        ...item,
        downloadUrl: `/api/resources/${item.id}/download`,
        pdfUrl: `/api/resources/${item.id}/download`,
      },
      { upsert: true, new: true }
    );
    console.log(`✓ Synchronized Resource: ${item.title.slice(0, 50)}...`);
  }

  const count = await Resource.countDocuments();
  console.log(`\n✅ Total Resources in MongoDB Atlas: ${count}`);
  await mongoose.disconnect();
}

seedResources().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
