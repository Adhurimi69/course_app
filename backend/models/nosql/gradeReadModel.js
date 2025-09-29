// models/grade.mongo.model.js
const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentReadModel' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseReadModel' },
  score: Number,
});
module.exports = mongoose.model('Grade', GradeSchema);
