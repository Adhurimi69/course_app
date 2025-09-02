const { Op } = require("sequelize");
const StudentCourse = require('../../models/sql/studentCourse');
const Course = require('../../models/sql/course');
const Student = require('../../models/sql/student');

exports.fetchCourses = async (req, res) => {
  const courses = await Course.findAll({
    attributes: ['id', 'title', 'departmentId']
  });
  res.json(courses);
};

exports.fetchStudents = async (req, res) => {
  const students = await Student.findAll({
    attributes: ['id', 'name', 'email']
  });
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
      {
        model: Student,
        attributes: ['id', 'name', 'email']
      },
      {
        model: Course,
        attributes: ['id', 'title']
      }
    ]
  });
  res.json(entries);
};

exports.enrollWithCourseKey = async (req, res) => {
  const { studentId, courseId, key } = req.body;
  if (!studentId || !courseId || key == null) {
    return res.status(400).json({ message: "studentId, courseId and key are required" });
  }

  try {
    const [student, course] = await Promise.all([
      Student.findByPk(studentId, { attributes: ["id", "name", "email"] }),
      Course.findByPk(courseId,  { attributes: ["id", "title", "departmentId", "enrollmentKey"] }),
    ]);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!course)  return res.status(404).json({ message: "Course not found" });

    // Validate like a password (plain compare)
    if (course.enrollmentKey && course.enrollmentKey !== key) {
      return res.status(403).json({ message: "Invalid enrollment key" });
    }
    // If course.enrollmentKey is null, treat as open-enrollment (optional).

    let entry;
    try {
      entry = await StudentCourse.create({ studentId, courseId });
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        return res.status(409).json({ message: "Student already enrolled in this course" });
      }
      throw e;
    }

    return res.status(201).json({
      student,
      course: { id: course.id, title: course.title, departmentId: course.departmentId },
      enrolledAt: entry.createdAt,
    });
  } catch (err) {
    console.error("EnrollWithCourseKey error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
