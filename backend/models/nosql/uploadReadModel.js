const mongoose = require("mongoose");

// models/upload.mongo.model.js
const UploadSchema = new mongoose.Schema({
  file: String,
  timeUploaded: Date,
});
module.exports = mongoose.model('Upload', UploadSchema);