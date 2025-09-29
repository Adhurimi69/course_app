const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
} = require("../../controllers/queries/courseQueryController");
const requireRole = require('../../middleware/requireRole');

// Any authenticated user (student/teacher/admin) can view courses
router.get("/", requireRole('admin','teacher','student'), getCourses);
router.get("/:id", requireRole('admin','teacher','student'), getCourseById);

module.exports = router;
