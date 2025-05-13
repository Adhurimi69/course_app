const express = require("express");
const router = express.Router();
const {
  loginUser,
  handleRefreshToken,
  handleLogout,
} = require("../../controllers/commands/authController");

router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
