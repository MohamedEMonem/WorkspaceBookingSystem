const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
  loginUser,
  logoutUser
} = require("../controller/userController");

// GET /users - Get all users
router.get("/", getAllUsers);

// POST /users/login - Log in a user
router.post("/login", loginUser);

// POST /users/logout - Log out a user
router.post("/logout", logoutUser);

// POST /users/signup - Create a new user
router.post("/signup", createUser);

// GET /users/:id - Get a single user by ID
router.get("/:id", getUserById);

// PUT /users/:id - Update a user by ID
router.put("/:id", updateUser);

// PATCH /users/:id - Partially update a user by ID
router.patch("/:id", patchUser);

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", deleteUser);

module.exports = router;