const express = require("express");
const router = express.Router();
const {
  createExam,
  updateExam,
  deleteExam,
} = require("../../controllers/commands/examCommandController");
const requireRole = require('../../middleware/requireRole');

router.post("/", requireRole('admin','teacher'), createExam);
router.put("/:id", requireRole('admin','teacher'), updateExam);
router.delete("/:id", requireRole('admin','teacher'), deleteExam);

module.exports = router;
