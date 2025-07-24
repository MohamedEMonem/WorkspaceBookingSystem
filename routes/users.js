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
  logoutAllDevices,
  validateToken,
  getTokenStats,
  cleanupTokens,
  getCurrentUser,
} = require("../controller/userController");

// Public routes (no authentication required)
router.post("/login", loginUser);
router.post("/signup", createUser);

// Protected routes requiring authentication
// GET /users/me - Get current authenticated user info
router.get("/me", auth, getCurrentUser);

// Token management routes
// POST /users/logout - Log out current user (blacklist current token)
router.post("/logout", auth, logoutUser);

// POST /users/logout-all - Log out from all devices (self or admin for others)
router.post("/logout-all", auth, logoutAllDevices);
router.post("/logout-all/:id", auth, logoutAllDevices);

// GET /users/validate-token - Validate current token
router.get("/validate-token", auth, validateToken);

// Admin-only routes
// GET /users - Get all users (admin only)
router.get("/", auth, authAdmin, getAllUsers);

// GET /users/admin/token-stats - Get token blacklist statistics (admin only)
router.get("/admin/token-stats", auth, authAdmin, getTokenStats);

// POST /users/admin/cleanup-tokens - Clean up expired tokens (admin only)
router.post("/admin/cleanup-tokens", auth, authAdmin, cleanupTokens);

// User-specific routes (user can access own data, admin can access any)
// GET /users/:id - Get a single user by ID
router.get("/:id", auth, getUserById);

// PUT /users/:id - Update a user by ID
router.put("/:id", auth, updateUser);

// PATCH /users/:id - Partially update a user by ID
router.patch("/:id", auth, patchUser);

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", auth, deleteUser);

module.exports = router;
