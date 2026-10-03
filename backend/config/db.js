const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️ MongoDB Atlas Notice: No MONGO_URI or MONGODB_URI configured.');
    console.log('⚡ Active Dual-Engine Mode: Express running with in-memory resilient fallback store.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error(`⚠️ MongoDB Atlas Notice: ${error.message}`);
    console.log('⚡ Active Dual-Engine Mode: Express running with in-memory resilient fallback store.');
  }
};

module.exports = connectDB;
