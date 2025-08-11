const { UserModel } = require("../models/userModel");
const { TokenBlacklist } = require("../models/tokenBlacklistModel");
const {
  getBlacklistStats,
  cleanupExpiredTokens,
} = require("../utils/tokenUtils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { date } = require("joi");

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


const createUser = async (req, res) => {
  try {
    const { email, name, phone, gender, birthday, role, password, adminKey, imgUrl } =
      req.body;

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
    }

    // Validation checks
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!phone.match(/^\d{11}$/)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    if (name.length < 3) {
      return res
        .status(400)
        .json({ error: "Name must be at least 3 characters" });
    }
    if (gender.length < 4) {
      return res
        .status(400)
        .json({ error: "Gender must be at least 4 characters" });
    }
    if (!["admin", "owner", "user"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Role must be 'admin', 'owner', or 'user'" });
    }

    // Admin role protection: require ADMIN_KEY
    if (role === "admin") {
      if (!adminKey) {
        return res.status(400).json({
          error: "Admin key is required to create admin accounts",
        });
      }
      if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({
          error: "Invalid admin key. Access denied.",
        });
      }
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

    // Authorization is handled by authUserAccess middleware
    const user = await UserModel.findById(requestedUserId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching user", message: error.message });
  }
};

// PUT /users/:id - User can update their own data, admin/owner can update any user data
const updateUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserRole = req.user.role;

    // Authorization is handled by authUserModify middleware
    const { name, phone, gender, birthday, role, password, adminKey } =
      req.body;

    // Validate phone uniqueness if provided
    if (phone) {
      const existingPhone = await UserModel.findOne({
        phone,
        _id: { $ne: targetUserId },
      });
      if (existingPhone) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }

    let updateData = {};
    if (name) {
      if (name.length < 3) {
        return res
          .status(400)
          .json({ error: "Name must be at least 3 characters" });
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
        return res
          .status(400)
          .json({ error: "Gender must be at least 4 characters" });
      }
      updateData.gender = gender;
    }
    if (birthday) updateData.birthday = birthday;

    // Only admins and owners can change roles, and only to valid roles
    if (role) {
      if (!["admin", "owner"].includes(currentUserRole)) {
        return res
          .status(403)
          .json({ error: "Only admins and owners can change user roles" });
      }
      if (!["admin", "owner", "user"].includes(role)) {
        return res
          .status(400)
          .json({ error: "Invalid role. Must be 'admin', 'owner', or 'user'" });
      }

      // Admin role protection: require ADMIN_KEY when promoting to admin
      if (role === "admin") {
        if (!adminKey) {
          return res.status(400).json({
            error: "Admin key is required to assign admin role",
          });
        }
        if (adminKey !== process.env.ADMIN_KEY) {
          return res.status(403).json({
            error: "Invalid admin key. Access denied.",
          });
        }
      }

      updateData.role = role;
    }

    // Hash password if provided
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
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
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating user", message: error.message });
  }
};

// PATCH /users/:id - User can patch their own data, admin/owner can patch any user data
const patchUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserRole = req.user.role;

    // Authorization is handled by authUserModify middleware
    const { name, phone, gender, birthday, role, adminKey } = req.body;

    // Validate phone uniqueness if provided
    if (phone) {
      const existingPhone = await UserModel.findOne({
        phone,
        _id: { $ne: targetUserId },
      });
      if (existingPhone) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }

    let updateData = {};
    if (name) {
      if (name.length < 3) {
        return res
          .status(400)
          .json({ error: "Name must be at least 3 characters" });
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
        return res
          .status(400)
          .json({ error: "Gender must be at least 4 characters" });
      }
      updateData.gender = gender;
    }
    if (birthday) updateData.birthday = birthday;

    // Only admins and owners can change roles, and only to valid roles
    if (role) {
      if (!["admin", "owner"].includes(currentUserRole)) {
        return res
          .status(403)
          .json({ error: "Only admins and owners can change user roles" });
      }
      if (!["admin", "owner", "user"].includes(role)) {
        return res
          .status(400)
          .json({ error: "Invalid role. Must be 'admin', 'owner', or 'user'" });
      }

      // Admin role protection: require ADMIN_KEY when promoting to admin
      if (role === "admin") {
        if (!adminKey) {
          return res.status(400).json({
            error: "Admin key is required to assign admin role",
          });
        }
        if (adminKey !== process.env.ADMIN_KEY) {
          return res.status(403).json({
            error: "Invalid admin key. Access denied.",
          });
        }
      }

      updateData.role = role;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update" });
    }

    const patchedUser = await UserModel.findByIdAndUpdate(
      targetUserId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!patchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User patched successfully",
      user: patchedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error patching user", message: error.message });
  }
};

// DELETE /users/:id - User can delete their own account, admin/owner can delete any user
const deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Authorization is handled by authUserModify middleware

    // Prevent users with high privileges from deleting themselves (safety check)
    if (["admin", "owner"].includes(currentUserRole) && targetUserId === currentUserId) {
      return res.status(400).json({
        error: "Admins and owners cannot delete their own account. Contact another admin.",
      });
    }
    else if (currentUserId === targetUserId && currentUserRole === "user") {
      const deletedUser = await UserModel.findByIdAndDelete(targetUserId);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }


      res.status(200).json({
        message: "User deleted successfully",
        deletedUser: {
          id: deletedUser._id,
          name: deletedUser.name,
          email: deletedUser.email,
        },
      });
    }
    else {
      res.status(403).json({ error: "You do not have permission to delete this user" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting user", message: error.message });
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
      data: {
      message: "User logged in successfully",
      token: token,
      user : {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        birthday: user.birthday,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        history: user.history || [],

      },
    }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current authenticated user info
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await UserModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User authenticated successfully",
   user
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching user info", message: error.message });
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
      message: "User logged out successfully. Token has been revoked.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error logging out user", message: error.message });
  }
};

// Logout from all devices (blacklist all user's tokens) - Admin or Self only
const logoutAllDevices = async (req, res) => {
  try {
    const targetUserId = req.params.id || req.user.userId;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // If there's an ID parameter, admin middleware already verified admin role
    // If no ID parameter, user is logging out their own devices
    if (!req.params.id && targetUserId !== currentUserId) {
      return res.status(403).json({
        error: "Access denied. You can only logout your own devices.",
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

    const message = req.params.id
      ? `Logged out user ${targetUserId} from all devices successfully.`
      : "Logged out from all devices successfully. All tokens have been revoked.";

    res.status(200).json({
      message: message,
      note: "User will need to log in again on all devices.",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error logging out from all devices",
        message: error.message,
      });
  }
};

// Admin: Get token blacklist statistics
const getTokenStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    const stats = await getBlacklistStats();
    res.status(200).json({
      message: "Token blacklist statistics retrieved successfully",
      stats: stats,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving token stats", message: error.message });
  }
};

// Admin: Clean up expired tokens from blacklist
const cleanupTokens = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    const deletedCount = await cleanupExpiredTokens();
    res.status(200).json({
      message: "Expired tokens cleaned up successfully",
      deletedCount: deletedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error cleaning up tokens", message: error.message });
  }
};

const adminInvite = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    const { email, expiresIn = "24h", role = "user" } = req.body;

    // Validate email if provided
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate role
    if (!["admin", "owner", "user"].includes(role)) {
      return res.status(400).json({
        error: "Invalid role. Must be 'admin', 'owner', or 'user'"
      });
    }

    // Check if admin key is required for admin role
    if (role === "admin" && !req.body.adminKey) {
      return res.status(400).json({
        error: "Admin key is required to create admin invites"
      });
    }

    if (role === "admin" && req.body.adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({
        error: "Invalid admin key. Access denied."
      });
    }

    // Generate invite token with specific payload
    const invitePayload = {
      type: "invite",
      invitedBy: req.user.userId,
      inviterRole: req.user.role,
      targetRole: role,
      email: email || null,
      createdAt: new Date(),
    };

    const inviteToken = jwt.sign(invitePayload, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    // Create invite URL (you can customize this based on your frontend)
    const inviteUrl = `${req.protocol}://${req.get('host')}/invite?token=${inviteToken}`;

    res.status(200).json({
      message: "Admin invite created successfully",
      invite: {
        token: inviteToken,
        url: inviteUrl,
        expiresIn: expiresIn,
        targetRole: role,
        email: email || "No specific email",
        createdBy: req.user.email,
      },
      instructions: email
        ? `Invite sent for ${email}. Share the token or URL with the recipient.`
        : "General invite created. Share the token or URL with the intended recipient."
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating admin invite", message: error.message });
  }
};

// Admin: Get system statistics

// Admin: Verify invite token
const verifyInvite = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Invite token is required" });
    }

    // Verify and decode the invite token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an invite token
    if (decoded.type !== "invite") {
      return res.status(400).json({ error: "Invalid invite token" });
    }

    res.status(200).json({
      message: "Invite token is valid",
      invite: {
        targetRole: decoded.targetRole,
        email: decoded.email,
        invitedBy: decoded.inviterRole,
        createdAt: decoded.createdAt,
        expiresAt: new Date(decoded.exp * 1000)
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Invite token has expired" });
    }
    res.status(400).json({ error: "Invalid invite token" });
  }
};

// Admin: Sign up with invite token
const signupWithInvite = async (req, res) => {
  try {
    const {
      token,
      name,
      email,
      phone,
      gender,
      birthday,
      password
    } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Invite token is required" });
    }

    // Verify and decode the invite token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Invite token has expired" });
      }
      return res.status(400).json({ error: "Invalid invite token" });
    }

    // Check if it's an invite token
    if (decoded.type !== "invite") {
      return res.status(400).json({ error: "Invalid invite token" });
    }

    // If invite was for specific email, validate it matches
    if (decoded.email && decoded.email !== email) {
      return res.status(400).json({
        error: "Email does not match the invited email address"
      });
    }

    // Validate required fields
    if (!email || !name || !phone || !gender || !birthday || !password) {
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
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    if (name.length < 3) {
      return res
        .status(400)
        .json({ error: "Name must be at least 3 characters" });
    }
    if (gender.length < 4) {
      return res
        .status(400)
        .json({ error: "Gender must be at least 4 characters" });
    }

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

    // Hash the password
    const saltRounds = (saltingString(email) % 10) + 5;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with role from invite
    const newUser = new UserModel({
      name,
      email,
      phone,
      gender,
      birthday,
      role: decoded.targetRole,
      password: hashedPassword,
    });

    await newUser.save();

    // Create JWT token
    const userToken = jwt.sign(
      { userId: newUser._id, email: email, role: decoded.targetRole },
      JWT_SECRET,
      { expiresIn: "5D" }
    );

    res.status(201).json({
      message: `User created successfully with ${decoded.targetRole} role via invite`,
      token: userToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      inviteInfo: {
        invitedBy: decoded.inviterRole,
        originalTargetRole: decoded.targetRole
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // getAllUsers,
  createUser,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
  loginUser,
  logoutUser,
  logoutAllDevices,
  getTokenStats,
  cleanupTokens,
  getCurrentUser,
  // getSystemStats,
  adminInvite,
  verifyInvite,
  signupWithInvite
};
