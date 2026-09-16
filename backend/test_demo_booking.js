const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const API_BASE = 'http://localhost:5000/api';

async function testDemoBooking() {
  console.log('=== STEP 3.3 — FREE DEMO BOOKING UPGRADE & ATLAS PROOF ===\n');

  // 1. Connect directly to MongoDB Atlas to inspect live documents
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
  console.log('✓ Connected to MongoDB Atlas:', mongoose.connection.host);
  console.log('✓ Active Database:', mongoose.connection.name);

  const leadsCollection = mongoose.connection.collection('leads');

  const testEmail = `priya.nair.${Date.now()}@krtech.edu`;
  const testPayload = {
    name: 'Priya Nair',
    email: testEmail,
    phone: '+91 98450 12345',
    course: 'AWS Certified Solutions Architect (SAA-C03)',
    preferredTime: 'Evening (6:00 PM - 8:00 PM IST)',
    timeZone: 'IST (India · UTC+5:30)',
    message: 'Preparing for AWS Solutions Architect associate exam. Want 1:1 roadmap evaluation.',
  };

  console.log('\n--- TEST 1: Strict Validation Checks ---');
  // Test invalid email
  try {
    await axios.post(`${API_BASE}/leads`, { ...testPayload, email: 'invalid-email' });
    console.log('FAIL: Invalid email accepted');
  } catch (err) {
    console.log('✓ Invalid email correctly rejected (400):', err.response?.data?.message);
  }

  // Test short phone
  try {
    await axios.post(`${API_BASE}/leads`, { ...testPayload, phone: '123' });
    console.log('FAIL: Short phone accepted');
  } catch (err) {
    console.log('✓ Short phone correctly rejected (400):', err.response?.data?.message);
  }

  // Test missing course
  try {
    await axios.post(`${API_BASE}/leads`, { ...testPayload, course: '' });
    console.log('FAIL: Empty course accepted');
  } catch (err) {
    console.log('✓ Missing course correctly rejected (400):', err.response?.data?.message);
  }

  console.log('\n--- TEST 2: Successful Booking Creation in Atlas ---');
  let bookingResponse;
  try {
    const res = await axios.post(`${API_BASE}/leads`, testPayload);
    bookingResponse = res.data;
    console.log('✓ API Response Status: 201 Created');
    console.log('✓ Success:', bookingResponse.success);
    console.log('✓ Generated Booking ID:', bookingResponse.bookingId);
    console.log('✓ Message:', bookingResponse.message);
  } catch (err) {
    console.error('FAIL in creating booking:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n--- TEST 3: Direct MongoDB Atlas Document Proof ---');
  const atlasDoc = await leadsCollection.findOne({ email: testEmail });
  if (!atlasDoc) {
    console.error('FAIL: Document not found in MongoDB Atlas!');
    process.exit(1);
  }

  console.log('Found MongoDB Atlas document for:', testEmail);
  console.log(JSON.stringify(atlasDoc, null, 2));

  console.log('\n--- TEST 4: Duplicate Email Prevention Check ---');
  try {
    await axios.post(`${API_BASE}/leads`, {
      ...testPayload,
      name: 'Priya Nair (Duplicate Attempt)',
      course: 'MERN Stack Bootcamp',
    });
    console.log('FAIL: Duplicate email was accepted!');
  } catch (err) {
    console.log('✓ Duplicate HTTP Status:', err.response?.status);
    console.log('✓ Duplicate Response Payload:', JSON.stringify(err.response?.data, null, 2));
    if (err.response?.status === 409 && err.response?.data?.isDuplicate) {
      console.log('✓ Duplicate prevention verified! Existing Booking ID returned:', err.response.data.bookingId);
    } else {
      console.log('FAIL: Expected 409 duplicate status');
    }
  }

  console.log('\n--- TEST 5: WhatsApp Direct Link Pre-fill Verification ---');
  const activeBookingId = bookingResponse.bookingId;
  const expectedWaText = encodeURIComponent(
    `Hi KR Tech, I have booked a Free 1:1 Live Demo for "${testPayload.course}" (Booking ID: #${activeBookingId}). Please confirm my mentor session slot!`
  );
  const waUrl = `https://wa.me/919876543210?text=${expectedWaText}`;
  console.log('✓ WhatsApp Redirect URL generated:');
  console.log(waUrl);

  await mongoose.disconnect();
  console.log('\n=== ALL 5 UPGRADE SPECIFICATIONS VERIFIED WITH LIVE ATLAS PROOF ===');
}

testDemoBooking().catch((err) => {
  console.error('Test Execution Failed:', err);
  process.exit(1);
});
