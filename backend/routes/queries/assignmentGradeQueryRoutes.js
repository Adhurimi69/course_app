const express = require("express");

const assignmentGradeMongoRouter = express.Router();
const assignmentGradeMongoController = require('../../controllers/queries/assignmentGradeQueryController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

assignmentGradeMongoRouter.post('/', requireRole('admin','teacher'), assignmentGradeMongoController.addGrade);
assignmentGradeMongoRouter.delete('/', requireRole('admin','teacher'), assignmentGradeMongoController.removeGrade);
assignmentGradeMongoRouter.put('/', requireRole('admin','teacher'), assignmentGradeMongoController.changeGrade);
assignmentGradeMongoRouter.get('/teacher', requireRole('admin','teacher'), assignmentGradeMongoController.seeGradesTeacher);
assignmentGradeMongoRouter.get('/student/:id', requireOwnershipOrRole('id', 'admin','teacher'), assignmentGradeMongoController.seeGradesStudent);
// Development helper: unprotected access to assignment-grade read-models
if (process.env.NODE_ENV !== 'production') {
	assignmentGradeMongoRouter.get('/dev', assignmentGradeMongoController.seeGradesTeacher);
}
module.exports = assignmentGradeMongoRouter;
