const jwt = require("jsonwebtoken");

const ACCESS_EXPIRES  = process.env.ACCESS_EXPIRES  || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || "7d";

function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "accesssecret",
    { expiresIn: ACCESS_EXPIRES }
  );
}

function signRefreshToken(user, sessionMeta) {
  return jwt.sign(
    {
      id: user.id, email: user.email, role: user.role,
      smeta: { lastSeen: sessionMeta.lastSeen }
    },
    process.env.JWT_REFRESH_SECRET || "refreshsecret",
    { expiresIn: REFRESH_EXPIRES }
  );
}

function verifyRefresh(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "refreshsecret");
}

module.exports = { signAccessToken, signRefreshToken, verifyRefresh };
