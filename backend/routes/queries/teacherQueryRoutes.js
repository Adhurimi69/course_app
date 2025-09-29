const express = require("express");
const router = express.Router();
const {
  getTeachers,
  getTeacherById,
} = require("../../controllers/queries/teacherQueryController");
const requireRole = require('../../middleware/requireRole');

router.get("/", requireRole('admin','teacher'), getTeachers);
router.get("/:id", requireRole('admin','teacher'), getTeacherById);

module.exports = router;
