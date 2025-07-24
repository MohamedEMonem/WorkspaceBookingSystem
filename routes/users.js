const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middleware/auth");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../controller/userController");

// Public routes (no authentication required)
router.post("/login", loginUser);
router.post("/signup", createUser);

// Protected routes requiring authentication
// GET /users/me - Get current authenticated user info
router.get("/me", auth, getCurrentUser);

// Admin-only routes
// GET /users - Get all users (admin only)
router.get("/", auth, authAdmin, getAllUsers);

// User-specific routes (user can access own data, admin can access any)
// GET /users/:id - Get a single user by ID
router.get("/:id", auth, getUserById);

// PUT /users/:id - Update a user by ID
router.put("/:id", auth, updateUser);

// PATCH /users/:id - Partially update a user by ID
router.patch("/:id", auth, patchUser);

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", auth, deleteUser);

// POST /users/logout - Log out a user
router.post("/logout", auth, logoutUser);

module.exports = router;
