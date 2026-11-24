const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI not set in .env');
    return; // Don't crash — API will return 503 for DB-dependent routes
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS:         8000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('⚠️  MongoDB unavailable:', err.message);
    console.log('   Server will keep running — retrying DB connection in 10s…');
    // Retry every 10 seconds instead of crashing
    setTimeout(connectDB, 10_000);
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('⚠️  MongoDB disconnected — retrying…');
  setTimeout(connectDB, 5_000);
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('✅ MongoDB reconnected');
});

module.exports = connectDB;
