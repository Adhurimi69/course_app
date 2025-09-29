const bcrypt = require("bcryptjs");
const Student = require("../../models/sql/student");
const { signAccessToken, signRefreshToken, verifyRefresh } = require("../../middleware/tokens");

const COOKIE_NAME = "jwt";
const IDLE_MS = Number(process.env.IDLE_TIMEOUT_MS || 30 * 60 * 1000);

function setRefreshCookie(res, token) {
  const sameSite = process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax';
  const secure = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// LOGIN
const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  const student = await Student.findOne({ where: { email } });
  if (!student) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const now = Date.now();
  const accessToken = signAccessToken(student);
  const refreshToken = signRefreshToken(student, { lastSeen: now });

  student.refreshToken = refreshToken;
  await student.save();

  setRefreshCookie(res, refreshToken);
  res.json({ accessToken });
};

// REFRESH
const handleRefreshToken = async (req, res) => {
  const incoming = req.cookies?.[COOKIE_NAME];
  if (!incoming) return res.sendStatus(401);

  const student = await Student.findOne({ where: { refreshToken: incoming } });
  if (!student) return res.sendStatus(403);

  let decoded;
  try { decoded = verifyRefresh(incoming); } catch { return res.sendStatus(403); }

  const now = Date.now();
  const lastSeen = decoded?.smeta?.lastSeen ?? now;

  if (IDLE_MS && now - lastSeen > IDLE_MS) {
  student.refreshToken = null; await student.save();
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', secure: process.env.NODE_ENV === 'production' });
    return res.status(401).json({ message: "Session expired (idle timeout)" });
  }

  const accessToken = signAccessToken(student);
  const newRefresh = signRefreshToken(student, { lastSeen: now });
  student.refreshToken = newRefresh; await student.save();

  setRefreshCookie(res, newRefresh);
  res.json({ accessToken });
};

// LOGOUT
const handleLogout = async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.sendStatus(204);

  const student = await Student.findOne({ where: { refreshToken: token } });
  if (student) { student.refreshToken = null; await student.save(); }

  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });
  res.sendStatus(204);
};

module.exports = { loginStudent, handleRefreshToken, handleLogout };
