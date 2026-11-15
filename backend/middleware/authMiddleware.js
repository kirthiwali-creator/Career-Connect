// ------------------------------------------------------------
// middleware/authMiddleware.js
// protect   -> checks the JWT token and finds the logged-in user
// authorize -> allows only certain roles (e.g. only "mentor")
// ------------------------------------------------------------
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Runs before protected routes
const protect = async (req, res, next) => {
  try {
    // The frontend sends:  Authorization: Bearer <token>
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not logged in. Please login first." });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the id stored inside the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user; // now every controller can use req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired or invalid. Please login again." });
  }
};

// Usage: authorize("mentor")  or  authorize("admin", "mentor")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Access denied. Only ${roles.join(" / ")} can do this.` });
    }
    next();
  };
};

module.exports = { protect, authorize };
