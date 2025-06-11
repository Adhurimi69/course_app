const express = require("express");
const router = express.Router();
const {
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByLecture,
} = require("../../controllers/queries/assignmentQueryController");

router.get("/", getAllAssignments);
router.get("/:id", getAssignmentById);
router.get("/lecture/:lectureId", getAssignmentsByLecture);

module.exports = router;
