const StudentCourse = require('../../models/nosql/studentCourseReadModel');

exports.create = async (req, res) => {
  const entry = await StudentCourse.create(req.body);
  res.status(201).json(entry);
};

exports.delete = async (req, res) => {
  const { studentId, courseId } = req.body;
  await StudentCourse.deleteOne({ studentId, courseId });
  res.sendStatus(204);
};

exports.fetchCourses = async (req, res) => {
  const courses = await require('../models/course.model').find();
  res.json(courses);
};

exports.fetchStudents = async (req, res) => {
  const students = await require('../models/student.model').find();
  res.json(students);
};

exports.list = async (req, res) => {
  const entries = await StudentCourse.find()
    .populate('studentId', 'name email')
    .populate('courseId', 'title');
  res.json(entries);
};
