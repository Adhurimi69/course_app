const express = require("express");

const reviewsMongoRouter = express.Router();
const reviewsMongoController = require('../../controllers/queries/reviewsQueryController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

reviewsMongoRouter.post('/', requireRole('student','teacher','admin'), reviewsMongoController.addReview);
reviewsMongoRouter.put('/', requireOwnershipOrRole('studentId', 'admin'), reviewsMongoController.changeReview);
reviewsMongoRouter.get('/:studentId/:courseId', requireOwnershipOrRole('studentId', 'admin','teacher'), reviewsMongoController.getReview);
reviewsMongoRouter.get('/average/:courseId', requireRole('admin','teacher'), reviewsMongoController.averageReview);
module.exports = reviewsMongoRouter;