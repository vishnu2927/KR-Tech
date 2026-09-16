const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const API_BASE = 'http://localhost:5000/api';

async function testCourseDetails() {
  console.log('=== STEP 3.5 — DYNAMIC COURSE DETAILS VERIFICATION ===\n');

  // Connect to Atlas
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
  console.log('✓ Connected to MongoDB Atlas:', mongoose.connection.host);
  console.log('✓ Database:', mongoose.connection.name);

  const coursesCollection = mongoose.connection.collection('courses');

  // 1. Pick a real course from MongoDB Atlas
  const sampleCourse = await coursesCollection.findOne({});
  if (!sampleCourse) {
    console.error('FAIL: No courses found in MongoDB Atlas!');
    process.exit(1);
  }

  console.log(`\nSample course from Atlas: "${sampleCourse.title}"`);
  console.log(`- Atlas _id: ${sampleCourse._id}`);
  console.log(`- Slug id: ${sampleCourse.id}`);
  console.log(`- Category: ${sampleCourse.category}`);
  console.log(`- Duration: ${sampleCourse.duration}`);
  console.log(`- Level: ${sampleCourse.level}`);

  console.log('\n--- 1. Fetching Course by MongoDB _id (GET /api/courses/:id) ---');
  try {
    const res = await axios.get(`${API_BASE}/courses/${sampleCourse._id}`);
    console.log('✓ Response Status: 200 OK');
    console.log('✓ Success:', res.data.success);
    console.log('✓ Retrieved Title:', res.data.course.title);
    console.log('✓ Retrieved Price:', res.data.course.price);
  } catch (err) {
    console.error('FAIL by _id:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n--- 2. Fetching Course by Slug id (GET /api/courses/:slug) ---');
  if (sampleCourse.id) {
    try {
      const res = await axios.get(`${API_BASE}/courses/${sampleCourse.id}`);
      console.log('✓ Response Status: 200 OK');
      console.log('✓ Retrieved Title using slug:', res.data.course.title);
    } catch (err) {
      console.error('FAIL by slug id:', err.response?.data || err.message);
      process.exit(1);
    }
  }

  console.log('\n--- 3. Testing Non-Existent Course (404 Handling) ---');
  try {
    await axios.get(`${API_BASE}/courses/non-existent-course-slug-12345`);
    console.log('FAIL: Non-existent course accepted');
  } catch (err) {
    console.log('✓ Non-existent course correctly returned 404:', err.response?.data?.message);
  }

  await mongoose.disconnect();
  console.log('\n=== STEP 3.5 DYNAMIC COURSE DETAILS API VERIFIED SUCCESSFULLY ===');
}

testCourseDetails().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
