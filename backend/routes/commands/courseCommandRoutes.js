const express = require("express");
const router = express.Router();
const {
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../../controllers/commands/courseCommandController");
const requireRole = require('../../middleware/requireRole');

// Allow admins and teachers to manage courses
router.post("/", requireRole('admin','teacher'), createCourse);
router.put("/:id", requireRole('admin','teacher'), updateCourse);
router.delete("/:id", requireRole('admin','teacher'), deleteCourse);

module.exports = router;
