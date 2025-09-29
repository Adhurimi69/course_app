const mongoose = require("mongoose");

const studentExamSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentReadModel",
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamReadModel",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("StudentExam", studentExamSchema);
