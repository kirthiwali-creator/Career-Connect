// ------------------------------------------------------------
// models/Connection.js
// Stores a connection request from a student to a mentor.
// status: "pending" -> "accepted" or "rejected"
// ------------------------------------------------------------
const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // lets us use .populate() to get student details
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: { type: String, default: "" }, // optional note from the student
  },
  { timestamps: true } // createdAt / updatedAt
);

// One student can have only ONE connection document per mentor.
// This blocks duplicate requests at the database level too.
connectionSchema.index({ studentId: 1, mentorId: 1 }, { unique: true });

module.exports = mongoose.model("Connection", connectionSchema);
