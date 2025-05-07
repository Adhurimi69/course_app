const express = require("express");
const router = express.Router();
const {
  getAllLectures,
  getLectureById,
} = require("../../controllers/queries/lectureQueryController");

router.get("/", getAllLectures);
router.get("/:id", getLectureById);

module.exports = router;
