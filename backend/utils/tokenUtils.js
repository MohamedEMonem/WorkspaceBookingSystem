const { TokenBlacklist } = require("../models/tokenBlacklistModel");

// Clean up expired tokens from blacklist (can be run as a cron job)
const cleanupExpiredTokens = async () => {
  try {
    const result = await TokenBlacklist.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    console.log(`Cleaned up ${result.deletedCount} expired tokens from blacklist`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    throw error;
  }
};

// Get blacklist statistics (admin only)
const getBlacklistStats = async () => {
  try {
    const totalBlacklisted = await TokenBlacklist.countDocuments();
    const expiredCount = await TokenBlacklist.countDocuments({
      expiresAt: { $lt: new Date() }
    });
    const activeBlacklisted = totalBlacklisted - expiredCount;

    return {
      totalBlacklisted,
      activeBlacklisted,
      expiredCount,
    };
  } catch (error) {
    console.error("Error getting blacklist stats:", error);
    throw error;
  }
};

// Check if a specific token is blacklisted
const isTokenBlacklisted = async (token) => {
  try {
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    return !!blacklistedToken;
  } catch (error) {
    console.error("Error checking token blacklist:", error);
    throw error;
  }
};

// Blacklist all tokens for a specific user (admin function)
const blacklistAllUserTokens = async (userId) => {
  try {
    // In a real implementation, you'd need to track all issued tokens
    // For now, this is a placeholder that would require additional token tracking
    console.log(`Would blacklist all tokens for user: ${userId}`);
    return { message: "Feature requires additional token tracking implementation" };
  } catch (error) {
    console.error("Error blacklisting all user tokens:", error);
    throw error;
  }
};

module.exports = {
  cleanupExpiredTokens,
  getBlacklistStats,
  isTokenBlacklisted,
  blacklistAllUserTokens,
};
