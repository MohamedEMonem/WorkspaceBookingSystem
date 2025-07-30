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

// GET /workspaces - Get all workspaces
router.get("/", getAllWorkspaces);

// POST /workspaces - Create a new workspace
router.post("/", createWorkspaces);

// GET /workspaces/:id - Get a single workspace by ID
router.get("/:id", getWorkspacesById);

// PUT /workspaces/:id - Update a workspace by ID
router.put("/:id", updateWorkspaces);

// PATCH /workspaces/:id - Partially update a workspace by ID
router.patch("/:id", patchWorkspaces);

// DELETE /workspaces/:id - Delete a workspace by ID
router.delete("/:id", deleteWorkspaces);

module.exports = router;