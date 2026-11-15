// ------------------------------------------------------------
// controllers/authController.js
// Register and Login logic.
// ------------------------------------------------------------
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// Helper: create a JWT token that stores the user's id and role
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper: remove the password before sending user data
const safeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// @route  POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password and role are required" });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  // Admin accounts cannot be created from the register page
  if (!["student", "mentor"].includes(role)) {
    return res.status(400).json({ message: "Role must be student or mentor" });
  }

  // 2. Prevent duplicate email
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "This email is already registered. Please login." });
  }

  // 3. Hash the password with bcrypt (never store plain passwords)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Save the user in MongoDB
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // 5. Send back the token + user so the user is logged in immediately
  res.status(201).json({
    message: "Registration successful",
    token: generateToken(user),
    user: safeUser(user),
  });
});

// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // password has select:false in the model, so we ask for it explicitly
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Compare the typed password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    token: generateToken(user),
    user: safeUser(user),
  });
});

// @route  GET /api/auth/me
// @access Private (any logged-in user)
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, getMe };
