const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Teacher = require("../../models/sql/teacher");

// LOGIN
const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  try {
    const teacher = await Teacher.findOne({ where: { email } });
    if (!teacher)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: teacher.id, email: teacher.email, role: teacher.role },
      process.env.JWT_SECRET || "accesssecret",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: teacher.id, email: teacher.email, role: teacher.role },
      process.env.JWT_REFRESH_SECRET || "refreshsecret",
      { expiresIn: "7d" }
    );

    teacher.refreshToken = refreshToken;
    await teacher.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REFRESH
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  try {
    const teacher = await Teacher.findOne({ where: { refreshToken } });
    if (!teacher) return res.sendStatus(403); // Forbidden

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refreshsecret",
      (err, decoded) => {
        if (err || teacher.email !== decoded.email) return res.sendStatus(403);

        const accessToken = jwt.sign(
          { id: teacher.id, email: teacher.email, role: teacher.role },
          process.env.JWT_SECRET || "accesssecret",
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT
const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  try {
    const teacher = await Teacher.findOne({ where: { refreshToken } });
    if (teacher) {
      teacher.refreshToken = null;
      await teacher.save();
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  loginTeacher,
  handleRefreshToken,
  handleLogout,
};
