// ------------------------------------------------------------
// middleware/asyncHandler.js
// Wraps async controller functions so that any error is sent to
// our error handler automatically (no need for try/catch everywhere).
// ------------------------------------------------------------
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
