// routes/userRoutes.js  ->  /api/users
const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStats,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Every user route needs login
router.use(protect);

router.get("/admin/stats", authorize("admin"), getStats); // must be above "/:id"
router.get("/", authorize("admin"), getUsers); // READ all
router.get("/:id", getUserById); // READ one
router.put("/:id", updateUser); // UPDATE (own profile / admin)
router.delete("/:id", authorize("admin"), deleteUser); // DELETE

module.exports = router;
