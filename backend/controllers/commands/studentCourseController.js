const StudentCourse = require('../../models/sql/studentCourse');
const Course = require('../../models/sql/course');
const Student = require('../../models/sql/student');

exports.fetchCourses = async (req, res) => {
  const courses = await Course.findAll();
  res.json(courses);
};

exports.fetchStudents = async (req, res) => {
  const students = await Student.findAll();
  res.json(students);
};

exports.create = async (req, res) => {
  const { studentId, courseId } = req.body;
  const entry = await StudentCourse.create({ studentId, courseId });
  res.status(201).json(entry);
};

exports.delete = async (req, res) => {
  const { studentId, courseId } = req.body;
  await StudentCourse.destroy({ where: { studentId, courseId } });
  res.sendStatus(204);
};

exports.list = async (req, res) => {
  const entries = await StudentCourse.findAll({
    include: [
      { model: Student, attributes: ['id', 'name', 'email'] },
      { model: Course, attributes: ['id', 'title'] }
    ]
  });
  res.json(entries);
};
