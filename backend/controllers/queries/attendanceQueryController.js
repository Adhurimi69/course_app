const Attendance = require('../../models/nosql/attendanceReadModel');

exports.addAttendance = async (req, res) => {
  const record = await Attendance.create(req.body);
  res.status(201).json(record);
};

exports.calculateAttendanceForStudent = async (req, res) => {
  const { studentId, courseId } = req.params;
  const records = await Attendance.find({ studentId, courseId })
    .populate('lectureId', 'title');
  res.json({
    studentId,
    courseId,
    count: records.length,
    lectures: records.map(r => r.lectureId)
  });
};

exports.calculateAttendanceForLecture = async (req, res) => {
  const { lectureId } = req.params;
  const records = await Attendance.find({ lectureId })
    .populate('studentId', 'name');
  res.json({
    lectureId,
    count: records.length,
    students: records.map(r => r.studentId)
  });
};
