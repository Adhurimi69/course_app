const express = require("express");
const router = express.Router();
const {
  createExam,
  updateExam,
  deleteExam,
} = require("../../controllers/commands/examCommandController");

router.post("/", createExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

module.exports = router;
