const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Lesson = require('./models/Lesson');
const Module = require('./models/Module');
const CourseContent = require('./models/CourseContent');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');

const sampleModulesAndLessons = [
  {
    courseId: 'java-backend',
    courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices',
    modules: [
      {
        moduleNumber: 1,
        title: 'Module 1: High-Performance Architecture & Spring Boot 3 Core',
        description: 'Deep-dive into Inversion of Control, Dependency Injection, Bean Lifecycles, and Reactive Streams in Spring 6.',
        duration: '3 hours 45 mins',
        lessons: [
          {
            lessonNumber: 1,
            title: 'Welcome & Enterprise Architecture Blueprint',
            duration: '14:20',
            durationSeconds: 860,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Course orientation, production architectures, system scalability goals, and local development setup.',
            notes: '### Enterprise Blueprint Notes\n- Monolith to Microservices transition patterns.\n- Domain-Driven Design (DDD) fundamentals.\n- 12-Factor App methodology for cloud-native microservices.',
            resources: [
              { title: 'Spring Boot 3 Architecture Diagram (PDF)', url: 'https://krtech.edu/resources/spring-boot-architecture.pdf', type: 'pdf' },
              { title: 'Starter GitHub Repository', url: 'https://github.com/krtech-academy/spring-boot-enterprise-starter', type: 'code' },
            ],
            isFreePreview: true,
          },
          {
            lessonNumber: 2,
            title: 'Spring Bean Lifecycles, Proxies & Thread Pools',
            duration: '22:15',
            durationSeconds: 1335,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Understanding Dynamic Proxies, CGLIB, BeanPostProcessor, and fine-tuning Tomcat thread pools for high concurrency.',
            notes: '### Deep Dive: Spring Proxies\n- JDK Dynamic Proxies vs CGLIB bytecode enhancement.\n- BeanPostProcessor and BeanFactoryPostProcessor hooks.\n- Virtual Threads (Java 21 Project Loom) in Spring 3.2+.',
            resources: [
              { title: 'Thread Pool Tuning Guide', url: 'https://krtech.edu/resources/thread-pool-tuning.pdf', type: 'pdf' },
            ],
            isFreePreview: false,
          },
          {
            lessonNumber: 3,
            title: 'Reactive RESTful APIs with Spring WebFlux & Netty',
            duration: '28:40',
            durationSeconds: 1720,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Non-blocking I/O event loops, Mono & Flux publishers, backpressure handling, and Netty performance benchmarking.',
            notes: '### WebFlux Principles\n- Event loop concurrency model.\n- Managing backpressure with subscriber strategies.\n- When to use WebFlux vs Spring MVC.',
            resources: [
              { title: 'Reactive Streams Cheatsheet', url: 'https://krtech.edu/resources/webflux-cheatsheet.pdf', type: 'pdf' },
            ],
            isFreePreview: false,
          },
        ],
      },
      {
        moduleNumber: 2,
        title: 'Module 2: Distributed Event Streaming with Apache Kafka',
        description: 'Event-driven microservices architecture, partition keys, consumer groups, idempotency, and schema registry.',
        duration: '4 hours 10 mins',
        lessons: [
          {
            lessonNumber: 4,
            title: 'Kafka Architecture: Topics, Partitions & Offset Management',
            duration: '25:10',
            durationSeconds: 1510,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Understanding Kafka log storage, commit offsets, rebalancing protocols, and consumer lag monitoring.',
            notes: '### Kafka Fundamentals\n- Partitions ensure ordered events per key.\n- Producer acks: 0, 1, and all (-1).\n- Consumer rebalance listeners and cooperative sticky assignors.',
            resources: [
              { title: 'Kafka Clustering Architecture (PDF)', url: 'https://krtech.edu/resources/kafka-cluster-guide.pdf', type: 'pdf' },
            ],
            isFreePreview: false,
          },
          {
            lessonNumber: 5,
            title: 'Idempotent Consumers & Distributed Transaction Outbox Pattern',
            duration: '34:50',
            durationSeconds: 2090,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Implementing the Transactional Outbox pattern with Debezium and CDC to avoid dual-write inconsistencies.',
            notes: '### Transactional Outbox Pattern\n- Avoid dual-write database and message broker bugs.\n- CDC (Change Data Capture) via Debezium.\n- Exactly-once processing semantics in distributed systems.',
            resources: [
              { title: 'Outbox Pattern Implementation Source Code', url: 'https://github.com/krtech-academy/transactional-outbox-demo', type: 'code' },
            ],
            isFreePreview: false,
          },
        ],
      },
      {
        moduleNumber: 3,
        title: 'Module 3: Distributed Caching & Resilient Microservices',
        description: 'Redis cluster caching strategies, Cache Aside, Write-Through, Circuit Breakers with Resilience4j.',
        duration: '3 hours 30 mins',
        lessons: [
          {
            lessonNumber: 6,
            title: 'Redis Cluster In-Memory Caching & Cache Invalidation',
            duration: '21:05',
            durationSeconds: 1265,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Implementing Cache-Aside, TTL expiration, cache stampede prevention using distributed locks (Redisson).',
            notes: '### Redis Production Best Practices\n- Avoid Cache Stampede with probabilistic early expiration.\n- Distributed locks with Redisson LeaseTime.\n- Multi-tier L1 (Caffeine) + L2 (Redis) caching.',
            resources: [
              { title: 'Redis Cluster Caching Blueprint', url: 'https://krtech.edu/resources/redis-caching-guide.pdf', type: 'pdf' },
            ],
            isFreePreview: false,
          },
          {
            lessonNumber: 7,
            title: 'Circuit Breaker, Rate Limiting & Bulkheads with Resilience4j',
            duration: '27:18',
            durationSeconds: 1638,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Prevent cascading microservice failures using sliding window circuit breakers and fallback handlers.',
            notes: '### Resilience4j Mechanisms\n- Sliding window metrics (count-based vs time-based).\n- Half-open state trial probes.\n- Fallback decorators and degradation strategy.',
            resources: [
              { title: 'Resilience4j Configuration Samples', url: 'https://krtech.edu/resources/resilience4j-config.pdf', type: 'pdf' },
            ],
            isFreePreview: false,
          },
        ],
      },
    ],
  },
  {
    courseId: 'mern-stack',
    courseTitle: 'MERN Stack Full Stack Web Development Mastery Bootcamp',
    modules: [
      {
        moduleNumber: 1,
        title: 'Module 1: Advanced Node.js Concurrency & Express Optimization',
        description: 'Libuv event loop, worker threads, clustering, streaming large files, and secure token architectures.',
        duration: '3 hours 15 mins',
        lessons: [
          {
            lessonNumber: 1,
            title: 'Node.js Internals: Libuv, Event Loop Phases & UV_THREADPOOL',
            duration: '18:30',
            durationSeconds: 1110,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Deep dive into timers, pending callbacks, poll, check (setImmediate), and process.nextTick microtasks.',
            notes: '### Node.js Event Loop\n- Microtask queue priority over macrotasks.\n- Sizing UV_THREADPOOL_SIZE for crypto and fs operations.\n- Monitoring event loop delay with perf_hooks.',
            resources: [
              { title: 'Node Event Loop Architecture Diagram', url: 'https://krtech.edu/resources/node-eventloop.pdf', type: 'pdf' },
            ],
            isFreePreview: true,
          },
          {
            lessonNumber: 2,
            title: 'High-Throughput Streams, Buffers & Backpressure in Express',
            duration: '24:45',
            durationSeconds: 1485,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Stream massive gigabyte files, pipeline transforms, and throttle stream consumption with backpressure.',
            notes: '### Streaming Data Safely\n- pipeline() handles cleanup on stream aborts.\n- Transform streams for real-time gzip compression.\n- Avoiding high memory heap crashes during file uploads.',
            resources: [
              { title: 'Express Streaming Guide', url: 'https://krtech.edu/resources/express-streams.pdf', type: 'pdf' },
            ],
            isFreePreview: false,
          },
        ],
      },
      {
        moduleNumber: 2,
        title: 'Module 2: React 19 Architecture, Suspense & Server Components',
        description: 'Master React 19 useActionState, useOptimistic, concurrent rendering, and custom state synchronization.',
        duration: '4 hours',
        lessons: [
          {
            lessonNumber: 3,
            title: 'React 19 Actions, useTransition & Optimistic Updates',
            duration: '26:10',
            durationSeconds: 1570,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Eliminate loading spinners with optimistic state rollbacks and seamless concurrent transitions.',
            notes: '### React 19 Superpowers\n- Automatic form handling with Actions.\n- useOptimistic for zero-latency UI interactions.\n- useActionState for declarative asynchronous statuses.',
            resources: [
              { title: 'React 19 Cheat Sheet', url: 'https://krtech.edu/resources/react19-cheatsheet.pdf', type: 'pdf' },
            ],
            isFreePreview: false,
          },
        ],
      },
    ],
  },
  {
    courseId: 'aws-architect',
    courseTitle: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
    modules: [
      {
        moduleNumber: 1,
        title: 'Module 1: Resilient Multi-AZ VPC Architecture & Direct Connect',
        description: 'VPC subnets, route tables, internet gateways, NAT gateways, VPC Peering, and Transit Gateway routing.',
        duration: '3 hours 50 mins',
        lessons: [
          {
            lessonNumber: 1,
            title: 'Designing High-Availability Multi-Region VPC Topologies',
            duration: '20:15',
            durationSeconds: 1215,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Architecting secure CIDR blocks, private isolation subnets, and redundant NAT gateway topologies.',
            notes: '### Enterprise VPC Design\n- 3-tier VPC architecture: Public, Private Application, Isolated Database.\n- Network Access Control Lists (NACL) vs Security Groups.\n- VPC Flow Logs analysis using Athena.',
            resources: [
              { title: 'AWS Well-Architected Framework Guide', url: 'https://krtech.edu/resources/aws-vpc-topology.pdf', type: 'pdf' },
            ],
            isFreePreview: true,
          },
        ],
      },
    ],
  },
];

async function seedLMS() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas Connected successfully.');

    for (const courseData of sampleModulesAndLessons) {
      console.log(`\nSeeding course: ${courseData.courseId} (${courseData.courseTitle})`);

      // 1. Remove existing modules and lessons for idempotency
      await Module.deleteMany({ courseId: courseData.courseId });
      await Lesson.deleteMany({ courseId: courseData.courseId });
      await CourseContent.deleteMany({ courseId: courseData.courseId });

      let totalLessonsCount = 0;
      const moduleSummaries = [];

      for (const mod of courseData.modules) {
        const createdModule = await Module.create({
          courseId: courseData.courseId,
          moduleNumber: mod.moduleNumber,
          title: mod.title,
          description: mod.description,
          duration: mod.duration,
          order: mod.moduleNumber,
        });

        console.log(`  Created Module ${mod.moduleNumber}: ${mod.title}`);

        for (const les of mod.lessons) {
          totalLessonsCount++;
          await Lesson.create({
            courseId: courseData.courseId,
            moduleId: createdModule._id.toString(),
            moduleTitle: mod.title,
            lessonNumber: les.lessonNumber,
            title: les.title,
            duration: les.duration,
            durationSeconds: les.durationSeconds,
            videoUrl: les.videoUrl,
            description: les.description,
            notes: les.notes,
            resources: les.resources || [],
            isFreePreview: !!les.isFreePreview,
            order: les.lessonNumber,
          });
          console.log(`    Created Lesson ${les.lessonNumber}: ${les.title}`);
        }

        moduleSummaries.push({
          moduleNumber: mod.moduleNumber,
          title: mod.title,
          lessonsCount: mod.lessons.length,
          duration: mod.duration,
        });
      }

      // Create CourseContent document
      await CourseContent.create({
        courseId: courseData.courseId,
        title: courseData.courseTitle,
        overview: `Comprehensive enterprise curriculum for ${courseData.courseTitle}. Includes high-definition video walkthroughs, system diagrams, downloadable architecture blueprints, and real-time capstone assignments.`,
        totalLessons: totalLessonsCount,
        totalDuration: '45 hours',
        modules: moduleSummaries,
      });
      console.log(`  Created CourseContent summary (${totalLessonsCount} lessons).`);
    }

    const lessonCount = await Lesson.countDocuments();
    const moduleCount = await Module.countDocuments();
    const courseContentCount = await CourseContent.countDocuments();
    const assignmentCount = await Assignment.countDocuments();

    console.log('\n================ LMS SEED COMPLETED ================');
    console.log(`Total Lessons in Atlas: ${lessonCount}`);
    console.log(`Total Modules in Atlas: ${moduleCount}`);
    console.log(`Total CourseContents in Atlas: ${courseContentCount}`);
    console.log(`Total Assignments in Atlas: ${assignmentCount}`);

    process.exit(0);
  } catch (err) {
    console.error('LMS Seeding Failed:', err);
    process.exit(1);
  }
}

seedLMS();
