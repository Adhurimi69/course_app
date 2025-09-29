// routes/assignmentCommandRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../../controllers/commands/assignmentCommandController");
const requireRole = require('../../middleware/requireRole');

router.post("/", requireRole('admin','teacher'), createAssignment);
router.put("/:id", requireRole('admin','teacher'), updateAssignment);
router.delete("/:id", requireRole('admin','teacher'), deleteAssignment);

module.exports = router;
