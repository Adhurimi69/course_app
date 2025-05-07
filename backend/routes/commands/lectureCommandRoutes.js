const express = require("express");
const router = express.Router();
const {
  createLecture,
  updateLecture,
  deleteLecture,
} = require("../../controllers/commands/lectureCommandController");

router.post("/", createLecture);
router.put("/:id", updateLecture);
router.delete("/:id", deleteLecture);

module.exports = router;
