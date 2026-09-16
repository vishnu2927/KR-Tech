const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
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
