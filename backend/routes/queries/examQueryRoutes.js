const express = require("express");
const router = express.Router();
const {
  getAllExams,
  getExamById,
  getExamByCourse,
} = require("../../controllers/queries/examQueryController");
const requireRole = require('../../middleware/requireRole');

router.get("/", requireRole('admin','teacher','student'), getAllExams);
router.get("/course/:courseId", requireRole('admin','teacher','student'), getExamByCourse);
router.get("/:id", requireRole('admin','teacher','student'), getExamById);

module.exports = router;

module.exports = router;
