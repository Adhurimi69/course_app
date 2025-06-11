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
// Fetch enrolled courses for a student
// In studentCourseController.js

// const Student = require('../../models/sql/student');
// const Course = require('../../models/sql/course');

exports.getEnrolledCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrolledCourses = await student.getCourses(); // Sequelize auto-generated method
    res.json(enrolledCourses);
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getAvailableCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrolledCourses = await student.getCourses();
    const enrolledIds = enrolledCourses.map((c) => c.id);

    const { Op } = require("sequelize");
    const availableCourses = await Course.findAll({
      where: {
        id: { [Op.notIn]: enrolledIds }
      }
    });

    res.json(availableCourses);
  } catch (err) {
    console.error("Error fetching available courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
