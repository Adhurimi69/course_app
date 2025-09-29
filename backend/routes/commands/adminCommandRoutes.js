const express = require("express");
const router = express.Router();
const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../../controllers/commands/adminCommandController");
const requireRole = require('../../middleware/requireRole');

// Only admins can manage other admins
router.post("/", requireRole('admin'), createAdmin);
router.put("/:id", requireRole('admin'), updateAdmin);
router.delete("/:id", requireRole('admin'), deleteAdmin);

module.exports = router;
