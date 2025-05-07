const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  assignmentId: Number,
  title: String,
  dueDate: Date,
  lectureId: Number,
  lectureTitle: String,
  courseId: Number,
  courseTitle: String,
});

module.exports.AssignmentReadModel = mongoose.model(
  "AssignmentReadModel",
  assignmentSchema
);
