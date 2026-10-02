const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const Enrollment = require('./models/Enrollment');
const Progress = require('./models/Progress');
const Lecture = require('./models/Lecture');
const Assignment = require('./models/Assignment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://krtech_admin:krtech2027@ac-mfgmvie-shard-00-02.lb8pw7v.mongodb.net:27017/krtech?ssl=true&authSource=admin';

const SEED_ENROLLMENTS = [
  {
    userEmail: 'aditya.sharma@krtech.edu',
    userName: 'Aditya Sharma',
    courseId: 'java-backend',
    courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices',
    category: 'Java Backend',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format',
    mentor: 'Rajesh Kumar',
    mentorCompany: 'Principal Technical Architect · Staff Architect',
    batch: 'Batch-2026 (Live 1:1 Weekend)',
    status: 'active',
  },
  {
    userEmail: 'aditya.sharma@krtech.edu',
    userName: 'Aditya Sharma',
    courseId: 'mern-stack',
    courseTitle: 'MERN Stack Full Stack Web Development Mastery Bootcamp',
    category: 'MERN Stack',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop&auto=format',
    mentor: 'Amit Verma',
    mentorCompany: 'Principal Systems Architect',
    batch: 'Batch-2026 (Live 1:1 Evening)',
    status: 'active',
  },
  {
    userEmail: 'aditya.sharma@krtech.edu',
    userName: 'Aditya Sharma',
    courseId: 'aws-architect',
    courseTitle: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
    category: 'AWS Cloud',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format',
    mentor: 'Vikram Nair',
    mentorCompany: 'Staff Software Engineer Cloud · Cloud Specialist',
    batch: 'Batch-2026 (Fast-Track)',
    status: 'completed',
  },
];

const SEED_PROGRESS = [
  {
    userEmail: 'aditya.sharma@krtech.edu',
    courseId: 'java-backend',
    completedLectures: ['lec-java-01', 'lec-java-02', 'lec-java-03'],
    completedAssignments: ['asg-java-01'],
    progressPercent: 75,
    currentLectureId: 'lec-java-04',
    totalTimeSpentMinutes: 360,
  },
  {
    userEmail: 'aditya.sharma@krtech.edu',
    courseId: 'mern-stack',
    completedLectures: ['lec-mern-01', 'lec-mern-02'],
    completedAssignments: [],
    progressPercent: 50,
    currentLectureId: 'lec-mern-03',
    totalTimeSpentMinutes: 240,
  },
  {
    userEmail: 'aditya.sharma@krtech.edu',
    courseId: 'aws-architect',
    completedLectures: ['lec-aws-01', 'lec-aws-02', 'lec-aws-03', 'lec-aws-04'],
    completedAssignments: ['asg-aws-01'],
    progressPercent: 100,
    currentLectureId: 'lec-aws-04',
    totalTimeSpentMinutes: 480,
  },
];

const SEED_LECTURES = [
  {
    _id: new mongoose.Types.ObjectId('65fa00000000000000000001'),
    courseId: 'java-backend',
    moduleNumber: 1,
    moduleTitle: 'Module 1: Enterprise Spring Boot 3 & Core Architecture',
    lectureNumber: 1,
    title: 'Spring Framework Internals & Dependency Injection in Depth',
    description: 'Deep dive into ApplicationContext, Bean Lifecycle, Circular Dependency resolution, and JVM memory tuning for microservices.',
    duration: '52 mins',
    durationMinutes: 52,
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/Spring_Internals_Architecture.pdf',
    notesFileName: 'Spring_Boot_3_Internals_Architecture_Notes.pdf',
    recordedDate: 'Sep 12, 2026',
    instructor: 'Rajesh Kumar (Principal Technical Architect)',
    tags: ['Java 21', 'Spring Boot 3', 'JVM'],
  },
  {
    _id: new mongoose.Types.ObjectId('65fa00000000000000000002'),
    courseId: 'java-backend',
    moduleNumber: 1,
    moduleTitle: 'Module 1: Enterprise Spring Boot 3 & Core Architecture',
    lectureNumber: 2,
    title: 'High-Performance JPA, Hibernate Caching & N+1 Problem',
    description: 'Mastering Second-Level Cache with Redis, Entity Graph querying, batch fetching, and pessimistic/optimistic locking strategies.',
    duration: '58 mins',
    durationMinutes: 58,
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/JPA_Hibernate_Performance_Notes.pdf',
    notesFileName: 'JPA_Hibernate_Performance_CheatSheet.pdf',
    recordedDate: 'Sep 14, 2026',
    instructor: 'Rajesh Kumar (Principal Technical Architect)',
    tags: ['JPA', 'Hibernate', 'Redis Caching'],
  },
  {
    _id: new mongoose.Types.ObjectId('65fa00000000000000000003'),
    courseId: 'java-backend',
    moduleNumber: 2,
    moduleTitle: 'Module 2: Event-Driven Microservices with Apache Kafka',
    lectureNumber: 3,
    title: 'Kafka Architecture: Partitions, Offsets & Consumer Groups',
    description: 'Cluster topology, ISR replication, transactional outbox pattern, exactly-once processing semantics, and Kafka Streams.',
    duration: '64 mins',
    durationMinutes: 64,
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/Apache_Kafka_Production_Architecture.pdf',
    notesFileName: 'Apache_Kafka_Microservices_Blueprint.pdf',
    recordedDate: 'Sep 16, 2026',
    instructor: 'Rajesh Kumar (Principal Technical Architect)',
    tags: ['Apache Kafka', 'Event Driven', 'Microservices'],
  },
  {
    _id: new mongoose.Types.ObjectId('65fa00000000000000000004'),
    courseId: 'java-backend',
    moduleNumber: 2,
    moduleTitle: 'Module 2: Event-Driven Microservices with Apache Kafka',
    lectureNumber: 4,
    title: 'Distributed Tracing with OpenTelemetry, Prometheus & Grafana',
    description: 'Setting up observability pipeline across multi-service deployments with distributed correlation IDs and SLA alerting.',
    duration: '48 mins',
    durationMinutes: 48,
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=340&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/Distributed_Tracing_Observability.pdf',
    notesFileName: 'Observability_Prometheus_Grafana_Guide.pdf',
    recordedDate: 'Sep 17, 2026',
    instructor: 'Rajesh Kumar (Principal Technical Architect)',
    tags: ['Observability', 'OpenTelemetry', 'Prometheus'],
  },
  {
    _id: new mongoose.Types.ObjectId('65fa00000000000000000005'),
    courseId: 'mern-stack',
    moduleNumber: 1,
    moduleTitle: 'Module 1: Modern Full Stack SaaS Architecture',
    lectureNumber: 1,
    title: 'React 19 Server Actions, Streaming & React Compiler Deep Dive',
    description: 'Comprehensive walkthrough of React 19 concurrent features, optimistic mutations, server functions, and bundle optimization.',
    duration: '50 mins',
    durationMinutes: 50,
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/React_19_FullStack_Architecture.pdf',
    notesFileName: 'React_19_Server_Actions_CheatSheet.pdf',
    recordedDate: 'Sep 15, 2026',
    instructor: 'Amit Verma (Principal Systems Architect)',
    tags: ['React 19', 'Next.js 15', 'Full Stack'],
  },
  {
    _id: new mongoose.Types.ObjectId('65fa00000000000000000006'),
    courseId: 'aws-architect',
    moduleNumber: 1,
    moduleTitle: 'Module 1: AWS VPC & Networking Fundamentals',
    lectureNumber: 1,
    title: 'High Availability Multi-AZ VPC Design with NAT & IGW',
    description: 'Subnet CIDR partitioning, route tables, network access control lists (NACLs), security groups, and bastion host hardening.',
    duration: '45 mins',
    durationMinutes: 45,
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/AWS_VPC_Networking_Blueprint.pdf',
    notesFileName: 'AWS_VPC_Architecture_Guide.pdf',
    recordedDate: 'Sep 10, 2026',
    instructor: 'Vikram Nair (Staff Software Engineer Cloud)',
    tags: ['AWS', 'VPC', 'Cloud Networking'],
  },
];

const SEED_ASSIGNMENTS = [
  {
    _id: new mongoose.Types.ObjectId('65fa10000000000000000001'),
    courseId: 'java-backend',
    title: 'Capstone 1: Scalable Order Processing Microservice with Kafka',
    description: 'Implement a complete Saga orchestrator order processing system with idempotency, circuit breakers (Resilience4j), and MongoDB event sourcing.',
    moduleTitle: 'Module 2: Event-Driven Microservices',
    deadline: 'This Sunday, 11:59 PM IST',
    maxScore: 100,
    requirements: [
      'Implement Order and Payment services communicating via Kafka topics',
      'Handle Outbox pattern to avoid dual-write distributed transaction issues',
      'Provide Unit & Integration tests using Testcontainers',
      'Include Docker Compose file for 1-click execution',
    ],
    starterRepoUrl: 'https://github.com/krtech-academy/order-saga-starter',
    submissions: [
      {
        userEmail: 'aditya.sharma@krtech.edu',
        studentName: 'Aditya Sharma',
        githubUrl: 'https://github.com/adityasharma/kafka-order-saga-service',
        liveDemoUrl: 'https://order-saga.aditya.dev',
        notes: 'Implemented Testcontainers integration test suite with 92% branch coverage.',
        status: 'reviewed',
        grade: 'Distinction (98%)',
        score: 98,
        feedback: 'Outstanding implementation of Saga compensation logic and clean hexagonal architecture.',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    _id: new mongoose.Types.ObjectId('65fa10000000000000000002'),
    courseId: 'java-backend',
    title: 'Capstone 2: Distributed Caching Layer with Redis Cluster',
    description: 'Design a multi-tiered cache-aside and write-through cache for an enterprise catalog API handling 50,000 requests per second.',
    moduleTitle: 'Module 3: High Scale Performance',
    deadline: 'Next Sunday, 11:59 PM IST',
    maxScore: 100,
    requirements: [
      'Implement Redis caching with TTL expiry and cache stampede protection',
      'Write benchmark suite using Apache JMeter or k6',
      'Provide architectural latency graphs in README.md',
    ],
    starterRepoUrl: 'https://github.com/krtech-academy/redis-cache-capstone',
    submissions: [],
  },
  {
    _id: new mongoose.Types.ObjectId('65fa10000000000000000003'),
    courseId: 'mern-stack',
    title: 'Capstone 1: Real-Time Collaborative Canvas with WebSockets',
    description: 'Build a production multi-user collaborative whiteboard with optimistic rendering, CRDT conflict resolution, and Redis pub/sub.',
    moduleTitle: 'Module 2: Real-time Distributed Systems',
    deadline: 'In 5 Days',
    maxScore: 100,
    requirements: [
      'Zero-lag cursor synchronization using Socket.IO / WebSockets',
      'Persist session boards into MongoDB Atlas',
      'Support JWT authentication and room invite codes',
    ],
    starterRepoUrl: 'https://github.com/krtech-academy/collaborative-canvas-starter',
    submissions: [],
  },
];

async function seedStudentData() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to:', mongoose.connection.name);

  // 1. Seed Enrollments
  console.log('\n--- 1. Seeding Enrollments ---');
  for (const enr of SEED_ENROLLMENTS) {
    await Enrollment.findOneAndUpdate(
      { userEmail: enr.userEmail, courseId: enr.courseId },
      enr,
      { upsert: true, new: true }
    );
  }
  const totalEnr = await Enrollment.countDocuments();
  console.log(`✓ Total Enrollments in MongoDB Atlas: ${totalEnr}`);

  // 2. Seed Progress
  console.log('\n--- 2. Seeding Progress ---');
  for (const prg of SEED_PROGRESS) {
    await Progress.findOneAndUpdate(
      { userEmail: prg.userEmail, courseId: prg.courseId },
      prg,
      { upsert: true, new: true }
    );
  }
  const totalPrg = await Progress.countDocuments();
  console.log(`✓ Total Progress records in MongoDB Atlas: ${totalPrg}`);

  // 3. Seed Lectures
  console.log('\n--- 3. Seeding Recorded Lectures ---');
  for (const lec of SEED_LECTURES) {
    await Lecture.findOneAndUpdate({ _id: lec._id }, lec, { upsert: true, new: true });
  }
  const totalLec = await Lecture.countDocuments();
  console.log(`✓ Total Recorded Lectures in MongoDB Atlas: ${totalLec}`);

  // 4. Seed Assignments
  console.log('\n--- 4. Seeding Capstone Assignments ---');
  for (const asg of SEED_ASSIGNMENTS) {
    await Assignment.findOneAndUpdate({ _id: asg._id }, asg, { upsert: true, new: true });
  }
  const totalAsg = await Assignment.countDocuments();
  console.log(`✓ Total Assignments in MongoDB Atlas: ${totalAsg}`);

  await mongoose.disconnect();
  console.log('\n✅ ALL 4 STUDENT COLLECTIONS SUCCESSFULLY SEEDED IN MONGODB ATLAS!');
}

seedStudentData().catch(console.error);
