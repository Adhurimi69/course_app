const express = require("express");

const uploadsMongoRouter = express.Router();
const uploadsMongoController = require('../../controllers/queries/uploadQueryController');
uploadsMongoRouter.post('/', uploadsMongoController.uploadDoc);
uploadsMongoRouter.delete('/:id', uploadsMongoController.deleteDoc);
uploadsMongoRouter.get('/:id', uploadsMongoController.fetchUpload);
module.exports = uploadsMongoRouter;
