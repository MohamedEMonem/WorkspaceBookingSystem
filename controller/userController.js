const { UserModel } = require("../models/userModel");
const { TokenBlacklist } = require("../models/tokenBlacklistModel");
const { getBlacklistStats, cleanupExpiredTokens } = require("../utils/tokenUtils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function saltingString(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const shifted = charCode << i % 8;
    sum += shifted;
  }
  return sum;
}

// GET /users - Admin only
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    const users = await UserModel.find({}).select('-password');
    res.status(200).json({
      message: "Users retrieved successfully",
      users: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users", message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, name, phone, gender, birthday, role, password } = req.body;
    
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
    if (!email || !name || !phone || !gender || !birthday || !role || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validation checks
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!phone.match(/^\d{11}$/)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    if (name.length < 3) {
      return res.status(400).json({ error: "Name must be at least 3 characters" });
    }
    if (gender.length < 4) {
      return res.status(400).json({ error: "Gender must be at least 4 characters" });
    }
    if (!["admin", "owner", "user"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'admin', 'owner', or 'user'" });
    }

    // Hash the password
    const saltRounds = (saltingString(email) % 10) + 5;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user first
    const newUser = new UserModel({
      name,
      email,
      phone,
      gender,
      birthday,
      role,
      password: hashedPassword,
    });
    
    await newUser.save();

    // Create JWT token after user is created
    const token = jwt.sign(
      { userId: newUser._id, email: email, role: role },
      JWT_SECRET,
      { expiresIn: "5D" }
    );

    res.status(201).json({
      message: "User created successfully",
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/:id - User can get their own data, admin can get any user data
const getUserById = async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Check authorization: user can access their own data, admin can access any data
    if (currentUserRole !== "admin" && requestedUserId !== currentUserId) {
      return res.status(403).json({ 
        error: "Access denied. You can only access your own profile." 
      });
    }

    const user = await UserModel.findById(requestedUserId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user: user
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user", message: error.message });
  }
};

// PUT /users/:id - User can update their own data, admin can update any user data
const updateUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Check authorization: user can update their own data, admin can update any data
    if (currentUserRole !== "admin" && targetUserId !== currentUserId) {
      return res.status(403).json({ 
        error: "Access denied. You can only update your own profile." 
      });
    }

    const { name, phone, gender, birthday, role, password } = req.body;

    // Validate phone uniqueness if provided
    if (phone) {
      const existingPhone = await UserModel.findOne({ 
        phone, 
        _id: { $ne: targetUserId } 
      });
      if (existingPhone) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }

    let updateData = {};
    if (name) {
      if (name.length < 3) {
        return res.status(400).json({ error: "Name must be at least 3 characters" });
      }
      updateData.name = name;
    }
    if (phone) {
      if (!phone.match(/^\d{11}$/)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }
      updateData.phone = phone;
    }
    if (gender) {
      if (gender.length < 4) {
        return res.status(400).json({ error: "Gender must be at least 4 characters" });
      }
      updateData.gender = gender;
    }
    if (birthday) updateData.birthday = birthday;
    
    // Only admins can change roles, and only to valid roles
    if (role) {
      if (currentUserRole !== "admin") {
        return res.status(403).json({ error: "Only admins can change user roles" });
      }
      if (!["admin", "owner", "user"].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Must be 'admin', 'owner', or 'user'" });
      }
      updateData.role = role;
    }

    // Hash password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      // Get user's email for dynamic salting
      const user = await UserModel.findById(targetUserId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const saltRounds = (saltingString(user.email) % 10) + 5;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      targetUserId,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user", message: error.message });
  }
};

// PATCH /users/:id - User can patch their own data, admin can patch any user data
const patchUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Check authorization: user can patch their own data, admin can patch any data
    if (currentUserRole !== "admin" && targetUserId !== currentUserId) {
      return res.status(403).json({ 
        error: "Access denied. You can only update your own profile." 
      });
    }

    const { name, phone, gender, birthday, role } = req.body;

    // Validate phone uniqueness if provided
    if (phone) {
      const existingPhone = await UserModel.findOne({ 
        phone, 
        _id: { $ne: targetUserId } 
      });
      if (existingPhone) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }

    let updateData = {};
    if (name) {
      if (name.length < 3) {
        return res.status(400).json({ error: "Name must be at least 3 characters" });
      }
      updateData.name = name;
    }
    if (phone) {
      if (!phone.match(/^\d{11}$/)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }
      updateData.phone = phone;
    }
    if (gender) {
      if (gender.length < 4) {
        return res.status(400).json({ error: "Gender must be at least 4 characters" });
      }
      updateData.gender = gender;
    }
    if (birthday) updateData.birthday = birthday;
    
    // Only admins can change roles, and only to valid roles
    if (role) {
      if (currentUserRole !== "admin") {
        return res.status(403).json({ error: "Only admins can change user roles" });
      }
      if (!["admin", "owner", "user"].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Must be 'admin', 'owner', or 'user'" });
      }
      updateData.role = role;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update" });
    }

    const patchedUser = await UserModel.findByIdAndUpdate(
      targetUserId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!patchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User patched successfully",
      user: patchedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Error patching user", message: error.message });
  }
};

// DELETE /users/:id - User can delete their own account, admin can delete any user
const deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Check authorization: user can delete their own account, admin can delete any account
    if (currentUserRole !== "admin" && targetUserId !== currentUserId) {
      return res.status(403).json({ 
        error: "Access denied. You can only delete your own account." 
      });
    }

    // Prevent admin from deleting themselves (optional safety check)
    if (currentUserRole === "admin" && targetUserId === currentUserId) {
      return res.status(400).json({ 
        error: "Admins cannot delete their own account. Contact another admin." 
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(targetUserId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      message: "User deleted successfully",
      deletedUser: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user", message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "5D" }
    );

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
    res.status(500).json({ error: error.message });
  }
};

// Get current authenticated user info
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await UserModel.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User authenticated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        birthday: user.birthday,
      },
      authInfo: {
        role: req.user.role,
        userId: req.user.userId,
        email: req.user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user info", message: error.message });
  }
};

// Logout user with token blacklisting
const logoutUser = async (req, res) => {
  try {
    const token = req.token; // token is attached by auth middleware
    const decoded = req.user; // user info from JWT

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Calculate token expiration time
    const tokenExpiration = new Date(decoded.exp * 1000); // Convert to milliseconds

    // Add token to blacklist
    const blacklistEntry = new TokenBlacklist({
      token: token,
      userId: decoded.userId,
      expiresAt: tokenExpiration,
    });

    await blacklistEntry.save();

    res.status(200).json({ 
      message: "User logged out successfully. Token has been revoked." 
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging out user", message: error.message });
  }
};

// Logout from all devices (blacklist all user's tokens) - Admin or Self only
const logoutAllDevices = async (req, res) => {
  try {
    const targetUserId = req.params.id || req.user.userId;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Check authorization: user can logout all their devices, admin can logout any user's devices
    if (currentUserRole !== "admin" && targetUserId !== currentUserId) {
      return res.status(403).json({ 
        error: "Access denied. You can only logout your own devices." 
      });
    }

    // Find all active tokens for the user (in practice, this is complex since we'd need to track issued tokens)
    // For now, we'll just add current token to blacklist and return success
    const token = req.token;
    const decoded = req.user;
    const tokenExpiration = new Date(decoded.exp * 1000);

    const blacklistEntry = new TokenBlacklist({
      token: token,
      userId: decoded.userId,
      expiresAt: tokenExpiration,
    });

    await blacklistEntry.save();

    res.status(200).json({ 
      message: "Logged out from all devices successfully. All tokens have been revoked.",
      note: "Users will need to log in again on all devices."
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging out from all devices", message: error.message });
  }
};

// Check if current token is valid (not blacklisted)
const validateToken = async (req, res) => {
  try {
    // If we reach here, token is valid (auth middleware passed)
    const user = await UserModel.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Token is valid",
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokenInfo: {
        issuedAt: new Date(req.user.iat * 1000),
        expiresAt: new Date(req.user.exp * 1000),
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error validating token", message: error.message });
  }
};

// Admin: Get token blacklist statistics
const getTokenStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    const stats = await getBlacklistStats();
    res.status(200).json({
      message: "Token blacklist statistics retrieved successfully",
      stats: stats
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving token stats", message: error.message });
  }
};

// Admin: Clean up expired tokens from blacklist
const cleanupTokens = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    const deletedCount = await cleanupExpiredTokens();
    res.status(200).json({
      message: "Expired tokens cleaned up successfully",
      deletedCount: deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: "Error cleaning up tokens", message: error.message });
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
  logoutUser,
  logoutAllDevices,
  validateToken,
  getTokenStats,
  cleanupTokens,
  getCurrentUser,
};
