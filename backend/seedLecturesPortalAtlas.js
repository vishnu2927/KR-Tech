const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Lecture = require('./models/Lecture');
const WatchHistory = require('./models/WatchHistory');

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://krtech_admin:krtech2027@ac-mfgmvie-shard-00-02.lb8pw7v.mongodb.net:27017/krtech?ssl=true&authSource=admin';

const RICH_LECTURES = [
  {
    courseId: 'java-backend',
    moduleNumber: 1,
    moduleTitle: 'Module 1: Enterprise Microservices & Event Streams',
    lectureNumber: 1,
    title: 'Event-Driven Microservices with Apache Kafka, Schema Registry & Debezium',
    description:
      'Master high-throughput event streaming, partition distribution, consumer offset management, schema evolution with Avro, and CDC data synchronization with Debezium.',
    duration: '48 mins',
    durationMinutes: 48,
    videoUrl: 'https://www.youtube-nocookie.com/embed/R873BlNVUB4', // Kafka architecture tutorial
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=450&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/Kafka_Production_Architecture_Blueprint.pdf',
    notesFileName: 'Kafka_Production_Architecture_Blueprint.pdf',
    recordedDate: 'Sep 16, 2026',
    instructor: 'Rajesh Kumar (Principal Technical Architect · Staff Architect)',
    tags: ['Kafka', 'Event-Driven', 'Spring Boot 3', 'Microservices', 'Debezium'],
    chapters: [
      {
        id: 'chap-01',
        title: 'System Architecture & Problem Statement',
        timestamp: '00:00',
        seconds: 0,
        summary: 'Monolith decoupling challenges, asynchronous event choreography vs orchestration.',
      },
      {
        id: 'chap-02',
        title: 'Kafka Broker & Partition Rebalancing Strategies',
        timestamp: '07:45',
        seconds: 465,
        summary: 'Message keys, hash partitioning, cooperative sticky assignors, and partition sizing rules of thumb.',
      },
      {
        id: 'chap-03',
        title: 'Idempotent Consumers & Dead Letter Queues (DLQ)',
        timestamp: '18:20',
        seconds: 1100,
        summary: 'Handling toxic payloads, retry backoffs, consumer idempotency keys with Redis.',
      },
      {
        id: 'chap-04',
        title: 'End-to-End Tracing with OpenTelemetry & Zipkin',
        timestamp: '31:10',
        seconds: 1870,
        summary: 'Injecting traceparent headers across Kafka record headers and propagating baggage across microservices.',
      },
      {
        id: 'chap-05',
        title: 'Production Benchmarking & Live Q&A',
        timestamp: '41:30',
        seconds: 2490,
        summary: '100,000 msg/sec load test using k6 and JConsole memory telemetry.',
      },
    ],
    notes: `### 🚀 Lecture Architecture Highlights: Event-Driven Microservices

#### 1. Core Principles
- **Asynchronous Decoupling**: Upstream order services dispatch \`OrderPlacedEvent\` without synchronous HTTP blocking.
- **Log Compaction**: Ensures topic maintains latest state snapshot per key for instant state reconstitution.
- **Consumer Group Rebalancing**: We utilized the \`CooperativeStickyAssignor\` to eliminate stop-the-world rebalance pauses.

#### 2. Resilience Best Practice
\`\`\`java
@RetryableTopic(
    attempts = "4",
    backoff = @Backoff(delay = 1000, multiplier = 2.0),
    autoCreateTopics = "true",
    topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE
)
@KafkaListener(topics = "orders-inbound", groupId = "fulfillment-group")
public void handleOrderEvent(OrderEvent event) {
    // idempotent processing with Redis deduplication
    inventoryService.reserve(event);
}
\`\`\`

#### 3. Key Takeaway Checklist
- [x] Configure \`acks=all\` and \`min.insync.replicas=2\` for financial grade durability.
- [x] Always pass OpenTelemetry W3C trace contexts through Kafka record headers.
- [x] Route unprocessable poison pills to Dead Letter Topics (\`.DLT\`) for operational inspection.`,
    attachments: [
      {
        id: 'att-kafka-pdf',
        name: 'Kafka_Production_Architecture_Blueprint.pdf',
        fileUrl: 'https://krtech.edu/downloads/Kafka_Production_Architecture_Blueprint.pdf',
        fileType: 'PDF',
        fileSize: '3.4 MB',
        downloadCount: 384,
      },
      {
        id: 'att-kafka-zip',
        name: 'kafka-microservices-starter.zip',
        fileUrl: 'https://krtech.edu/downloads/kafka-microservices-starter.zip',
        fileType: 'ZIP',
        fileSize: '14.8 MB',
        downloadCount: 295,
      },
      {
        id: 'att-kafka-yaml',
        name: 'docker-compose-kafka-cluster.yaml',
        fileUrl: 'https://krtech.edu/downloads/docker-compose-kafka-cluster.yaml',
        fileType: 'YAML',
        fileSize: '45 KB',
        downloadCount: 512,
      },
      {
        id: 'att-kafka-json',
        name: 'kafka-postman-collection.json',
        fileUrl: 'https://krtech.edu/downloads/kafka-postman-collection.json',
        fileType: 'JSON',
        fileSize: '180 KB',
        downloadCount: 219,
      },
    ],
    resources: [
      {
        title: 'Kafka Microservices GitHub Starter Repository',
        url: 'https://github.com/krtech-edu/kafka-spring-cloud-starter',
        type: 'github',
      },
      {
        title: 'Apache Kafka Enterprise Design Patterns Documentation',
        url: 'https://kafka.apache.org/documentation/',
        type: 'docs',
      },
    ],
  },
  {
    courseId: 'java-backend',
    moduleNumber: 1,
    moduleTitle: 'Module 1: Enterprise Microservices & Event Streams',
    lectureNumber: 2,
    title: 'Distributed Microservices Resiliency with Resilience4j & Envoy Mesh',
    description:
      'Build bulletproof backend services using Circuit Breakers, Bulkheads, TimeLimiters, and Rate Limiters with automated fallback handlers.',
    duration: '45 mins',
    durationMinutes: 45,
    videoUrl: 'https://www.youtube-nocookie.com/embed/5r3gu_E55-8', // Microservices resilience
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/Resilience4j_Circuit_Breaker_Guide.pdf',
    notesFileName: 'Resilience4j_Circuit_Breaker_Guide.pdf',
    recordedDate: 'Sep 14, 2026',
    instructor: 'Rajesh Kumar (Principal Technical Architect · Staff Architect)',
    tags: ['Resilience4j', 'Circuit Breaker', 'Fault Tolerance', 'Spring Boot 3'],
    chapters: [
      {
        id: 'chap-r-01',
        title: 'Cascading Failures in Distributed Networks',
        timestamp: '00:00',
        seconds: 0,
        summary: 'Thread pool exhaustion, latency amplification, and upstream timeouts.',
      },
      {
        id: 'chap-r-02',
        title: 'Circuit Breaker State Machine',
        timestamp: '09:15',
        seconds: 555,
        summary: 'CLOSED, OPEN, and HALF-OPEN states, failure rate thresholds, ring buffer evaluation.',
      },
      {
        id: 'chap-r-03',
        title: 'Bulkhead & Thread Pool Isolation',
        timestamp: '22:00',
        seconds: 1320,
        summary: 'Restricting concurrent execution so third-party payment gateways do not consume server threads.',
      },
      {
        id: 'chap-r-04',
        title: 'Live Chaos Engineering Demo',
        timestamp: '34:40',
        seconds: 2080,
        summary: 'Injecting 5000ms latency into payment dependency and observing instant circuit trip with zero 500s.',
      },
    ],
    notes: `### 🛡️ Resilience4j Implementation Notes

#### Sliding Window Configuration
- \`slidingWindowType: COUNT_BASED\` (e.g. last 100 requests)
- \`failureRateThreshold: 50.0\` (Trips to OPEN if 50% fail)
- \`waitDurationInOpenState: 10000ms\` (Stays open for 10 seconds before probing)
- \`permittedNumberOfCallsInHalfOpenState: 10\` (Evaluates recovery health)

\`\`\`yaml
resilience4j.circuitbreaker:
  instances:
    paymentService:
      slidingWindowSize: 20
      failureRateThreshold: 50
      waitDurationInOpenState: 15s
      slowCallRateThreshold: 75
      slowCallDurationThreshold: 2s
\`\`\``,
    attachments: [
      {
        id: 'att-res-pdf',
        name: 'Resilience4j_Circuit_Breaker_Guide.pdf',
        fileUrl: 'https://krtech.edu/downloads/Resilience4j_Circuit_Breaker_Guide.pdf',
        fileType: 'PDF',
        fileSize: '2.8 MB',
        downloadCount: 412,
      },
      {
        id: 'att-res-zip',
        name: 'resilience4j-chaos-demo.zip',
        fileUrl: 'https://krtech.edu/downloads/resilience4j-chaos-demo.zip',
        fileType: 'ZIP',
        fileSize: '8.2 MB',
        downloadCount: 308,
      },
    ],
    resources: [
      {
        title: 'Resilience4j Official Documentation & Metrics',
        url: 'https://resilience4j.readme.io/',
        type: 'docs',
      },
    ],
  },
  {
    courseId: 'aws-architect',
    moduleNumber: 1,
    moduleTitle: 'Module 1: Production Cloud Architecture & Security',
    lectureNumber: 1,
    title: 'AWS VPC Peering, Transit Gateway, Security Groups & High Availability Design',
    description:
      'Architect resilient enterprise VPC environments across multiple availability zones, setup private subnets, NAT Gateways, and route tables.',
    duration: '52 mins',
    durationMinutes: 52,
    videoUrl: 'https://www.youtube-nocookie.com/embed/Ia-UEYYR44s', // AWS VPC Architecture
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/AWS_VPC_Enterprise_Architecture.pdf',
    notesFileName: 'AWS_VPC_Enterprise_Architecture.pdf',
    recordedDate: 'Sep 11, 2026',
    instructor: 'Vikram Nair (Staff Software Engineer Cloud · Cloud Specialist)',
    tags: ['AWS', 'VPC', 'Terraform', 'Cloud Architecture', 'Networking'],
    chapters: [
      {
        id: 'chap-vpc-01',
        title: 'CIDR Block Allocation & Multi-AZ Topology',
        timestamp: '00:00',
        seconds: 0,
        summary: '/16 VPC allocation, /24 public, private, and database subnet slicing.',
      },
      {
        id: 'chap-vpc-02',
        title: 'NAT Gateway Deployment & High Availability',
        timestamp: '12:30',
        seconds: 750,
        summary: 'Single NAT vs Multi-AZ NAT tradeoffs, egress filtering, and cost optimization.',
      },
      {
        id: 'chap-vpc-03',
        title: 'VPC Peering vs AWS Transit Gateway Hub',
        timestamp: '25:10',
        seconds: 1510,
        summary: 'Inter-VPC mesh limits, Transit Gateway route tables, and cross-account attachment.',
      },
      {
        id: 'chap-vpc-04',
        title: 'Terraform Infrastructure-as-Code Walkthrough',
        timestamp: '39:00',
        seconds: 2340,
        summary: 'Automating multi-tier VPC provisioning with reusable Terraform modules.',
      },
    ],
    notes: `### ☁️ AWS VPC Production Best Practices

- **Subnet Layout**: Always maintain 3 tiers (Public Subnets, Application Private Subnets, Isolated DB Subnets).
- **Security Group Chaining**: Never open port 5432/3306 to 0.0.0.0/0. Reference the Application Security Group ID directly as the source.
- **VPC Flow Logs**: Stream flow logs to CloudWatch Insights to diagnose connection resets and packet drops.`,
    attachments: [
      {
        id: 'att-vpc-pdf',
        name: 'AWS_VPC_Enterprise_Architecture.pdf',
        fileUrl: 'https://krtech.edu/downloads/AWS_VPC_Enterprise_Architecture.pdf',
        fileType: 'PDF',
        fileSize: '4.1 MB',
        downloadCount: 529,
      },
      {
        id: 'att-vpc-tf',
        name: 'terraform-aws-vpc-module.zip',
        fileUrl: 'https://krtech.edu/downloads/terraform-aws-vpc-module.zip',
        fileType: 'ZIP',
        fileSize: '5.6 MB',
        downloadCount: 472,
      },
    ],
    resources: [
      {
        title: 'AWS Well-Architected Framework: Reliability Pillar',
        url: 'https://aws.amazon.com/architecture/well-architected/',
        type: 'docs',
      },
    ],
  },
  {
    courseId: 'mern-stack',
    moduleNumber: 1,
    moduleTitle: 'Module 1: Advanced Database Engineering & State Systems',
    lectureNumber: 1,
    title: 'MongoDB Aggregation Pipelines, Sharding Strategies & Indexing Optimization',
    description:
      'Optimize complex database operations with multi-stage aggregations ($lookup, $facet, $unwind), compound indexes, and sharding cluster keys.',
    duration: '42 mins',
    durationMinutes: 42,
    videoUrl: 'https://www.youtube-nocookie.com/embed/ofme2o29ngU', // MongoDB aggregation tutorial
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop&auto=format',
    notesUrl: 'https://krtech.edu/downloads/MongoDB_Aggregation_Optimization.pdf',
    notesFileName: 'MongoDB_Aggregation_Optimization.pdf',
    recordedDate: 'Sep 05, 2026',
    instructor: 'Amit Verma (Principal Systems Architect)',
    tags: ['MongoDB', 'Aggregation', 'Database Performance', 'MERN Stack'],
    chapters: [
      {
        id: 'chap-m-01',
        title: 'Aggregation Execution Model & Pipeline Stages',
        timestamp: '00:00',
        seconds: 0,
        summary: 'Memory limits (100MB RAM stage ceiling), allowDiskUse options, early filtering with $match.',
      },
      {
        id: 'chap-m-02',
        title: 'High Performance $lookup & Correlated Subqueries',
        timestamp: '11:15',
        seconds: 675,
        summary: 'Joining collections without full table scans using foreign compound indexes.',
      },
      {
        id: 'chap-m-03',
        title: 'Compound Indexes & ESR (Equality, Sort, Range) Rule',
        timestamp: '23:45',
        seconds: 1425,
        summary: 'Designing indexes that satisfy collation, sorting, and range queries simultaneously.',
      },
      {
        id: 'chap-m-04',
        title: 'Sharding & Chunk Distribution',
        timestamp: '33:10',
        seconds: 1990,
        summary: 'Hashed vs ranged shard keys, mongos routing tier, avoiding jumbo chunks.',
      },
    ],
    notes: `### 🍃 MongoDB Optimization Masterclass

#### ESR (Equality, Sort, Range) Rule
1. Put **Equality** fields first in the compound index: \`{ status: 1, ... }\`
2. Put **Sort** fields second: \`{ status: 1, createdAt: -1, ... }\`
3. Put **Range** fields last: \`{ status: 1, createdAt: -1, score: 1 }\`

#### Aggregation Optimization
- Always place \`$match\` and \`$project\` as close to the start of the pipeline as possible to minimize document flow through later stages.`,
    attachments: [
      {
        id: 'att-m-pdf',
        name: 'MongoDB_Aggregation_Optimization.pdf',
        fileUrl: 'https://krtech.edu/downloads/MongoDB_Aggregation_Optimization.pdf',
        fileType: 'PDF',
        fileSize: '3.1 MB',
        downloadCount: 390,
      },
      {
        id: 'att-m-zip',
        name: 'mongodb-aggregation-benchmarks.zip',
        fileUrl: 'https://krtech.edu/downloads/mongodb-aggregation-benchmarks.zip',
        fileType: 'ZIP',
        fileSize: '6.2 MB',
        downloadCount: 315,
      },
    ],
    resources: [
      {
        title: 'MongoDB Aggregation Pipeline Builder Documentation',
        url: 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline/',
        type: 'docs',
      },
    ],
  },
];

async function seedLectures() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB Atlas');

    console.log('\n--- Seeding Rich Recorded Lectures ---');
    const seededLectures = [];

    for (const lec of RICH_LECTURES) {
      const updated = await Lecture.findOneAndUpdate(
        { courseId: lec.courseId, lectureNumber: lec.lectureNumber },
        { $set: lec },
        { upsert: true, new: true }
      );
      seededLectures.push(updated);
      console.log(`✓ Seeded Lecture: [${updated.courseId}] #${updated.lectureNumber} "${updated.title}" with ${updated.chapters.length} chapters & ${updated.attachments.length} attachments`);
    }

    // Seed WatchHistory for aditya.sharma@krtech.edu
    console.log('\n--- Seeding Watch History & Continue Watching Shelf ---');
    const userEmail = 'aditya.sharma@krtech.edu';

    // 1. In-progress lecture 1 (Kafka): 18 mins 20 secs watched (1100s of 2880s = ~38%)
    const kafkaLec = seededLectures.find((l) => l.courseId === 'java-backend' && l.lectureNumber === 1);
    if (kafkaLec) {
      await WatchHistory.findOneAndUpdate(
        { userEmail, lectureId: String(kafkaLec._id) },
        {
          $set: {
            userEmail,
            lectureId: String(kafkaLec._id),
            courseId: kafkaLec.courseId,
            lectureTitle: kafkaLec.title,
            courseTitle: kafkaLec.moduleTitle,
            thumbnail: kafkaLec.thumbnail,
            instructor: kafkaLec.instructor,
            watchedSeconds: 1100,
            durationSeconds: 2880,
            progressPercent: 38,
            completed: false,
            lastWatchedAt: new Date(Date.now() - 1000 * 60 * 35), // 35 mins ago
            personalNotes:
              'Remember to review Kafka cooperative sticky assignors before tomorrow morning 1:1 pair programming session with Rajesh.',
          },
        },
        { upsert: true }
      );
      console.log('✓ Seeded in-progress WatchHistory: Kafka Event-Driven (38% watched - Resume at 18:20)');
    }

    // 2. In-progress lecture 2 (AWS VPC): 25 mins 10 secs watched (1510s of 3120s = ~48%)
    const awsLec = seededLectures.find((l) => l.courseId === 'aws-architect' && l.lectureNumber === 1);
    if (awsLec) {
      await WatchHistory.findOneAndUpdate(
        { userEmail, lectureId: String(awsLec._id) },
        {
          $set: {
            userEmail,
            lectureId: String(awsLec._id),
            courseId: awsLec.courseId,
            lectureTitle: awsLec.title,
            courseTitle: awsLec.moduleTitle,
            thumbnail: awsLec.thumbnail,
            instructor: awsLec.instructor,
            watchedSeconds: 1510,
            durationSeconds: 3120,
            progressPercent: 48,
            completed: false,
            lastWatchedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            personalNotes:
              'Transit Gateway route table rules: each VPC spoke must have a route pointing back to the central inspection VPC.',
          },
        },
        { upsert: true }
      );
      console.log('✓ Seeded in-progress WatchHistory: AWS VPC Peering (48% watched - Resume at 25:10)');
    }

    // 3. Completed lecture (Resilience4j): 100% watched
    const resLec = seededLectures.find((l) => l.courseId === 'java-backend' && l.lectureNumber === 2);
    if (resLec) {
      await WatchHistory.findOneAndUpdate(
        { userEmail, lectureId: String(resLec._id) },
        {
          $set: {
            userEmail,
            lectureId: String(resLec._id),
            courseId: resLec.courseId,
            lectureTitle: resLec.title,
            courseTitle: resLec.moduleTitle,
            thumbnail: resLec.thumbnail,
            instructor: resLec.instructor,
            watchedSeconds: 2700,
            durationSeconds: 2700,
            progressPercent: 100,
            completed: true,
            lastWatchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // yesterday
            personalNotes: 'Successfully completed Resilience4j lab and validated circuit breaker trip metrics.',
          },
        },
        { upsert: true }
      );
      console.log('✓ Seeded completed WatchHistory: Resilience4j Circuit Breakers (100% completed)');
    }

    console.log('\n================================================================================');
    console.log('        ✓ KR TECH STEP 5.12 ATLAS LECTURES & WATCH HISTORY SEEDED!             ');
    console.log('================================================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Atlas seeding failed:', err);
    process.exit(1);
  }
}

seedLectures();
