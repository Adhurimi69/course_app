const express = require("express");

const assignmentGradeRouter = express.Router();
const assignmentGradeController = require('../../controllers/commands/assignmentGradeController');
assignmentGradeRouter.post('/', assignmentGradeController.addGrade);
assignmentGradeRouter.delete('/', assignmentGradeController.removeGrade);
assignmentGradeRouter.put('/', assignmentGradeController.changeGrade);
assignmentGradeRouter.get('/teacher', assignmentGradeController.seeGradesTeacher);
assignmentGradeRouter.get('/student/:id', assignmentGradeController.seeGradesStudent);
module.exports = assignmentGradeRouter;
