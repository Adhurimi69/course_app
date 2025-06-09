


// models/assignmentGrade.mongo.model.js
const mongoose = require("mongoose");

const AssignmentGradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  score: Number,
});
module.exports = mongoose.model('AssignmentGrade', AssignmentGradeSchema);
