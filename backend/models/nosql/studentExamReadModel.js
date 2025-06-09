const mongoose = require("mongoose");

const studentExamSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("StudentExam", studentExamSchema);
