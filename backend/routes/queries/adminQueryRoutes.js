const express = require("express");
const router = express.Router();
const {
  getAdmins,
  getAdminById,
} = require("../../controllers/queries/adminQueryController");

router.get("/", getAdmins);
router.get("/:id", getAdminById);

module.exports = router;
