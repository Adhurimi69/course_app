const express = require("express");
const router = express.Router();
const {
  loginTeacher,
  handleRefreshToken,
  handleLogout,
} = require("../../controllers/commands/teacherAuthController");

router.post("/login", loginTeacher);
router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
