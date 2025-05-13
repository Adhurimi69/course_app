const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  handleRefreshToken,
  handleLogout,
} = require("../../controllers/commands/adminAuthController");

router.post("/login", loginAdmin);
router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
