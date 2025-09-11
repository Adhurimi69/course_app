const bcrypt = require("bcryptjs");
const Teacher = require("../../models/sql/teacher");
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

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  const teacher = await Teacher.findOne({ where: { email } });
  if (!teacher) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const now = Date.now();
  const accessToken = signAccessToken(teacher);
  const refreshToken = signRefreshToken(teacher, { lastSeen: now });

  teacher.refreshToken = refreshToken;
  await teacher.save();

  setRefreshCookie(res, refreshToken);
  res.json({ accessToken });
};

const handleRefreshToken = async (req, res) => {
  const incoming = req.cookies?.[COOKIE_NAME];
  if (!incoming) return res.sendStatus(401);

  const teacher = await Teacher.findOne({ where: { refreshToken: incoming } });
  if (!teacher) return res.sendStatus(403);

  let decoded;
  try { decoded = verifyRefresh(incoming); } catch { return res.sendStatus(403); }

  const now = Date.now();
  const lastSeen = decoded?.smeta?.lastSeen ?? now;

  if (IDLE_MS && now - lastSeen > IDLE_MS) {
    teacher.refreshToken = null; await teacher.save();
    res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });
    return res.status(401).json({ message: "Session expired (idle timeout)" });
  }

  const accessToken = signAccessToken(teacher);
  const newRefresh = signRefreshToken(teacher, { lastSeen: now });
  teacher.refreshToken = newRefresh; await teacher.save();

  setRefreshCookie(res, newRefresh);
  res.json({ accessToken });
};

const handleLogout = async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.sendStatus(204);

  const teacher = await Teacher.findOne({ where: { refreshToken: token } });
  if (teacher) { teacher.refreshToken = null; await teacher.save(); }

  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });
  res.sendStatus(204);
};

module.exports = { loginTeacher, handleRefreshToken, handleLogout };
