const express = require("express");
const router = express.Router();
const {
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../../controllers/commands/studentCommandController");

router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
