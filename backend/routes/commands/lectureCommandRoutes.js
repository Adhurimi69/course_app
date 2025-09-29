const express = require("express");
const router = express.Router();
const {
  createLecture,
  updateLecture,
  deleteLecture,
} = require("../../controllers/commands/lectureCommandController");
const requireRole = require('../../middleware/requireRole');

router.post("/", requireRole('admin','teacher'), createLecture);
router.put("/:id", requireRole('admin','teacher'), updateLecture);
router.delete("/:id", requireRole('admin','teacher'), deleteLecture);

module.exports = router;
