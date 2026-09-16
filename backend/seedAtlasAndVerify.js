const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Lead = require('./models/Lead');
const Course = require('./models/Course');
const Mentor = require('./models/Mentor');
const Resource = require('./models/Resource');
const Certificate = require('./models/Certificate');

async function seedAndVerifyAtlas() {
  console.log('==================================================');
  console.log('   KR TECH — ATLAS LIVE SEED & PROOF VERIFIER     ');
  console.log('==================================================');

  const uri = process.env.MONGO_URI;
  console.log('Target MONGO_URI:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED');

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('\n✅ 1. ATLAS CONNECTED SUCCESSFULLY!');
    console.log('   Host:', conn.connection.host);
    console.log('   Database:', conn.connection.name);

    const admin = new mongoose.mongo.Admin(conn.connection.db);
    const dbs = await admin.listDatabases();
    console.log('\n✅ 2. ATLAS DATABASES FOUND:');
    console.log('   ', dbs.databases.map(d => `${d.name} (${Math.round(d.sizeOnDisk / 1024)} KB)`).join(', '));

    // Seed Data
    console.log('\n--- 3. SEEDING ATLAS COLLECTIONS ---');
    
    // Seed Admin
    let adminUser = await User.findOne({ email: 'admin@krtech.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'KR Tech Administrator',
        email: 'admin@krtech.com',
        password: 'admin123',
        phone: '+91 99999 00000',
        role: 'admin',
      });
      console.log('   - Admin user created: admin@krtech.com');
    }

    // Insert verification lead
    const insertedLead = await Lead.create({
      name: 'Atlas Verification Test',
      email: 'atlas.test@krtech.com',
      phone: '+91 9999988888',
      course: 'Full Stack Java Enterprise Developer',
      status: 'Verified',
      preferredTime: 'Morning (10:00 AM IST)',
      timeZone: 'IST (UTC+5:30)',
      message: 'Direct verification test for Atlas cloud database.',
    });
    console.log('   - Inserted test lead: Atlas Verification Test');

    // Read back verification lead
    const verifiedDoc = await Lead.findById(insertedLead._id);
    console.log('\n✅ 4. READ BACK PROOF FROM ATLAS:');
    console.log('   Document ID:', verifiedDoc._id.toString());
    console.log('   Name:', verifiedDoc.name);
    console.log('   Status:', verifiedDoc.status);
    console.log('   Created At:', verifiedDoc.createdAt);

    // List collections & counts
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n✅ 5. ATLAS COLLECTIONS & DOCUMENT COUNTS:');
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(`   - ${c.name}: ${count} document(s)`);
    }

    await mongoose.disconnect();
    console.log('\n🎉 ALL ATLAS VERIFICATIONS PASSED.');
    return true;
  } catch (err) {
    console.error('\n❌ ATLAS CONNECTION / VERIFICATION ERROR:');
    console.error('Message:', err.message);
    return false;
  }
}

seedAndVerifyAtlas();
