// routes/questionRoutes.js  ->  /api/questions
const express = require("express");
const {
  askQuestion,
  getQuestions,
  getStudentQuestions,
  getQuestionById,
  answerQuestion,
  deleteQuestion,
  getCategories,
} = require("../controllers/questionController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/categories", getCategories); // public, above "/:id"

router.use(protect); // everything below needs login

router.post("/", authorize("student"), askQuestion); // CREATE
router.get("/", getQuestions); // READ all (forum)
router.get("/student/:studentId", getStudentQuestions); // READ my questions
router.get("/:id", getQuestionById); // READ one
router.put("/:id/answer", authorize("mentor"), answerQuestion); // UPDATE with answer
router.delete("/:id", authorize("student", "admin"), deleteQuestion); // DELETE

module.exports = router;
