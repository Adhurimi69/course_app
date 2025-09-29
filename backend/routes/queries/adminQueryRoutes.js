const express = require("express");
const router = express.Router();
const {
  getAdmins,
  getAdminById,
} = require("../../controllers/queries/adminQueryController");
const requireRole = require('../../middleware/requireRole');

router.get("/", requireRole('admin'), getAdmins);
router.get("/:id", requireRole('admin'), getAdminById);

module.exports = router;
