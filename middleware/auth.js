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

module.exports = { 
  auth,
  authAdmin
};