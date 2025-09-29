const requireAuth = require("./requireAuth");

module.exports = function requireRole(...allowedRoles) {
  return function (req, res, next) {
    // First ensure user is authenticated
    requireAuth(req, res, function authNext(err) {
      if (err) return; // requireAuth already handled response

      const user = req.user;
      if (!user) return res.status(401).json({ message: "Missing access token" });

      if (!allowedRoles || allowedRoles.length === 0) return next();

      if (allowedRoles.includes(user.role)) return next();

      return res.status(403).json({ message: "Forbidden: insufficient role" });
    });
  };
};
