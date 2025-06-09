// models/attendance.mongo.model.js
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
});
module.exports = mongoose.model('Attendance', AttendanceSchema);
