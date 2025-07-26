const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Workspace name must be at least 3 characters"],
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  rating: {
    type: String,
    trim: true,
  },
  capacity: {
    type: Number,
  },
  description: {
    type: String,
    trim: true,
  },
  solution: {
    privateWorkspace: {
      type: [String],
      default: [],
    },
    additionalSolutions: {
      type: [String],
      default: [],
    },
  },
  phone: {
    type: String,
    minlength: [3, "Phone number must be at least 3 characters"],
    required: true,
    trim: true,
  },
  workinghours: {
    type: String,
    minlength: [3, "Working hours must be at least 3 characters"],
    required: true,
    trim: true,
  },
  workingdays: {
    type: String,
    minlength: [3, "Working days must be at least 3 characters"],
    required: true,
    trim: true,
  },
});

// Export the model
const workspacesModel = mongoose.model("Workspace", workspaceSchema);
module.exports = {workspacesModel};
