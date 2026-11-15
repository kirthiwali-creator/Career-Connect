// ------------------------------------------------------------
// models/User.js
// One collection stores ALL users. The "role" field tells us
// whether the user is a student, a mentor or an admin.
// Mentor-only fields (company, jobTitle, experience...) are
// simply left empty for students.
// ------------------------------------------------------------
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // MongoDB will not allow two users with the same email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never send the password back in normal queries
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },

    // ---------- Profile fields ----------
    profile: { type: String, default: "" }, // profile picture URL (optional)
    bio: { type: String, default: "" }, // short "About me"
    education: { type: String, default: "" }, // e.g. "BCA, KLE College Hubli"
    skills: { type: [String], default: [] }, // e.g. ["React", "Node.js"]
    phone: { type: String, default: "" },

    // ---------- Mentor-only fields ----------
    jobTitle: { type: String, default: "" }, // e.g. "Senior Software Engineer"
    company: { type: String, default: "" }, // e.g. "Infosys"
    experience: { type: Number, default: 0 }, // years of experience
    domain: { type: String, default: "" }, // e.g. "Web Development"
    careerJourney: { type: String, default: "" }, // story of their career
    areasOfGuidance: { type: [String], default: [] }, // e.g. ["Resume review"]
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
