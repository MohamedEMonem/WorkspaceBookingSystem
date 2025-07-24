//express
const express = require("express");
const app = express();
app.use(express.json());
const usersRoutes = require("./routes/users");
const workspacesRoutes = require("./routes/workspace");
const sloutionsRoutes = require("./routes/sloutions");

//mongoose
const mongoose = require("mongoose");

// Use the users routes
app.use("/users", usersRoutes);
app.use("/workspaces", workspacesRoutes);
app.use("/sloutions", sloutionsRoutes);

mongoose
  .connect(
    process.env.MONGODB_URI,
  )
  .then(() => {
    console.log("Connection to DB is Successfully");
  })
  .catch(() => {
    console.log("Connection to DB is Failed");
  });
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
