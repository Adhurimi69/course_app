// routes/assignmentCommandRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../../controllers/commands/assignmentCommandController");

router.post("/", createAssignment);
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

module.exports = router;
