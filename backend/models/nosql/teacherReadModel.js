const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  teacherId: Number,
  name: String,
  email: String,
  role: String,
});

module.exports.TeacherReadModel = mongoose.model(
  "TeacherReadModel",
  teacherSchema
);
