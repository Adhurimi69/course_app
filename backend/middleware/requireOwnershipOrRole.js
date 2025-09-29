const requireAuth = require("./requireAuth");

/**
 * requireOwnershipOrRole(paramName, ...roles)
 * - paramName: the route param containing the owner id (e.g. 'id' or 'studentId')
 * - roles: roles that are allowed regardless of ownership
 */
module.exports = function requireOwnershipOrRole(paramName, ...roles) {
  return function (req, res, next) {
    requireAuth(req, res, function authNext(err) {
      if (err) return; // requireAuth handled response

      const user = req.user;
      if (!user) return res.status(401).json({ message: "Missing access token" });

      // If user role matches allowed roles, allow
      if (roles && roles.length > 0 && roles.includes(user.role)) return next();

      // Otherwise check ownership: compare param to user.id (string/number tolerant)
      const ownerId = req.params?.[paramName] ?? req.body?.[paramName];
      if (!ownerId) return res.status(403).json({ message: "Forbidden: missing ownership param" });

      if (String(ownerId) === String(user.id)) return next();

      return res.status(403).json({ message: "Forbidden: not owner" });
    });
  };
};
