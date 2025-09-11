const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../../models/sql/admin");
const { signAccessToken, signRefreshToken, verifyRefresh } = require("../../middleware/tokens");

const COOKIE_NAME = "jwt";
const IDLE_MS = Number(process.env.IDLE_TIMEOUT_MS || 30 * 60 * 1000);

function setRefreshCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// LOGIN
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const now = Date.now();
    const accessToken = signAccessToken(admin);
    const refreshToken = signRefreshToken(admin, { lastSeen: now });

    admin.refreshToken = refreshToken;
    await admin.save();

    setRefreshCookie(res, refreshToken);
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REFRESH
const handleRefreshToken = async (req, res) => {
  const incoming = req.cookies?.[COOKIE_NAME];
  if (!incoming) return res.sendStatus(401);

  const admin = await Admin.findOne({ where: { refreshToken: incoming } });
  if (!admin) return res.sendStatus(403);

  let decoded;
  try { decoded = verifyRefresh(incoming); } catch { return res.sendStatus(403); }

  const now = Date.now();
  const lastSeen = decoded?.smeta?.lastSeen ?? now;

  if (IDLE_MS && now - lastSeen > IDLE_MS) {
    admin.refreshToken = null; await admin.save();
    res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });
    return res.status(401).json({ message: "Session expired (idle timeout)" });
  }

  const accessToken = signAccessToken(admin);
  const newRefresh = signRefreshToken(admin, { lastSeen: now });
  admin.refreshToken = newRefresh; await admin.save();

  setRefreshCookie(res, newRefresh);
  res.json({ accessToken });
};

// LOGOUT
const handleLogout = async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.sendStatus(204);

  const admin = await Admin.findOne({ where: { refreshToken: token } });
  if (admin) { admin.refreshToken = null; await admin.save(); }

  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });
  res.sendStatus(204);
};

module.exports = {
  loginAdmin,
  handleRefreshToken,
  handleLogout,
};
