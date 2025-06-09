const express = require("express");

const reviewRouter = express.Router();
const reviewController = require('../../controllers/commands/reviewController');
reviewRouter.post('/', reviewController.addReview);
reviewRouter.put('/', reviewController.changeReview);
reviewRouter.get('/:studentId/:courseId', reviewController.getReview);
reviewRouter.get('/average/:courseId', reviewController.averageReview);
module.exports = reviewRouter;
