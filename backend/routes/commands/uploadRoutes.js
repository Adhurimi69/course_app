const express = require("express");
const uploadRouter = express.Router();
const uploadController = require("../../controllers/commands/uploadController");

uploadRouter.post("/", uploadController.uploadDoc);
uploadRouter.get("/:id", uploadController.fetchUpload);
uploadRouter.delete("/:id", uploadController.deleteDoc);

module.exports = uploadRouter;
