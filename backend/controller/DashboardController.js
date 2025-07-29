const { UserModel } = require("../models/userModel");
const { TokenBlacklist } = require("../models/tokenBlacklistModel");
const {
  getBlacklistStats,
  cleanupExpiredTokens,
} = require("../utils/tokenUtils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    const users = await UserModel.find({}).select("-password");
    res.status(200).json({
      message: "Users retrieved successfully",
      users: users,
      count: users.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching users", message: error.message });
  }
};

const getSystemStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    // Get user statistics by role
    const userStats = await UserModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total users
    const totalUsers = await UserModel.countDocuments();

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await UserModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get token blacklist stats
    const tokenStats = await getBlacklistStats();

    res.status(200).json({
      message: "System statistics retrieved successfully",
      stats: {
        users: {
          total: totalUsers,
          byRole: userStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}),
          recentSignups: recentUsers
        },
        tokens: tokenStats,
        systemInfo: {
          uptime: process.uptime(),
          nodeVersion: process.version,
          platform: process.platform
        }
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving system stats", message: error.message });
  }
};
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
    else if (currentUserRole === "admin") {
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
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting user", message: error.message });
  }
};


module.exports = {getAllUsers,getSystemStats, deleteUser};

