const express = require("express");
const router = express.Router();
const {
  getAllWorkspaces,
  createWorkspaces,
  getWorkspacesById,
  updateWorkspaces,
  patchWorkspaces,
  deleteWorkspaces
} = require("../controller/workspaceController");

// GET /users - Get all users
router.get("/", getAllWorkspaces);

// POST /users - Create a new user
router.post("/", createWorkspaces);

// GET /users/:id - Get a single user by ID
router.get("/:id", getWorkspacesById);

// PUT /users/:id - Update a user by ID
router.put("/:id", updateWorkspaces);

// PATCH /users/:id - Partially update a user by ID
router.patch("/:id", patchWorkspaces);

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", deleteWorkspaces);

module.exports = router;