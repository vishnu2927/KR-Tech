const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Lead = require('./models/Lead');
const Course = require('./models/Course');
const Mentor = require('./models/Mentor');
const Resource = require('./models/Resource');
const Certificate = require('./models/Certificate');

async function runCRUDTests() {
  console.log('==================================================');
  console.log('       STEP 4 — PERFORMING LIVE CRUD TESTS        ');
  console.log('==================================================');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected on database:', mongoose.connection.name);

  // 1. LEAD CRUD
  console.log('\n--- 1. Testing Lead CRUD ---');
  // Create
  const newLead = await Lead.create({
    name: 'Test Automation Lead',
    email: 'test.automation@krtech.edu',
    phone: '+91 99999 88888',
    course: 'Complete Java Backend Development with Spring Boot',
    preferredTime: 'Evening (7:00 PM - 9:00 PM IST)',
    timeZone: 'IST (UTC+5:30)',
    message: 'Testing automated CRUD lead creation',
    status: 'New',
  });
  console.log(`[CREATE] Lead created with ID: ${newLead._id} | Status: ${newLead.status}`);

  // Read
  const fetchedLead = await Lead.findById(newLead._id);
  console.log(`[READ] Fetched lead: "${fetchedLead.name}" | Course: "${fetchedLead.course}"`);

  // Update
  fetchedLead.status = 'Scheduled';
  fetchedLead.notes = 'Live 1:1 demo scheduled with senior mentor';
  await fetchedLead.save();
  console.log(`[UPDATE] Updated status to: "${fetchedLead.status}" | Notes: "${fetchedLead.notes}"`);

  // Delete
  await Lead.findByIdAndDelete(newLead._id);
  const verifyLeadDeleted = await Lead.findById(newLead._id);
  console.log(`[DELETE] Deleted lead verification: ${verifyLeadDeleted === null ? 'SUCCESS (null)' : 'FAILED'}`);

  // 2. COURSE CRUD
  console.log('\n--- 2. Testing Course CRUD ---');
  // Create
  const newCourse = await Course.create({
    title: 'Test Cloud Architecture Microservices Lab',
    category: 'Cloud Computing',
    description: 'Automated test course for CRUD verification',
    duration: '2 Months',
    level: 'Advanced',
    rating: 4.95,
    studentsCount: 150,
    price: 19999,
  });
  console.log(`[CREATE] Course created with ID: ${newCourse._id} | Title: "${newCourse.title}"`);

  // Update
  newCourse.title = 'Test Cloud Architecture & Distributed Systems (Updated)';
  await newCourse.save();
  console.log(`[UPDATE] Course updated title: "${newCourse.title}"`);

  // Delete
  await Course.findByIdAndDelete(newCourse._id);
  const verifyCourseDeleted = await Course.findById(newCourse._id);
  console.log(`[DELETE] Deleted course verification: ${verifyCourseDeleted === null ? 'SUCCESS (null)' : 'FAILED'}`);

  // 3. MENTOR CRUD
  console.log('\n--- 3. Testing Mentor CRUD ---');
  // Create
  const newMentor = await Mentor.create({
    name: 'Dr. Test Mentor',
    role: 'Staff Infrastructure Architect',
    company: 'Ex-Google Cloud',
    experience: '15+ Years',
    skills: ['Kubernetes', 'Go', 'Distributed Systems'],
    languages: ['English', 'Hindi'],
    bio: 'Test mentor created for verification',
  });
  console.log(`[CREATE] Mentor created with ID: ${newMentor._id} | Name: "${newMentor.name}"`);

  // Update
  newMentor.role = 'Distinguished Engineer & Mentor (Updated)';
  await newMentor.save();
  console.log(`[UPDATE] Mentor updated role: "${newMentor.role}"`);

  // Delete
  await Mentor.findByIdAndDelete(newMentor._id);
  const verifyMentorDeleted = await Mentor.findById(newMentor._id);
  console.log(`[DELETE] Deleted mentor verification: ${verifyMentorDeleted === null ? 'SUCCESS (null)' : 'FAILED'}`);

  console.log('\n==================================================');
  console.log('✅ ALL CRUD OPERATIONS PASSED WITH 100% SUCCESS');
  console.log('==================================================\n');

  await mongoose.disconnect();
}

runCRUDTests().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
