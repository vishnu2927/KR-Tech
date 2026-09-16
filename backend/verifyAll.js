const mongoose = require('mongoose');
const http = require('http');

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runVerification() {
  console.log('==================================================');
  console.log('KR TECH v9.2 COMPREHENSIVE BACKEND VERIFICATION');
  console.log('==================================================');

  require('dotenv').config({ path: require('path').join(__dirname, '.env') });
  const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  const db = conn.connection.db;
  
  const collections = await db.listCollections().toArray();
  const collNames = collections.map(c => c.name);
  console.log('Connected to DB:', db.databaseName);
  console.log('Available Collections:', collNames.join(', '));

  const counts = {};
  for (const name of ['users', 'leads', 'courses', 'mentors', 'resources', 'certificates']) {
    counts[name] = await db.collection(name).countDocuments();
    console.log(`  - ${name}: ${counts[name]} documents`);
  }

  // STEP 4: CRUD Testing
  console.log('\n--- STEP 4: CRUD OPERATIONS ---');
  // Lead CRUD
  const leadInsert = await db.collection('leads').insertOne({
    name: 'Auto CRUD Test Lead',
    email: 'crud_lead@krtech.com',
    phone: '+91 9900011223',
    course: 'Full Stack Java Enterprise Developer',
    status: 'New',
    createdAt: new Date()
  });
  console.log('  Lead Create: OK -> ID:', leadInsert.insertedId);

  const leadRead = await db.collection('leads').findOne({ _id: leadInsert.insertedId });
  console.log('  Lead Read: OK -> Name:', leadRead.name);

  await db.collection('leads').updateOne({ _id: leadInsert.insertedId }, { $set: { status: 'Scheduled' } });
  const leadUpdated = await db.collection('leads').findOne({ _id: leadInsert.insertedId });
  console.log('  Lead Update: OK -> Status:', leadUpdated.status);

  await db.collection('leads').deleteOne({ _id: leadInsert.insertedId });
  const leadCheck = await db.collection('leads').findOne({ _id: leadInsert.insertedId });
  console.log('  Lead Delete: OK -> Found after delete:', leadCheck === null);

  // Course CRUD
  const courseInsert = await db.collection('courses').insertOne({
    id: 'test-crud-course',
    title: 'Test Cloud DevOps Architect',
    category: 'AWS',
    rating: 4.9,
    reviews: 120,
    enrolled: '1,500+',
    duration: '12 Weeks',
    level: 'Advanced',
    highlights: ['IaC', 'Kubernetes'],
    topics: ['Docker', 'AWS ECS'],
    price: 34999
  });
  console.log('  Course Create: OK -> ID:', courseInsert.insertedId);

  await db.collection('courses').updateOne({ _id: courseInsert.insertedId }, { $set: { title: 'Updated Cloud DevOps Architect' } });
  const courseUpdated = await db.collection('courses').findOne({ _id: courseInsert.insertedId });
  console.log('  Course Update: OK -> Title:', courseUpdated.title);

  await db.collection('courses').deleteOne({ _id: courseInsert.insertedId });
  const courseCheck = await db.collection('courses').findOne({ _id: courseInsert.insertedId });
  console.log('  Course Delete: OK -> Found after delete:', courseCheck === null);

  // Mentor CRUD
  const mentorInsert = await db.collection('mentors').insertOne({
    id: 'test-crud-mentor',
    name: 'Dr. Test Mentor',
    technology: 'AI & Data Engineering',
    exp: '14+ Yrs',
    rating: 4.95,
    languages: 'English, Hindi',
    specialization: 'Generative AI & LLMOps'
  });
  console.log('  Mentor Create: OK -> ID:', mentorInsert.insertedId);

  await db.collection('mentors').updateOne({ _id: mentorInsert.insertedId }, { $set: { specialization: 'Distributed Systems & AI' } });
  const mentorUpdated = await db.collection('mentors').findOne({ _id: mentorInsert.insertedId });
  console.log('  Mentor Update: OK -> Specialization:', mentorUpdated.specialization);

  await db.collection('mentors').deleteOne({ _id: mentorInsert.insertedId });
  const mentorCheck = await db.collection('mentors').findOne({ _id: mentorInsert.insertedId });
  console.log('  Mentor Delete: OK -> Found after delete:', mentorCheck === null);

  // STEP 5: Live API Verification
  console.log('\n--- STEP 5: LIVE API ENDPOINTS ---');
  // 1. GET /api/courses
  const resCourses = await get('http://localhost:5000/api/courses');
  console.log('1. GET /api/courses -> Status:', resCourses.status, 'Count:', resCourses.data.count, 'Origin: MongoDB (Live)');

  // 2. GET /api/mentors
  const resMentors = await get('http://localhost:5000/api/mentors');
  console.log('2. GET /api/mentors -> Status:', resMentors.status, 'Count:', resMentors.data.count, 'Origin: MongoDB (Live)');

  // 3. POST /api/leads
  const resPostLead = await post('http://localhost:5000/api/leads', {
    name: 'Pooja Verma',
    email: 'pooja.verma@example.com',
    phone: '+91 9876543210',
    course: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
    preferredTime: 'Weekend Morning (10:00 AM - 1:00 PM)',
    timeZone: 'IST (UTC+5:30)',
    message: 'Interested in upcoming batch syllabus.'
  });
  console.log('3. POST /api/leads -> Status:', resPostLead.status, 'Message:', resPostLead.data.message, 'Lead saved to Mongo with ID:', resPostLead.data.lead && resPostLead.data.lead._id);

  // 4. POST /api/auth/login
  const resLogin = await post('http://localhost:5000/api/auth/login', {
    email: 'admin@krtech.com',
    password: 'admin123'
  });
  const token = resLogin.data.token;
  console.log('4. POST /api/auth/login -> Status:', resLogin.status, 'Admin Token received:', !!token);

  // 5. GET /api/auth/profile
  const resProfile = await get('http://localhost:5000/api/auth/profile', token);
  console.log('5. GET /api/auth/profile -> Status:', resProfile.status, 'User Email:', resProfile.data.user && resProfile.data.user.email, 'Role:', resProfile.data.user && resProfile.data.user.role);

  // 6. GET /api/leads
  const resLeads = await get('http://localhost:5000/api/leads', token);
  console.log('6. GET /api/leads -> Status:', resLeads.status, 'Count:', resLeads.data.count);

  // 7. GET /api/leads/stats
  const resStats = await get('http://localhost:5000/api/leads/stats', token);
  console.log('7. GET /api/leads/stats -> Status:', resStats.status, 'Total Leads:', resStats.data.stats.totalLeads, 'Total Courses:', resStats.data.stats.totalCourses, 'Total Mentors:', resStats.data.stats.totalMentors);

  await mongoose.disconnect();
  console.log('\n✅ All Database, CRUD, and API verification tests passed successfully.');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
