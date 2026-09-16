const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function testMongo() {
  console.log('--- MongoDB Atlas Connection Test ---');
  console.log('URI:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'UNDEFINED');
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 6000,
    });
    console.log('✅ Connected successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database Name:', conn.connection.name);
    console.log('ReadyState:', conn.connection.readyState);
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.reason) console.error('Error Reason:', error.reason);
    return false;
  }
}

testMongo().then(success => {
  process.exit(success ? 0 : 1);
});
