const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: Number,
  name: String,
  email: String,
  role: String,
});

module.exports.StudentReadModel = mongoose.model(
  "StudentReadModel",
  studentSchema
);
