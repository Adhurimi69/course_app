// uploadRoutes.js
const express = require('express');
const uploadRouter = express.Router();
const uploadController = require('../../controllers/commands/uploadController');
uploadRouter.post('/', uploadController.uploadDoc);
uploadRouter.delete('/:id', uploadController.deleteDoc);
uploadRouter.get('/:id', uploadController.fetchUpload);
module.exports = uploadRouter;