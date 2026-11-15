// routes/connectionRoutes.js  ->  /api/connections
const express = require("express");
const {
  sendRequest,
  getStudentConnections,
  getMentorConnections,
  updateStatus,
  getAllConnections,
  deleteConnection,
} = require("../controllers/connectionController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // all connection routes need login

router.post("/", authorize("student"), sendRequest); // student sends request
router.get("/", authorize("admin"), getAllConnections); // admin sees all
router.get("/student/:studentId", getStudentConnections); // student's requests
router.get("/mentor/:mentorId", getMentorConnections); // mentor's requests
router.put("/:id", authorize("mentor"), updateStatus); // mentor accepts / rejects
router.delete("/:id", authorize("student", "admin"), deleteConnection); // cancel / remove

module.exports = router;
