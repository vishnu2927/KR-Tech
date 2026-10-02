const mongoose = require('./node_modules/mongoose');
const path = require('path');
require('./node_modules/dotenv').config({ path: path.join(__dirname, '.env') });

const Notification = require('./models/Notification');

const INITIAL_NOTIFICATIONS = [
  // 1. Admin Announcements
  {
    title: '🚀 KR Tech 2026 High-Scale Engineering Hackathon Announced!',
    message: 'Join 500+ engineers designing resilient distributed systems. Sponsored by Tier-1 cloud partners with ₹5,00,000 in prizes.',
    type: 'announcement',
    recipient: 'all',
    recipientRole: 'all',
    isRead: false,
    priority: 'urgent',
    actionUrl: '/courses',
    metadata: {
      scheduledTime: 'October 10, 2026',
    },
    createdBy: {
      name: 'KR Tech Executive Council',
      role: 'Head of Admissions',
    },
  },
  {
    title: '📢 New Advanced Course Track Released: AI-Powered Cloud Architectures',
    message: 'Master LLM orchestration with LangGraph, vLLM, and AWS Bedrock at production scale with 1:1 live mentor support.',
    type: 'announcement',
    recipient: 'all',
    recipientRole: 'all',
    isRead: false,
    priority: 'high',
    actionUrl: '/courses/ai-cloud-architecture',
    createdBy: {
      name: 'Karthik R.',
      role: 'Principal Systems Architect',
    },
  },
  {
    title: '🎓 Annual Certification Milestone: 98.4% Practical Mastery Rate Across 2026 Cohorts',
    message: 'Congratulations to our graduates earning top credentials across AWS, Azure, SAP, and Cisco tracks. Complete verification report available.',
    type: 'announcement',
    recipient: 'all',
    recipientRole: 'all',
    isRead: true,
    priority: 'normal',
    actionUrl: '/certificates',
    createdBy: {
      name: 'KR Global Learning Student Success Team',
      role: 'Academic Director',
    },
  },

  // 2. Course Reminders
  {
    title: '⏰ Live Class Reminder: Distributed System Design Capstone Starts in 2 Hours',
    message: 'Module 4: Designing Multi-Region Sharded Databases with Cassandra and Raft Consensus. Please join Zoom 10 minutes early.',
    type: 'course_reminder',
    recipient: 'all',
    recipientRole: 'student',
    isRead: false,
    priority: 'high',
    actionUrl: '/dashboard',
    metadata: {
      courseId: 'system-design',
      courseTitle: 'System Design & High-Scale Architecture Masterclass',
      batch: 'Batch-24A (Weekend)',
      scheduledTime: 'Today at 7:00 PM IST',
      mentorName: 'Rajesh Kumar (Principal Technical Architect)',
    },
    createdBy: {
      name: 'Rajesh Kumar',
      role: 'Principal Mentor',
    },
  },
  {
    title: '💻 Assignment Due: Microservices Circuit Breaker & Retry Policies',
    message: 'Your implementation of Resilience4j with Spring Boot 3 is due tomorrow at 11:59 PM. Review test cases in the repo before submitting.',
    type: 'course_reminder',
    recipient: 'all',
    recipientRole: 'student',
    isRead: false,
    priority: 'normal',
    actionUrl: '/dashboard',
    metadata: {
      courseId: 'java-backend',
      courseTitle: 'Complete Java Backend Development with Spring Boot',
      batch: 'Batch-24B (Evening)',
    },
    createdBy: {
      name: 'Teaching Assistant Desk',
      role: 'Evaluator',
    },
  },
  {
    title: '⚡ 1:1 Architecture Mentorship Session Scheduled',
    message: 'Your 45-minute 1:1 code review and system design interview drill with Vikram Nair is scheduled for Thursday.',
    type: 'course_reminder',
    recipient: 'all',
    recipientRole: 'student',
    isRead: true,
    priority: 'normal',
    actionUrl: '/dashboard',
    metadata: {
      mentorName: 'Vikram Nair (Senior Cloud Specialist)',
      scheduledTime: 'Thursday, 6:30 PM IST',
    },
    createdBy: {
      name: 'Vikram Nair',
      role: 'Lead Cloud Mentor',
    },
  },

  // 3. Demo Reminders
  {
    title: '📅 Demo Confirmation: 1:1 Live Curriculum & Tech Roadmap Session',
    message: 'Your personalized consultation with a Senior Engineering Mentor is confirmed. We will review your career goals and tailor the live capstones.',
    type: 'demo_reminder',
    recipient: 'all',
    recipientRole: 'student',
    isRead: false,
    priority: 'urgent',
    actionUrl: '/free-demo',
    metadata: {
      courseTitle: 'Complete Java Backend Development with Spring Boot',
      scheduledTime: 'Tomorrow at 6:00 PM IST',
    },
    createdBy: {
      name: 'Admissions Counseling Team',
      role: 'Senior Counselor',
    },
  },
  {
    title: '🔗 Google Meet Link Generated for Your 1:1 Live Demo Consultation',
    message: 'Click to test your audio/video setup before your session with our Principal Architect. Screen share capstone projects will be showcased.',
    type: 'demo_reminder',
    recipient: 'all',
    recipientRole: 'student',
    isRead: false,
    priority: 'high',
    actionUrl: 'https://meet.google.com/xyz-demo-krtech',
    metadata: {
      scheduledTime: 'Tomorrow, 6:00 PM IST',
    },
    createdBy: {
      name: 'Admissions Automation System',
      role: 'System',
    },
  },
];

async function seedNotifications() {
  try {
    console.log('Connecting to MongoDB Atlas to seed in-app notifications...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to:', mongoose.connection.name);

    for (const notif of INITIAL_NOTIFICATIONS) {
      await Notification.findOneAndUpdate(
        { title: notif.title },
        notif,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✓ Seeded [${notif.type}]: ${notif.title.slice(0, 55)}...`);
    }

    const totalCount = await Notification.countDocuments();
    const unreadCount = await Notification.countDocuments({ isRead: false });

    console.log(`\n✅ MongoDB Atlas 'notifications' collection seeded successfully!`);
    console.log(`- Total notifications: ${totalCount}`);
    console.log(`- Unread notifications: ${unreadCount}`);

    process.exit(0);
  } catch (err) {
    console.error('Failed to seed notifications:', err);
    process.exit(1);
  }
}

seedNotifications();
