const express = require("express");

const gradesMongoRouter = express.Router();
const gradesMongoController = require('../../controllers/queries/gradeQueryController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

// Mutations guarded: only admin/teacher may mutate read-models
gradesMongoRouter.post('/', requireRole('admin','teacher'), gradesMongoController.addGrade);
gradesMongoRouter.delete('/', requireRole('admin','teacher'), gradesMongoController.removeGrade);
gradesMongoRouter.put('/', requireRole('admin','teacher'), gradesMongoController.changeGrade);
gradesMongoRouter.get('/teacher', requireRole('admin','teacher'), gradesMongoController.seeGradesTeacher);
gradesMongoRouter.get('/student/:id', requireOwnershipOrRole('id', 'admin','teacher'), gradesMongoController.seeGradesStudent);
// Development helper: unprotected access to grade read-models
if (process.env.NODE_ENV !== 'production') {
	gradesMongoRouter.get('/dev', gradesMongoController.seeGradesTeacher);
}


gradesMongoRouter.get("/", requireRole('admin','teacher'), gradesMongoController.seeGradesTeacher);
gradesMongoRouter.get("/:id", requireOwnershipOrRole('id', 'admin','teacher'), gradesMongoController.seeGradesStudent);
module.exports = gradesMongoRouter;