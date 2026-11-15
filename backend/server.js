// ------------------------------------------------------------
// server.js - starting point of the backend
// 1. Load .env variables
// 2. Connect to MongoDB
// 3. Set up Express, middleware and API routes
// 4. Start listening on PORT
// ------------------------------------------------------------
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config(); // reads backend/.env

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGO_URI or JWT_SECRET. Copy .env.example to .env first.");
  process.exit(1);
}

const app = express();

// ---------- Middleware ----------
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" })); // allow the React app
app.use(express.json()); // read JSON body from requests

// ---------- Health check ----------
app.get("/", (req, res) => {
  res.json({ message: "Career Connect API is running" });
});

// ---------- API routes ----------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/mentors", require("./routes/mentorRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));

// ---------- Error handling (always last) ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
