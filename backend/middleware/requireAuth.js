const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing access token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "accesssecret");
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid/expired access token" });
  }
};
