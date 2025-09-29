const express = require("express");
const router = express.Router();
const {
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByLecture,
} = require("../../controllers/queries/assignmentQueryController");
const requireRole = require('../../middleware/requireRole');

router.get("/", requireRole('admin','teacher','student'), getAllAssignments);
router.get("/lecture/:lectureId", requireRole('admin','teacher','student'), getAssignmentsByLecture);
router.get("/:id", requireRole('admin','teacher','student'), getAssignmentById);

module.exports = router;

module.exports = router;
