const express = require("express");
const router = express.Router();
const controller = require("../../controllers/queries/studentExamQueryController");
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

router.post("/", requireRole('admin','teacher'), controller.addGrade);
router.delete("/", requireRole('admin','teacher'), controller.removeGrade);
router.put("/", requireRole('admin','teacher'), controller.changeGrade);
router.get("/", requireRole('admin','teacher'), controller.seeGradesTeacher);
router.get("/student/:id", requireOwnershipOrRole('id', 'admin','teacher'), controller.seeGradesStudent);

// Development helper: unprotected access to student-exam read-models.
// NOTE: this is intentionally unprotected to help local development. Remove or guard this in production.
router.get('/dev', controller.seeGradesTeacher);

module.exports = router;
