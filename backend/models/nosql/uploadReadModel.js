// backend/models/nosql/uploadReadModel.js
const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
  file: { type: String, required: true },
  timeUploaded: { type: Date, default: Date.now },
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", default: null },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", default: null },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
});

// Indexes to improve query performance
UploadSchema.index({ lectureId: 1 });
UploadSchema.index({ assignmentId: 1 });
UploadSchema.index({ studentId: 1 });
UploadSchema.index({ timeUploaded: -1 });

module.exports = mongoose.model("Upload", UploadSchema);
