const express = require("express");
const { authAdmin , auth } = require("../middleware/auth");
const router = express.Router();
const { UserModel } = require("../models/userModel");
const {workspacesModel} = require("../models/workspacesModel")
const {cleanupTokens}= require('../controller/userController')
 const {getAllUsers,getSystemStats,deleteUser} = require('../controller/DashboardController')

router.get("/",auth,authAdmin, (req, res) => {
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

router.get('/usersstate',auth,authAdmin,getAllUsers)
router.get('/sysstate',auth,authAdmin,getSystemStats)
router.post('/cleanup-tokens', auth, authAdmin, cleanupTokens);
router.delete('/:id',auth,authAdmin,deleteUser)







module.exports = router;



