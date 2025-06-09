const mongoose = require('mongoose');
const StudentCourseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});
module.exports = mongoose.model('StudentCourse', StudentCourseSchema);