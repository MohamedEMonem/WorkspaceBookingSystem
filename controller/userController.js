/** @type {import("mongoose").Model<any>} */
const UserModel = require("../models/userModel");
const express = require("express");
const app = express();
/** @type {import("mongoose").Model<any>} */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const createUser = async (req, res) => {
  try {
    const { email,name,phone,gender,birthday,role,password } = req.body;
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Check if phone number already exists
    const existingPhone = await UserModel.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: "Phone number already exists" });
    }
    // Validate required fields
    if (
      !email ||
      !name ||
      !phone ||
      !gender ||
      !birthday ||
      !role ||
      !password
    ) {
      return res.status(400).json({ error: "All fields are required" });
    } else if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) === null) {
      return res.status(400).json({ error: "Invalid email format" });
    } else if (phone.match(/^\d{11}$/) === null) {
      return res.status(400).json({ error: "Invalid phone number format" });
    } else if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    } else if (name.length < 3) {
      return res
        .status(400)
        .json({ error: "Name must be at least 3 characters" });
    } else if (phone.length < 11) {
      return res
        .status(400)
        .json({ error: "Phone must be at least 11 characters" });
    } else if (gender.length < 4) {
      return res
        .status(400)
        .json({ error: "Gender must be at least 4 characters" });
    } else if ((role === "admin" && role !== "owner") || role !== "user") {
      return res
        .status(400)
        .json({ error: "Role must be either 'admin', 'owner', or 'user'" });
    } else {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create JWT token using email + timestamp as secret
      const token = jwt.sign({ email: email, role: role }, email + Date.now(), {
        expiresIn: "5D",
      });

      const newUser = new UserModel({
        name,
        email,
        phone,
        gender,
        birthday, // Store birthday as string (e.g., "01-01-2001")
        role, // Use 'role' directly, not nested under authorization
        password: hashedPassword, // Use 'password' field, not 'hashedPassword'
        token,
      });

      await newUser.save();
      res.status(201).json({
        message: "User created successfully",
        token: token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role, // Access role directly
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    // Logic to get user by ID
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

const updateUser = async (req, res) => {
  try {
    // Logic to update user
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const patchUser = async (req, res) => {
  try {
    // Logic to partially update user
    res.status(200).json({ message: "User patched successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Logic to delete user
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    };

    // Find user by email
    console.log("Looking for user with email:", email);
    const user = await UserModel.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token using email + timestamp as secret
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      email + Date.now(),
      { expiresIn: "5D" }
    );
    await UserModel.updateOne({ _id: user._id }, { $set: { token: token } });
    res.status(200).json({
      message: "User logged in successfully",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
  loginUser,
};
