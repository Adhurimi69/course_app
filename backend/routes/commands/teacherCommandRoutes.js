const express = require("express");
const router = express.Router();
const {
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../../controllers/commands/teacherCommandController");

router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;
