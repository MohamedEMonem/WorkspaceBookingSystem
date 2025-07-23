// getAllUsers
// createUser
// getUserById
// updateUser
// patchUser
// deleteUser
import { ExpressAuth } from "@auth/express";
const express = require("express");
const auth = new ExpressAuth();
const mongoose = require("mongoose");
const app = express();

const getAllUsers = (req, res) => {
  // Logic to get all users
  mongoose.model("User").find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users" });
    }
    res.status(200).json(users);
  });
  res.status(200).json({ message: "Get all users" });
};

module.exports = {
  getAllUsers,
};
