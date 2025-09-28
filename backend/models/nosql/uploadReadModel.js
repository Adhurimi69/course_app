// backend/models/nosql/uploadReadModel.js
const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
  file: { type: String, required: true },
  timeUploaded: { type: Date, default: Date.now },
  lectureId: { type: Number, default: null },       // Changed from ObjectId to Number
  assignmentId: { type: Number, default: null },   // Changed from ObjectId to Number
  studentId: { type: Number, default: null},      // Changed from ObjectId to Number
});

// Indexes to improve query performance
UploadSchema.index({ lectureId: 1 });
UploadSchema.index({ assignmentId: 1 });
UploadSchema.index({ studentId: 1 });
UploadSchema.index({ timeUploaded: -1 });

module.exports = mongoose.model("Upload", UploadSchema);

