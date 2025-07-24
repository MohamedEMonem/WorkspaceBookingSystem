const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to req
    res.locals.user = decoded; // also attach to res.locals for templates
    next();
  } catch (err) {
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