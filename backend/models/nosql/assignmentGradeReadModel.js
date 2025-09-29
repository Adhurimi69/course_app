


// models/assignmentGrade.mongo.model.js
const mongoose = require("mongoose");

const AssignmentGradeSchema = new mongoose.Schema({
  // refs must match the mongoose model names used elsewhere
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentReadModel' },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentReadModel' },
  score: Number,
});
module.exports = mongoose.model('AssignmentGrade', AssignmentGradeSchema);
