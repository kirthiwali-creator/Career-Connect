// ------------------------------------------------------------
// controllers/questionController.js
// Questions forum: ask, list, answer, delete.
// ------------------------------------------------------------
const Question = require("../models/Question");
const Connection = require("../models/Connection");
const asyncHandler = require("../middleware/asyncHandler");

// Helper: fill in student / mentor names instead of only ids
const populateQuestion = (query) =>
  query
    .populate("studentId", "name email profile")
    .populate("answeredBy", "name jobTitle company profile")
    .populate("mentorId", "name jobTitle company");

// @route  POST /api/questions     body: { question, category, mentorId? }
// @access Student
const askQuestion = asyncHandler(async (req, res) => {
  const { question, category, mentorId } = req.body;

  if (!question || !category) {
    return res.status(400).json({ message: "Question and category are required" });
  }

  // A question sent to a specific mentor is allowed only if they are connected
  if (mentorId) {
    const connected = await Connection.findOne({
      studentId: req.user._id,
      mentorId,
      status: "accepted",
    });
    if (!connected) {
      return res.status(403).json({
        message: "You can ask a mentor directly only after they accept your connection request",
      });
    }
  }

  const created = await Question.create({
    studentId: req.user._id,
    question,
    category,
    mentorId: mentorId || null,
  });

  const populated = await populateQuestion(Question.findById(created._id));
  res.status(201).json({ message: "Question posted successfully", question: populated });
});

// @route  GET /api/questions?category=AI&status=answered&search=resume
// @access Logged-in users (forum)
const getQuestions = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (status === "answered") filter.answer = { $ne: "" };
  if (status === "unanswered") filter.answer = "";
  if (search && search.trim()) {
    const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.question = new RegExp(safe, "i");
  }

  const questions = await populateQuestion(Question.find(filter)).sort({ createdAt: -1 });
  res.json(questions);
});

// @route  GET /api/questions/student/:studentId
// @access That student, or admin
const getStudentQuestions = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  if (req.user.role !== "admin" && req.user._id.toString() !== studentId) {
    return res.status(403).json({ message: "You can only view your own questions" });
  }
  const questions = await populateQuestion(Question.find({ studentId })).sort({ createdAt: -1 });
  res.json(questions);
});

// @route  GET /api/questions/:id
// @access Logged-in users
const getQuestionById = asyncHandler(async (req, res) => {
  const question = await populateQuestion(Question.findById(req.params.id));
  if (!question) return res.status(404).json({ message: "Question not found" });
  res.json(question);
});

// @route  PUT /api/questions/:id/answer     body: { answer }
// @access Mentor
const answerQuestion = asyncHandler(async (req, res) => {
  const { answer } = req.body;
  if (!answer || !answer.trim()) {
    return res.status(400).json({ message: "Answer cannot be empty" });
  }

  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const myId = req.user._id.toString();

  // Rule 1: a question asked to one mentor can be answered only by that mentor
  if (question.mentorId && question.mentorId.toString() !== myId) {
    return res
      .status(403)
      .json({ message: "This question was asked to another mentor" });
  }

  // Rule 2: once answered, only the same mentor can edit the answer
  if (question.answeredBy && question.answeredBy.toString() !== myId) {
    return res.status(400).json({ message: "This question is already answered by another mentor" });
  }

  question.answer = answer.trim();
  question.answeredBy = req.user._id;
  question.answeredAt = new Date();
  await question.save();

  const populated = await populateQuestion(Question.findById(question._id));
  res.json({ message: "Answer submitted successfully", question: populated });
});

// @route  DELETE /api/questions/:id
// @access The student who asked it, or admin
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const isOwner = question.studentId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "You can delete only your own questions" });
  }

  await question.deleteOne();
  res.json({ message: "Question deleted" });
});

// @route  GET /api/questions/categories
// @access Public - list of categories for dropdowns
const getCategories = (req, res) => {
  res.json(Question.CATEGORIES);
};

module.exports = {
  askQuestion,
  getQuestions,
  getStudentQuestions,
  getQuestionById,
  answerQuestion,
  deleteQuestion,
  getCategories,
};
