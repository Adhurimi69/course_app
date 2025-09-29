const express = require("express");

const reviewRouter = express.Router();
const reviewController = require('../../controllers/commands/reviewController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

// Students (and teachers/admins) can add reviews
reviewRouter.post('/', requireRole('student','teacher','admin'), reviewController.addReview);

// Update review: owner student or admin
reviewRouter.put('/', requireOwnershipOrRole('studentId', 'admin'), reviewController.changeReview);

// Fetch single review: owner or teacher/admin
reviewRouter.get('/:studentId/:courseId', requireOwnershipOrRole('studentId', 'admin','teacher'), reviewController.getReview);

// Average can be viewed by teachers/admins
reviewRouter.get('/average/:courseId', requireRole('admin','teacher'), reviewController.averageReview);

module.exports = reviewRouter;
