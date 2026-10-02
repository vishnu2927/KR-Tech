const mongoose = require('./node_modules/mongoose');
const path = require('path');
require('./node_modules/dotenv').config({ path: path.join(__dirname, '.env') });

const StudentAnalytics = require('./models/StudentAnalytics');
const User = require('./models/User');

async function seedStudentAnalytics() {
  try {
    console.log('Connecting to MongoDB Atlas to seed Student Analytics & Progress data...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to:', mongoose.connection.name);

    const studentEmails = [
      'aditya.sharma@krtech.edu',
      'student_0_0@krtech.test',
      'student_1_0@krtech.test',
      'student@krtech.in',
    ];

    for (const email of studentEmails) {
      await StudentAnalytics.findOneAndUpdate(
        { userEmail: email },
        {
          userEmail: email,
          userName: email.includes('aditya') ? 'Aditya Sharma' : 'Student Learner',
          xp: 3850,
          level: 8,
          levelTitle: 'Senior Systems Builder',
          streak: {
            current: 5,
            longest: 18,
            lastActiveDate: new Date(),
            weeklyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          },
          attendance: {
            attendedSessions: 16,
            totalSessions: 17,
            attendanceRate: 94.1,
            history: [
              {
                sessionId: 'sess-101',
                topic: 'Microservices Circuit Breaker & Resilience4j in Action',
                mentorName: 'Rajesh Kumar (Principal Technical Architect)',
                date: 'Sep 16, 2026',
                status: 'Present',
                sessionType: '1:1 Live Coding & Architecture',
              },
              {
                sessionId: 'sess-102',
                topic: 'Distributed Kafka Event Sourcing & Partition Design',
                mentorName: 'Rajesh Kumar (Principal Technical Architect)',
                date: 'Sep 14, 2026',
                status: 'Present',
                sessionType: '1:1 Live Coding & Architecture',
              },
              {
                sessionId: 'sess-103',
                topic: 'AWS Multi-AZ VPC Peering & High Availability Routing',
                mentorName: 'Vikram Nair (Staff Software Engineer Cloud)',
                date: 'Sep 11, 2026',
                status: 'Present',
                sessionType: '1:1 Live Capstone Review',
              },
              {
                sessionId: 'sess-104',
                topic: 'Database Sharding Strategies with Raft & Paxos',
                mentorName: 'Rajesh Kumar (Principal Technical Architect)',
                date: 'Sep 08, 2026',
                status: 'Present',
                sessionType: '1:1 Live Architecture',
              },
              {
                sessionId: 'sess-105',
                topic: 'React 19 Server Actions & Optimistic State Sync',
                mentorName: 'Amit Verma (Principal Systems Architect)',
                date: 'Sep 05, 2026',
                status: 'Present',
                sessionType: '1:1 Live Coding',
              },
            ],
          },
          badges: [
            {
              id: 'badge-scaler',
              name: 'Distributed Scaler',
              icon: '⚡',
              description: 'Designed and deployed an Apache Kafka consumer group with zero message loss.',
              category: 'Architecture',
              unlocked: true,
              unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
              progressPercent: 100,
              criteria: 'Deploy production Kafka pipeline with consumer rebalance listeners.',
            },
            {
              id: 'badge-resilience',
              name: 'Resilience Architect',
              icon: '🛡️',
              description: 'Configured Resilience4j circuit breakers, bulkheads, and idempotent retry policies.',
              category: 'Microservices',
              unlocked: true,
              unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
              progressPercent: 100,
              criteria: '100% test pass on resilience circuit breaker fault injection suite.',
            },
            {
              id: 'badge-streak-7',
              name: '7-Day Streak Warrior',
              icon: '🔥',
              description: 'Completed code challenges and attended live cohort sessions for 7 consecutive days.',
              category: 'Consistency',
              unlocked: true,
              unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
              progressPercent: 100,
              criteria: 'Maintain continuous 7-day study and coding activity.',
            },
            {
              id: 'badge-cloud-pioneer',
              name: 'Cloud Pioneer',
              icon: '☁️',
              description: 'Passed AWS Certified Solutions Architect capstone with greater than 90% score.',
              category: 'Cloud & DevOps',
              unlocked: true,
              unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
              progressPercent: 100,
              criteria: 'Achieve >90% on AWS Multi-Region VPC & EKS Capstone evaluation.',
            },
            {
              id: 'badge-clean-code',
              name: 'Clean Code Artisan',
              icon: '💻',
              description: 'Maintained 100% test coverage with JUnit 5 & Testcontainers on Spring Boot 3.',
              category: 'Code Quality',
              unlocked: true,
              unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
              progressPercent: 100,
              criteria: 'Zero code smell alerts and full integration coverage.',
            },
            {
              id: 'badge-fullstack-pro',
              name: 'Full Stack Master',
              icon: '🚀',
              description: 'Integrated React 19 Frontend with Distributed Java Backend microservices.',
              category: 'Engineering',
              unlocked: false,
              progressPercent: 65,
              criteria: 'Complete Full Stack capstone with OAuth2 token rotation & WebSockets.',
            },
            {
              id: 'badge-staff-candidate',
              name: 'Staff Engineer Candidate',
              icon: '👑',
              description: 'Completed all Tier-1 mock system design interview rounds with Principal Mentors.',
              category: 'Career',
              unlocked: false,
              progressPercent: 80,
              criteria: 'Pass 4 high-scale mock system design interview evaluations.',
            },
            {
              id: 'badge-capstone-champion',
              name: 'Capstone Champion',
              icon: '🏆',
              description: 'Final enterprise production capstone approved and signed off by lead mentor.',
              category: 'Milestone',
              unlocked: false,
              progressPercent: 40,
              criteria: 'Deploy end-to-end multi-tenant fintech architecture to Kubernetes.',
            },
          ],
          xpActivities: [
            {
              title: 'Completed Lecture: Distributed Database Sharding',
              xp: 50,
              type: 'lecture',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            },
            {
              title: 'Submitted Capstone Assignment: Resilience4j Circuit Breaker',
              xp: 150,
              type: 'assignment',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
            },
            {
              title: 'Attended 1:1 Live Coding Session with Rajesh Kumar',
              xp: 100,
              type: 'attendance',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28),
            },
            {
              title: 'Maintained 5-Day Consecutive Learning Streak',
              xp: 75,
              type: 'streak',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
            },
            {
              title: 'Unlocked Badge: Resilience Architect',
              xp: 200,
              type: 'badge',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168),
            },
          ],
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✓ Seeded student analytics for: ${email}`);
    }

    console.log('\n✅ Student learning analytics seeded successfully in Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed student analytics:', err);
    process.exit(1);
  }
}

seedStudentAnalytics();
