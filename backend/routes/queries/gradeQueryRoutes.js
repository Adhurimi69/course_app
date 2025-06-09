const express = require("express");

const gradesMongoRouter = express.Router();
const gradesMongoController = require('../../controllers/queries/gradeQueryController');
gradesMongoRouter.post('/', gradesMongoController.addGrade);
gradesMongoRouter.delete('/', gradesMongoController.removeGrade);
gradesMongoRouter.put('/', gradesMongoController.changeGrade);
gradesMongoRouter.get('/teacher', gradesMongoController.seeGradesTeacher);
gradesMongoRouter.get('/student/:id', gradesMongoController.seeGradesStudent);
module.exports = gradesMongoRouter;