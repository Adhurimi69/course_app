const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseId: Number, // SQL ID
  title: String,
  departmentId: Number,
  departmentName: String, // Flatten department name
});

module.exports.CourseReadModel = mongoose.model(
  "CourseReadModel",
  courseSchema
);
