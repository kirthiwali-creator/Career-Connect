// routes/mentorRoutes.js  ->  /api/mentors
const express = require("express");
const {
  getMentors,
  getFilterOptions,
  getMentorById,
} = require("../controllers/mentorController");

const router = express.Router();

// Public routes - anyone can browse mentors
router.get("/", getMentors); // list + search + filter
router.get("/filters", getFilterOptions); // skills & domains for dropdowns (above "/:id")
router.get("/:id", getMentorById); // single mentor profile

module.exports = router;
