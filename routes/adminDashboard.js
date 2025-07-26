const express = require("express");
const { authAdmin } = require("../middleware/auth");
const router = express.Router();
const { UserModel } = require("../models/userModel");
const {workspacesModel} = require("../models/workspacesModel")

router.get("/",authAdmin, (req, res) => {
  Promise.all([
    UserModel.countDocuments({}),
    workspacesModel.countDocuments({})

    
  ])
  .then(([ totalUsers , totalWorkspaces]) => {
    res.status(200).json({ totalUsers, totalWorkspaces });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  });
});




module.exports = router;



