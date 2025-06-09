const express = require("express");

const assignmentGradeMongoRouter = express.Router();
const assignmentGradeMongoController = require('../../controllers/queries/assignmentGradeQueryController');
assignmentGradeMongoRouter.post('/', assignmentGradeMongoController.addGrade);
assignmentGradeMongoRouter.delete('/', assignmentGradeMongoController.removeGrade);
assignmentGradeMongoRouter.put('/', assignmentGradeMongoController.changeGrade);
assignmentGradeMongoRouter.get('/teacher', assignmentGradeMongoController.seeGradesTeacher);
assignmentGradeMongoRouter.get('/student/:id', assignmentGradeMongoController.seeGradesStudent);
module.exports = assignmentGradeMongoRouter;
