const { UserModel } = require("../models/userModel");
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

// No longer needed since we're using JWT middleware
const logoutUser = async (req, res) => {
  try {
    // With JWT, logout is handled client-side by removing the token
    // Optionally, you could implement a blacklist for tokens
    res.status(200).json({ 
      message: "User logged out successfully." 
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging out user", message: error.message });
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
  getCurrentUser,
};
