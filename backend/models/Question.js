// ------------------------------------------------------------
// models/Question.js
// A career question asked by a student.
// - If mentorId is empty, the question is OPEN: any mentor can answer.
// - If mentorId is set, the question was asked to ONE connected mentor,
//   and only that mentor can answer it.
// ------------------------------------------------------------
const mongoose = require("mongoose");

const CATEGORIES = [
  "Programming",
  "Placement",
  "Career",
  "Resume",
  "Interview",
  "Higher Studies",
  "Cyber Security",
  "Cloud",
  "AI",
];

const questionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      minlength: [10, "Question should be at least 10 characters"],
    },
    category: {
      type: String,
      enum: { values: CATEGORIES, message: "Invalid category" },
      required: [true, "Category is required"],
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = open question for all mentors
    },
    answer: { type: String, default: "" },
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    answeredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
module.exports.CATEGORIES = CATEGORIES;
