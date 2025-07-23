const workspacesModel = require("../models/workspacesModel");

// GET /sloutions/:subsolution - Return all workspaces that offer the given subsolution, grouped by solution type
const getWorkspacesBySubsolution = async (req, res) => {
  try {
    const { subsolution } = req.params;
    if (!subsolution) {
      return res.status(400).json({ error: "Subsolution is required" });
    }

    const workspaces = await workspacesModel.find();
    const result = {
      privateWorkspace: [],
      additionalSolutions: [],
      coworkingAccess: []
    };

    workspaces.forEach(ws => {
      const { name, location, description, solution = {}, _id } = ws;
      // Check privateWorkspace
      if (solution.privateWorkspace && solution.privateWorkspace.includes(subsolution)) {
        result.privateWorkspace.push({
          workspaceId: _id,
          name,
          type: subsolution,
          location,
          description
        });
      }
      // Check additionalSolutions
      if (solution.additionalSolutions && solution.additionalSolutions.includes(subsolution)) {
        result.additionalSolutions.push({
          workspaceId: _id,
          name,
          type: subsolution,
          location,
          description
        });
      }
      // Check coworkingAccess (if present)
      if (solution.coworkingAccess && solution.coworkingAccess.includes(subsolution)) {
        result.coworkingAccess.push({
          workspaceId: _id,
          name,
          type: subsolution,
          location,
          description
        });
      }
    });

    // Remove empty groups
    Object.keys(result).forEach(key => {
      if (result[key].length === 0) {
        delete result[key];
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /sloutions/structure - Return all solution types and their subsolutions
const getAllSolutionsStructure = async (req, res) => {
  try {
    const workspaces = await workspacesModel.find();
    const structure = {
      privateWorkspace: new Set(),
      additionalSolutions: new Set(),
      coworkingAccess: new Set()
    };

    workspaces.forEach(ws => {
      const solution = ws.solution || {};
      if (solution.privateWorkspace && Array.isArray(solution.privateWorkspace)) {
        solution.privateWorkspace.forEach(sub => structure.privateWorkspace.add(sub));
      }
      if (solution.additionalSolutions && Array.isArray(solution.additionalSolutions)) {
        solution.additionalSolutions.forEach(sub => structure.additionalSolutions.add(sub));
      }
      if (solution.coworkingAccess && Array.isArray(solution.coworkingAccess)) {
        solution.coworkingAccess.forEach(sub => structure.coworkingAccess.add(sub));
      }
    });

    // Convert sets to arrays and remove empty groups
    const result = {};
    Object.keys(structure).forEach(key => {
      const arr = Array.from(structure[key]);
      if (arr.length > 0) {
        result[key] = arr;
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getWorkspacesBySubsolution,
  getAllSolutionsStructure
}; 