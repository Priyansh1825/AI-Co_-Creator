const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    // Instead of crashing, we just print a warning and let the server keep running!
    console.warn('⚠️ MongoDB connection failed. Running in "API-Only" fallback mode.');
  }
};

module.exports = connectDB;