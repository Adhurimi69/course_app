const express = require("express");

const gradeRouter = express.Router();
const gradeController = require('../../controllers/commands/gradeController');
gradeRouter.post('/', gradeController.addGrade);
gradeRouter.delete('/', gradeController.removeGrade);
gradeRouter.put('/', gradeController.changeGrade);
gradeRouter.get('/teacher', gradeController.seegradeTeacher);
gradeRouter.get('/student/:id', gradeController.seegradeStudent);
module.exports = gradeRouter;
