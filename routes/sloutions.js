const express = require("express");
const router = express.Router();
const { getWorkspacesBySubsolution, getAllSolutionsStructure } = require("../controller/solutionsController");

// GET /sloutions/structure - Return all solution types and their subsolutions
router.get("/structure", getAllSolutionsStructure);

// GET /sloutions/:subsolution - Return all workspaces that offer the given subsolution
router.get("/:subsolution", getWorkspacesBySubsolution);

module.exports = router;
