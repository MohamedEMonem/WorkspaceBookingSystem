const express = require("express");
const router = express.Router();
// const {
//   getAllWorkspace,
//   createWorkspace,
//   getWorkspaceById,
//   updateWorkspace,
//   patchWorkspace,
//   deleteWorkspace
// } = require("../controller/workspaceController");

// GET /users - Get all users
router.get("/", getAllWorkspace);

// POST /users - Create a new user
router.post("/", createWorkspace);

// GET /users/:id - Get a single user by ID
router.get("/:id", getWorkspaceById);

// PUT /users/:id - Update a user by ID
router.put("/:id", updateWorkspace);

// PATCH /users/:id - Partially update a user by ID
router.patch("/:id", patchWorkspace);

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", deleteWorkspace);

module.exports = router;