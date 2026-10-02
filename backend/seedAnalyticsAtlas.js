const mongoose = require('./node_modules/mongoose');
const path = require('path');
require('./node_modules/dotenv').config({ path: path.join(__dirname, '.env') });

const Payment = require('./models/Payment');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Enrollment = require('./models/Enrollment');

async function seedHistoricalAnalytics() {
  try {
    console.log('Connecting to MongoDB Atlas to seed chronological analytics data...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to:', mongoose.connection.name);

    const now = new Date();

    // 1. Seed Chronological Historical Payments over the last 14 days
    console.log('Seeding multi-day payment transactions...');
    const paymentPresets = [
      { daysAgo: 13, amount: 14999, courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices', courseId: 'java-backend', method: 'upi', user: 'Vikram Mehta', email: 'vikram.m@gmail.com' },
      { daysAgo: 12, amount: 12999, courseTitle: 'AWS Certified Solutions Architect Associate (SAA-C03)', courseId: 'aws-solutions-architect', method: 'card', user: 'Sneha Rao', email: 'sneha.rao@outlook.com' },
      { daysAgo: 11, amount: 14999, courseTitle: 'System Design & High-Scale Architecture Masterclass', courseId: 'system-design', method: 'upi', user: 'Anand Kumar', email: 'anand.k@techmail.com' },
      { daysAgo: 10, amount: 16999, courseTitle: 'Kubernetes & GitOps Cloud-Native DevOps Bootcamp', courseId: 'devops-kubernetes', method: 'netbanking', user: 'Pooja Nair', email: 'pooja.n@gmail.com' },
      { daysAgo: 9, amount: 12999, courseTitle: 'MERN Stack Full Stack Web Development Mastery', courseId: 'mern-stack', method: 'upi', user: 'Rahul Saxena', email: 'rahul.s@yahoo.com' },
      { daysAgo: 8, amount: 14999, courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices', courseId: 'java-backend', method: 'card', user: 'Harish Reddy', email: 'harish.r@gmail.com' },
      { daysAgo: 7, amount: 14999, courseTitle: 'System Design & High-Scale Architecture Masterclass', courseId: 'system-design', method: 'upi', user: 'Neha Sharma', email: 'neha.sharma@gmail.com' },
      { daysAgo: 6, amount: 16999, courseTitle: 'Kubernetes & GitOps Cloud-Native DevOps Bootcamp', courseId: 'devops-kubernetes', method: 'upi', user: 'Arun Iyer', email: 'arun.iyer@gmail.com' },
      { daysAgo: 5, amount: 14999, courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices', courseId: 'java-backend', method: 'netbanking', user: 'Deepak Joshi', email: 'deepak.j@gmail.com' },
      { daysAgo: 4, amount: 12999, courseTitle: 'AWS Certified Solutions Architect Associate (SAA-C03)', courseId: 'aws-solutions-architect', method: 'upi', user: 'Priya Pillai', email: 'priya.p@gmail.com' },
      { daysAgo: 3, amount: 14999, courseTitle: 'MERN Stack Full Stack Web Development Mastery', courseId: 'mern-stack', method: 'card', user: 'Gaurav Kulkarni', email: 'gaurav.k@gmail.com' },
      { daysAgo: 2, amount: 16999, courseTitle: 'System Design & High-Scale Architecture Masterclass', courseId: 'system-design', method: 'upi', user: 'Aditi Deshmukh', email: 'aditi.d@gmail.com' },
      { daysAgo: 1, amount: 14999, courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices', courseId: 'java-backend', method: 'upi', user: 'Sanjay Dutt', email: 'sanjay.dutt@gmail.com' },
      { daysAgo: 0, amount: 16999, courseTitle: 'Kubernetes & GitOps Cloud-Native DevOps Bootcamp', courseId: 'devops-kubernetes', method: 'upi', user: 'Divya Verma', email: 'divya.v@gmail.com' },
    ];

    for (const p of paymentPresets) {
      const pDate = new Date(now);
      pDate.setDate(pDate.getDate() - p.daysAgo);
      pDate.setHours(14, 30, 0, 0);

      const pid = `pay_hist_${p.daysAgo}_${Date.now().toString(36)}`;
      const oid = `order_hist_${p.daysAgo}_${Date.now().toString(36)}`;

      await Payment.findOneAndUpdate(
        { userEmail: p.email, courseTitle: p.courseTitle },
        {
          paymentId: pid,
          orderId: oid,
          userEmail: p.email,
          userName: p.user,
          courseId: p.courseId,
          courseTitle: p.courseTitle,
          amount: p.amount,
          currency: 'INR',
          method: p.method,
          status: 'captured',
          createdAt: pDate,
          updatedAt: pDate,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Also upsert an enrollment
      await Enrollment.findOneAndUpdate(
        { userEmail: p.email, courseId: p.courseId },
        {
          userEmail: p.email,
          userName: p.user,
          courseId: p.courseId,
          courseTitle: p.courseTitle,
          category: p.courseId.includes('java') || p.courseId.includes('mern') ? 'Software Engineering' : p.courseId.includes('aws') || p.courseId.includes('devops') ? 'Cloud & DevOps' : 'System Design',
          mentor: 'Senior Technical Architect',
          status: 'Active',
          progress: Math.min(95, 20 + p.daysAgo * 5),
          enrolledAt: pDate,
          createdAt: pDate,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 2. Seed Chronological Users for Daily Signups Trend
    console.log('Seeding daily student signups...');
    const signupData = [
      { daysAgo: 14, count: 4 },
      { daysAgo: 13, count: 6 },
      { daysAgo: 12, count: 5 },
      { daysAgo: 11, count: 7 },
      { daysAgo: 10, count: 8 },
      { daysAgo: 9, count: 6 },
      { daysAgo: 8, count: 9 },
      { daysAgo: 7, count: 11 },
      { daysAgo: 6, count: 10 },
      { daysAgo: 5, count: 12 },
      { daysAgo: 4, count: 8 },
      { daysAgo: 3, count: 14 },
      { daysAgo: 2, count: 15 },
      { daysAgo: 1, count: 13 },
      { daysAgo: 0, count: 9 },
    ];

    for (const s of signupData) {
      const sDate = new Date(now);
      sDate.setDate(sDate.getDate() - s.daysAgo);
      sDate.setHours(10, 15, 0, 0);

      for (let i = 0; i < s.count; i++) {
        const studentEmail = `student_${s.daysAgo}_${i}@krtech.test`;
        await User.findOneAndUpdate(
          { email: studentEmail },
          {
            name: `Student ${s.daysAgo}-${i}`,
            email: studentEmail,
            password: 'HashedPasswordTest123!',
            role: 'student',
            phone: `+91 98000 ${s.daysAgo.toString().padStart(2, '0')}${i.toString().padStart(3, '0')}`,
            createdAt: sDate,
            updatedAt: sDate,
          },
          { upsert: true, setDefaultsOnInsert: true }
        );
      }
    }

    // 3. Seed Chronological Leads for CRM Trend
    console.log('Seeding candidate leads timeline...');
    const leadCourses = [
      'Complete Java Backend Development with Spring Boot & Microservices',
      'System Design & High-Scale Architecture Masterclass',
      'AWS Certified Solutions Architect Associate (SAA-C03)',
      'Kubernetes & GitOps Cloud-Native DevOps Bootcamp',
      'MERN Stack Full Stack Web Development Mastery',
    ];
    const statuses = ['New', 'Contacted', 'Scheduled', 'Completed'];

    for (let day = 13; day >= 0; day--) {
      const lDate = new Date(now);
      lDate.setDate(lDate.getDate() - day);
      lDate.setHours(11, 45, 0, 0);

      const leadEmail = `lead_day_${day}@krtech.test`;
      await Lead.findOneAndUpdate(
        { email: leadEmail },
        {
          name: `Candidate Day ${day}`,
          email: leadEmail,
          phone: `+91 97000 ${day.toString().padStart(2, '0')}123`,
          course: leadCourses[day % leadCourses.length],
          status: statuses[day % statuses.length],
          notes: 'Automated consultation scheduled via website demo form',
          createdAt: lDate,
          updatedAt: lDate,
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    const totalPaymentsCount = await Payment.countDocuments({ status: 'captured' });
    const totalUsersCount = await User.countDocuments();
    const totalLeadsCount = await Lead.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    console.log('\n✅ Seeded Historical Analytics Data Successfully:');
    console.log(`- Captured Payments: ${totalPaymentsCount}`);
    console.log(`- Registered Users: ${totalUsersCount}`);
    console.log(`- CRM Candidate Leads: ${totalLeadsCount}`);
    console.log(`- Active Enrollments: ${totalEnrollments}`);

    process.exit(0);
  } catch (err) {
    console.error('Failed to seed analytics data:', err);
    process.exit(1);
  }
}

seedHistoricalAnalytics();
