const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('../config/db');
const User = require('../models/User');

function normalizePhone(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return '+91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  return '+' + digits;
}

async function resolveAndIndex() {
  await connectDB();
  const users = await User.find({});
  console.log('Resolving canonical phones for', users.length, 'users...');

  const seen = new Set();
  for (const u of users) {
    let normPhone = normalizePhone(u.phone);
    if (!normPhone) {
      normPhone = '+9198000' + u._id.toString().slice(-5);
    }
    while (seen.has(normPhone)) {
      const lastNum = parseInt(normPhone.slice(-4), 10) || 1000;
      normPhone = normPhone.slice(0, -4) + String(lastNum + 1).padStart(4, '0');
    }
    seen.add(normPhone);
    const normEmail = (u.email || '').trim().toLowerCase();

    await User.updateOne(
      { _id: u._id },
      { $set: { phone: normPhone, email: normEmail } }
    );
  }

  console.log('All user phone numbers normalized and unique.');

  // Create unique indexes
  console.log('Creating unique index on email...');
  await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
  console.log('Creating unique index on phone...');
  await mongoose.connection.collection('users').createIndex({ phone: 1 }, { unique: true });

  const indexes = await mongoose.connection.collection('users').indexes();
  console.log('Updated indexes on users:');
  console.log(JSON.stringify(indexes, null, 2));

  await mongoose.disconnect();
}

resolveAndIndex().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
