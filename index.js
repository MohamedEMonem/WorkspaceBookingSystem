//express
const express = require("express");
const app = express();

// Load environment variables
require("dotenv").config();

app.use(express.json());
const usersRoutes = require("./routes/users");
const workspacesRoutes = require("./routes/workspace");
const sloutionsRoutes = require("./routes/sloutions");
const bookingRoutes = require("./routes/booking");

//mongoose
const mongoose = require("mongoose");

// Use the users routes
app.use("/users", usersRoutes);
app.use("/workspaces", workspacesRoutes);
app.use("/sloutions", sloutionsRoutes);
app.use("/booking", bookingRoutes);
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connection to DB is Successfully");
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Connection to DB is Failed", error.message);
  });
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
