const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const header = req.headers.authorization; // "Bearer <token>"
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user info
    req.user = decoded; // { id, username, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid/Expired token" });
  }
};

module.exports = auth;