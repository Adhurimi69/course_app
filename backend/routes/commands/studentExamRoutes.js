const express = require("express");
const router = express.Router();
const controller = require("../../controllers/commands/studentExamController");
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

// Mutations by teacher or admin
router.post("/", requireRole('admin','teacher'), controller.addGrade);
router.delete("/", requireRole('admin','teacher'), controller.removeGrade);
router.put("/", requireRole('admin','teacher'), controller.changeGrade);

// Views
router.get("/", requireRole('admin','teacher'), controller.seeGradesTeacher);
router.get("/student/:id", requireOwnershipOrRole('id', 'admin','teacher'), controller.seeGradesStudent);

module.exports = router;
