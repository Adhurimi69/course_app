const express = require("express");
const router = express.Router();
const {
  loginStudent,
  handleRefreshToken,
  handleLogout,
} = require("../../controllers/commands/studentAuthController");

router.post("/login", loginStudent);
router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
