// ------------------------------------------------------------
// controllers/userController.js
// CRUD operations on users (Read, Update, Delete).
// Create is done by /api/auth/register.
// ------------------------------------------------------------
const User = require("../models/User");
const Connection = require("../models/Connection");
const Question = require("../models/Question");
const asyncHandler = require("../middleware/asyncHandler");

// @route  GET /api/users?role=student
// @access Admin
const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json(users);
});

// @route  GET /api/users/:id
// @access Logged-in users
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// @route  PUT /api/users/:id
// @access The user himself/herself, or admin
const updateUser = asyncHandler(async (req, res) => {
  const isOwner = req.user._id.toString() === req.params.id;
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "You can only edit your own profile" });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Only these fields can be changed from the profile page.
  // (email, password and role are NOT editable here - for safety)
  const allowed = [
    "name",
    "profile",
    "bio",
    "education",
    "skills",
    "phone",
    "jobTitle",
    "company",
    "experience",
    "domain",
    "careerJourney",
    "areasOfGuidance",
  ];

  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      let value = req.body[field];
      // Accept "React, Node.js" as well as ["React", "Node.js"]
      if ((field === "skills" || field === "areasOfGuidance") && typeof value === "string") {
        value = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (field === "experience") value = Number(value) || 0;
      updates[field] = value;
    }
  });

  if (updates.name !== undefined && !String(updates.name).trim()) {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  // { new: true } returns the updated document
  const updated = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  res.json({ message: "Profile updated successfully", user: updated });
});

// @route  DELETE /api/users/:id
// @access Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "admin") {
    return res.status(400).json({ message: "Admin account cannot be deleted" });
  }

  // Also remove everything linked to this user
  await Connection.deleteMany({ $or: [{ studentId: user._id }, { mentorId: user._id }] });
  await Question.deleteMany({ studentId: user._id });
  // Questions this mentor answered/was asked become open again
  await Question.updateMany(
    { answeredBy: user._id },
    { answer: "", answeredBy: null, answeredAt: null }
  );
  await Question.updateMany({ mentorId: user._id }, { mentorId: null });

  await user.deleteOne();
  res.json({ message: `User "${user.name}" deleted successfully` });
});

// @route  GET /api/users/admin/stats
// @access Admin - numbers shown on the admin dashboard
const getStats = asyncHandler(async (req, res) => {
  const [students, mentors, totalConnections, pending, accepted, questions, answered] =
    await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "mentor" }),
      Connection.countDocuments(),
      Connection.countDocuments({ status: "pending" }),
      Connection.countDocuments({ status: "accepted" }),
      Question.countDocuments(),
      Question.countDocuments({ answer: { $ne: "" } }),
    ]);

  res.json({ students, mentors, totalConnections, pending, accepted, questions, answered });
});

module.exports = { getUsers, getUserById, updateUser, deleteUser, getStats };
