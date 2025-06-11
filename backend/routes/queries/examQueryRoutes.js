const express = require("express");
const router = express.Router();
const {
  getAllExams,
  getExamById,
  getExamByCourse,
} = require("../../controllers/queries/examQueryController");

router.get("/", getAllExams);
router.get("/:id", getExamById);
router.get("/course/:courseId", getExamByCourse);

module.exports = router;
