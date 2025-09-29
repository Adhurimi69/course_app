const express = require("express");

const assignmentGradeRouter = express.Router();
const assignmentGradeController = require('../../controllers/commands/assignmentGradeController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

assignmentGradeRouter.post('/', requireRole('admin','teacher'), assignmentGradeController.addGrade);
assignmentGradeRouter.delete('/', requireRole('admin','teacher'), assignmentGradeController.removeGrade);
assignmentGradeRouter.put('/', requireRole('admin','teacher'), assignmentGradeController.changeGrade);
assignmentGradeRouter.get('/teacher', requireRole('admin','teacher'), assignmentGradeController.seeGradesTeacher);
assignmentGradeRouter.get('/student/:id', requireOwnershipOrRole('id', 'admin','teacher'), assignmentGradeController.seeGradesStudent);
module.exports = assignmentGradeRouter;
