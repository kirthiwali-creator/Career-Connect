// ------------------------------------------------------------
// config/db.js
// Connects our Node.js app to MongoDB using Mongoose.
// ------------------------------------------------------------
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop the server if the database is not available
  }
};

module.exports = connectDB;
