const express = require("express");
const router = express.Router();
const {
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../../controllers/commands/teacherCommandController");
const requireRole = require('../../middleware/requireRole');

// Only admins may create/update/delete teacher records
router.post("/", requireRole('admin'), createTeacher);
router.put("/:id", requireRole('admin'), updateTeacher);
router.delete("/:id", requireRole('admin'), deleteTeacher);

module.exports = router;
