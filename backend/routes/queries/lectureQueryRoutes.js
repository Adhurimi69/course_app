const express = require("express");
const router = express.Router();
const {
  getAllLectures,
  getLectureById,
  getLectureByCourse,
} = require("../../controllers/queries/lectureQueryController");
const requireRole = require('../../middleware/requireRole');

router.get("/", requireRole('admin','teacher','student'), getAllLectures);
router.get("/course/:courseId", requireRole('admin','teacher','student'), getLectureByCourse);
router.get("/:id", requireRole('admin','teacher','student'), getLectureById);

module.exports = router;

module.exports = router;
