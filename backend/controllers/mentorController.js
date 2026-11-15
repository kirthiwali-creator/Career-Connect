// ------------------------------------------------------------
// controllers/mentorController.js
// Mentor directory: list, search, filter and view mentors.
// ------------------------------------------------------------
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// Escape special regex characters typed by the user (e.g. "C++")
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route  GET /api/mentors?search=react&skill=Java&minExp=5&domain=Cloud
// @access Public
const getMentors = asyncHandler(async (req, res) => {
  const { search, skill, minExp, domain } = req.query;
  const filter = { role: "mentor" };

  // SEARCH: name OR skill OR job role OR company contains the text
  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i"); // "i" = ignore case
    filter.$or = [{ name: regex }, { skills: regex }, { jobTitle: regex }, { company: regex }];
  }

  // FILTER by exact skill
  if (skill) {
    filter.skills = { $regex: new RegExp(`^${escapeRegex(skill)}$`, "i") };
  }

  // FILTER by minimum years of experience
  if (minExp) {
    filter.experience = { $gte: Number(minExp) };
  }

  // FILTER by domain
  if (domain) {
    filter.domain = domain;
  }

  const mentors = await User.find(filter).sort({ experience: -1 });
  res.json(mentors);
});

// @route  GET /api/mentors/filters
// @access Public - gives the list of skills & domains for filter dropdowns
const getFilterOptions = asyncHandler(async (req, res) => {
  const skills = await User.distinct("skills", { role: "mentor" });
  const domains = await User.distinct("domain", { role: "mentor" });
  res.json({
    skills: skills.filter(Boolean).sort(),
    domains: domains.filter(Boolean).sort(),
  });
});

// @route  GET /api/mentors/:id
// @access Public
const getMentorById = asyncHandler(async (req, res) => {
  const mentor = await User.findOne({ _id: req.params.id, role: "mentor" });
  if (!mentor) return res.status(404).json({ message: "Mentor not found" });
  res.json(mentor);
});

module.exports = { getMentors, getFilterOptions, getMentorById };
