const express = require("express");
const router = express.Router();
const {
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../../controllers/commands/courseCommandController");

router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
