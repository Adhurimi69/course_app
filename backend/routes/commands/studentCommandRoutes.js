const express = require("express");
const router = express.Router();
const {
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../../controllers/commands/studentCommandController");
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

// Admins create/delete students. Students may update their own profile; admins may update any.
router.post("/", requireRole('admin'), createStudent);
router.put("/:id", requireOwnershipOrRole('id', 'admin'), updateStudent);
router.delete("/:id", requireRole('admin'), deleteStudent);

module.exports = router;
