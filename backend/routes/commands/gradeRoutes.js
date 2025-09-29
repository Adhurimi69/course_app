const express = require("express");

const gradeRouter = express.Router();
const gradeController = require('../../controllers/commands/gradeController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

// Mutations: only teacher or admin
gradeRouter.post('/', requireRole('admin','teacher'), gradeController.addGrade);
gradeRouter.delete('/', requireRole('admin','teacher'), gradeController.removeGrade);
gradeRouter.put('/', requireRole('admin','teacher'), gradeController.changeGrade);

// Views: teachers/admins can see all; students can see their own
gradeRouter.get('/teacher', requireRole('admin','teacher'), gradeController.seegradeTeacher);
gradeRouter.get('/student/:id', requireOwnershipOrRole('id', 'admin','teacher'), gradeController.seegradeStudent);

module.exports = gradeRouter;
