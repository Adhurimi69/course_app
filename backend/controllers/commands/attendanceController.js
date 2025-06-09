const Attendance = require('../../models/sql/attendance');
const Student = require('../../models/sql/student');
const Course = require('../../models/sql/course');
const Lecture = require('../../models/sql/lecture');

exports.addAttendance = async (req, res) => {
  const record = await Attendance.create(req.body);
  res.status(201).json(record);
};

exports.calculateAttendanceForStudent = async (req, res) => {
  const { studentId, courseId } = req.params;
  const records = await Attendance.findAll({
    where: { studentId, courseId },
    include: [{ model: Lecture, attributes: ['id', 'title'] }]
  });
  res.json({
    studentId,
    courseId,
    count: records.length,
    lectures: records.map(r => r.Lecture)
  });
};

exports.calculateAttendanceForLecture = async (req, res) => {
  const { lectureId } = req.params;
  const records = await Attendance.findAll({
    where: { lectureId },
    include: [{ model: Student, attributes: ['id', 'name'] }]
  });
  res.json({
    lectureId,
    count: records.length,
    students: records.map(r => r.Student)
  });
};
