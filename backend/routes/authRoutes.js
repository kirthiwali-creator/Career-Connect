// routes/authRoutes.js  ->  /api/auth
const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register); // create account
router.post("/login", login); // get JWT token
router.get("/me", protect, getMe); // who is logged in?

module.exports = router;
