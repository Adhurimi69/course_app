const express = require("express");
const uploadsMongoRouter = express.Router();
const uploadsMongoController = require('../../controllers/queries/uploadQueryController');

uploadsMongoRouter.get("/:id", uploadsMongoController.fetchUpload);
uploadsMongoRouter.get("/", uploadsMongoController.listUploads);

module.exports = uploadsMongoRouter;
