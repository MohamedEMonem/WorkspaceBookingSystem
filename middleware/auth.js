const jwt = require("jsonwebtoken");
const { TokenBlacklist } = require("../models/tokenBlacklistModel");

const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "No token provided" });
  
  try {
    // Check if token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ error: "Token has been revoked" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to req
    req.token = token; // attach token to req for potential blacklisting
    res.locals.user = decoded; // also attach to res.locals for templates
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
};

const authAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin required." });
  }
  
  next();
};

// Middleware for owner-level access (owner or admin)
const authOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (!["owner", "admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied. Owner or Admin required." });
  }
  
  next();
};

// Middleware for admin or owner access
const authAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (!["admin", "owner"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied. Admin or Owner required." });
  }
  
  next();
};

// Middleware to check if user can access a specific user resource
const authUserAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const targetUserId = req.params.id;
  const currentUserId = req.user.userId;
  const currentUserRole = req.user.role;
  
  // Admin can access any user, users can only access themselves
  if (currentUserRole === "admin" || targetUserId === currentUserId) {
    return next();
  }
  
  return res.status(403).json({ 
    error: "Access denied. You can only access your own profile." 
  });
};

// Middleware to check if user can modify a specific user resource
const authUserModify = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const targetUserId = req.params.id;
  const currentUserId = req.user.userId;
  const currentUserRole = req.user.role;
  
  // Admin and owner can modify any user, users can only modify themselves
  if (["admin", "owner"].includes(currentUserRole) || targetUserId === currentUserId) {
    return next();
  }
  
  return res.status(403).json({ 
    error: "Access denied. You can only modify your own profile." 
  });
};

module.exports = { 
  auth,
  authAdmin,
  authOwner,
  authAdminOrOwner,
  authUserAccess,
  authUserModify
};