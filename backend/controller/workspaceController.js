const { workspacesModel } = require("../models/workspacesModel");
const mongoose = require("mongoose")
//GET
const getAllWorkspaces = async (req, res) => {
  try {
    const WorkspacesModels = await workspacesModel.find({});
    res.status(200).json({
      success: true,
      data: WorkspacesModels,
      message: "Workspaces fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error fetching WorkspacesModels",
      message: error.message 
    });
  }
};
const getWorkspacesById = async (req, res) => {
   const {id}= req.params
   // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid Workspace ID",
      message: "Invalid Workspace ID" 
    });
  }
  try {
    const WorkspacesModels = await workspacesModel.findById(id);
    if (!WorkspacesModels) {
      return res.status(404).json({
        success: false,
        error: "Workspace not found",
        message: "Workspace not found"
      });
    }
    res.status(200).json({
      success: true,
      data: WorkspacesModels,
      message: "Workspace fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error fetching WorkspacesModel",
      message: error.message 
    });
  }
};
//POST
const createWorkspaces = async (req, res) => {
    const newWorkspace =req.body
  try {
    const createdWorkspace = await workspacesModel.create(newWorkspace);
    res.status(201).json({ 
      success: true,
      data: createdWorkspace,
      message: "Workspace created successfully"
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message,
      message: error.message 
    });
  }
};


//PUT
const updateWorkspaces = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid Workspace ID",
      message: "Invalid Workspace ID" 
    });
  }

  try {
    const updatedWorkspace = await workspacesModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedWorkspace) {
      return res.status(404).json({ 
        success: false,
        error: "Workspace not found",
        message: "Workspace not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: updatedWorkspace,
      message: "Workspace updated successfully"
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message,
      message: error.message 
    });
  }
};

//PATCH
const patchWorkspaces = async (req, res) => {
  const { id } = req.params;
  const patchData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid Workspace ID",
      message: "Invalid Workspace ID" 
    });
  }

  try {
    const patchedWorkspace = await workspacesModel.findByIdAndUpdate(
      id,
      { $set: patchData },
      { new: true, runValidators: true }
    );

    if (!patchedWorkspace) {
      return res.status(404).json({ 
        success: false,
        error: "Workspace not found",
        message: "Workspace not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: patchedWorkspace,
      message: "Workspace patched successfully"
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message,
      message: error.message 
    });
  }
};
//DELETE
const deleteWorkspaces = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid Workspace ID",
      message: "Invalid Workspace ID" 
    });
  }

  try {
    const deletedWorkspace = await workspacesModel.findByIdAndDelete(id);

    if (!deletedWorkspace) {
      return res.status(404).json({ 
        success: false,
        error: "Workspace not found",
        message: "Workspace not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: deletedWorkspace,
      message: "Workspace deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error deleting Workspace",
      message: error.message 
    });
  }
};

// Custom GET for solutions logic
const getWorkspaceSolutions = async (req, res) => {
  try {
    const workspaces = await workspacesModel.find();

    // Prepare groups
    const privateWorkspace = [];
    const coworkingAccess = [];
    const additionalSolutions = [];

    workspaces.forEach(ws => {
      const { name, location, description, solution = {}, _id } = ws;
      // Group privateWorkspace
      if (solution.privateWorkspace && solution.privateWorkspace.length > 0) {
        solution.privateWorkspace.forEach(type => {
          privateWorkspace.push({
            workspaceId: _id,
            name,
            type,
            location,
            description
          });
        });
      }
      // Group coworkingAccess (if present in schema)
      if (solution.coworkingAccess && solution.coworkingAccess.length > 0) {
        solution.coworkingAccess.forEach(type => {
          coworkingAccess.push({
            workspaceId: _id,
            name,
            type,
            location,
            description
          });
        });
      }
      // Group additionalSolutions
      if (solution.additionalSolutions && solution.additionalSolutions.length > 0) {
        solution.additionalSolutions.forEach(type => {
          additionalSolutions.push({
            workspaceId: _id,
            name,
            type,
            location,
            description
          });
        });
      }
    });

    // Only include coworkingAccess if it is used
    const response = {
      privateWorkspace,
      additionalSolutions
    };
    if (coworkingAccess.length > 0) {
      response.coworkingAccess = coworkingAccess;
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllWorkspaces,
  createWorkspaces,
  getWorkspacesById,
  updateWorkspaces,
  patchWorkspaces,
  deleteWorkspaces,
  getWorkspaceSolutions
};