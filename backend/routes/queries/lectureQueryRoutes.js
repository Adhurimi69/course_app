const express = require("express");
const router = express.Router();
const {
  getAllLectures,
  getLectureById,
  getLectureByCourse,
} = require("../../controllers/queries/lectureQueryController");

router.get("/", getAllLectures);
router.get("/:id", getLectureById);
router.get("/course/:courseId", getLectureByCourse);

module.exports = router;
