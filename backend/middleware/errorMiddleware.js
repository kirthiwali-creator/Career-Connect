// ------------------------------------------------------------
// middleware/errorMiddleware.js
// Sends clean, user-friendly error messages to the frontend.
// ------------------------------------------------------------

// 404 for unknown API routes
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Handles every error passed with next(error) or thrown inside async handlers
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Server error";

  // Mongoose validation error (e.g. required field missing)
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Invalid MongoDB id (e.g. /api/users/abc)
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid id";
  }

  // Duplicate key (e.g. same email registered twice)
  if (err.code === 11000) {
    status = 400;
    message = "Duplicate entry. This record already exists.";
  }

  if (status === 500) console.error(err);
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
