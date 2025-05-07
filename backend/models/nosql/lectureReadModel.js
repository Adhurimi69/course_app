const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  lectureId: Number,
  title: String,
  courseId: Number,
  courseTitle: String,
});

module.exports.LectureReadModel = mongoose.model(
  "LectureReadModel",
  lectureSchema
);
