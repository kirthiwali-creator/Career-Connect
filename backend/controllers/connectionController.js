// ------------------------------------------------------------
// controllers/connectionController.js
// Student -> sends request (pending)
// Mentor  -> accepts or rejects it
// ------------------------------------------------------------
const Connection = require("../models/Connection");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// Fields we want to show when we "populate" a user
const MENTOR_FIELDS = "name email jobTitle company experience skills domain profile";
const STUDENT_FIELDS = "name email education skills bio profile";

// @route  POST /api/connections       body: { mentorId, message }
// @access Student
const sendRequest = asyncHandler(async (req, res) => {
  const { mentorId, message } = req.body;
  if (!mentorId) return res.status(400).json({ message: "mentorId is required" });

  // Check that the mentor really exists
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) return res.status(404).json({ message: "Mentor not found" });

  // Prevent duplicate requests
  const existing = await Connection.findOne({ studentId: req.user._id, mentorId });
  if (existing) {
    if (existing.status === "pending") {
      return res.status(400).json({ message: "Request already sent. Waiting for mentor's response." });
    }
    if (existing.status === "accepted") {
      return res.status(400).json({ message: "You are already connected with this mentor." });
    }
    // If it was rejected earlier, the student may try again
    existing.status = "pending";
    existing.message = message || "";
    await existing.save();
    return res.json({ message: "Connection request sent again", connection: existing });
  }

  const connection = await Connection.create({
    studentId: req.user._id,
    mentorId,
    message: message || "",
  });

  res.status(201).json({ message: `Connection request sent to ${mentor.name}`, connection });
});

// @route  GET /api/connections/student/:studentId
// @access That student, or admin
const getStudentConnections = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  if (req.user.role !== "admin" && req.user._id.toString() !== studentId) {
    return res.status(403).json({ message: "You can only view your own connections" });
  }

  const connections = await Connection.find({ studentId })
    .populate("mentorId", MENTOR_FIELDS)
    .sort({ updatedAt: -1 });
  res.json(connections);
});

// @route  GET /api/connections/mentor/:mentorId
// @access That mentor, or admin
const getMentorConnections = asyncHandler(async (req, res) => {
  const { mentorId } = req.params;
  if (req.user.role !== "admin" && req.user._id.toString() !== mentorId) {
    return res.status(403).json({ message: "You can only view your own requests" });
  }

  const connections = await Connection.find({ mentorId })
    .populate("studentId", STUDENT_FIELDS)
    .sort({ updatedAt: -1 });
  res.json(connections);
});

// @route  PUT /api/connections/:id      body: { status: "accepted" | "rejected" }
// @access Mentor (only the mentor who received the request)
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be accepted or rejected" });
  }

  const connection = await Connection.findById(req.params.id);
  if (!connection) return res.status(404).json({ message: "Request not found" });

  if (connection.mentorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "This request was not sent to you" });
  }

  connection.status = status;
  await connection.save();
  await connection.populate("studentId", STUDENT_FIELDS);

  res.json({ message: `Request ${status}`, connection });
});

// @route  GET /api/connections
// @access Admin - all connection requests on the platform
const getAllConnections = asyncHandler(async (req, res) => {
  const connections = await Connection.find()
    .populate("studentId", "name email")
    .populate("mentorId", "name email company")
    .sort({ createdAt: -1 });
  res.json(connections);
});

// @route  DELETE /api/connections/:id
// @access Admin, or the student who sent it (to cancel)
const deleteConnection = asyncHandler(async (req, res) => {
  const connection = await Connection.findById(req.params.id);
  if (!connection) return res.status(404).json({ message: "Connection not found" });

  const isOwner = connection.studentId.toString() === req.user._id.toString();
  if (req.user.role !== "admin" && !isOwner) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await connection.deleteOne();
  res.json({ message: "Connection removed" });
});

module.exports = {
  sendRequest,
  getStudentConnections,
  getMentorConnections,
  updateStatus,
  getAllConnections,
  deleteConnection,
};
