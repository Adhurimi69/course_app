// models/nosql/examReadModel.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examId: {
    type: Number, // This is the SQL ID
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  courseId: {
    type: Number,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const ExamReadModel = mongoose.model('ExamReadModel', examSchema);

module.exports = { ExamReadModel };
