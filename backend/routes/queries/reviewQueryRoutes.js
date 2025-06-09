const express = require("express");

const reviewsMongoRouter = express.Router();
const reviewsMongoController = require('../../controllers/queries/reviewsQueryController');
reviewsMongoRouter.post('/', reviewsMongoController.addReview);
reviewsMongoRouter.put('/', reviewsMongoController.changeReview);
reviewsMongoRouter.get('/:studentId/:courseId', reviewsMongoController.getReview);
reviewsMongoRouter.get('/average/:courseId', reviewsMongoController.averageReview);
module.exports = reviewsMongoRouter;