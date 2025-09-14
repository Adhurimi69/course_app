// Get courses NOT enrolled by student
exports.getAvailableCourses = async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) {
    return res.status(400).json({ message: "studentId is required" });
  }
  try {
    // Find all courseIds the student is enrolled in
    const enrolled = await StudentCourse.findAll({
      where: { studentId },
      attributes: ['courseId']
    });
    console.log('Enrolled course IDs:', enrolled.map(e => e.courseId));
    const enrolledIds = enrolled.map(e => e.courseId);
    // Find all courses NOT in enrolledIds
    const availableCoursesRaw = await Course.findAll({
      where: enrolledIds.length > 0 ? { id: { [Op.notIn]: enrolledIds } } : {},
      attributes: ['id', 'title', 'departmentId', 'enrollment_key']
    });
    // Map to hasEnrollmentKey boolean and remove enrollment_key
    const availableCourses = availableCoursesRaw.map(course => ({
      id: course.id,
      title: course.title,
      departmentId: course.departmentId,
      hasEnrollmentKey: !!course.enrollment_key
    }));
    console.log('Available courses raw:', JSON.stringify(availableCourses, null, 2));
    res.json(availableCourses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching available courses", error: err.message });
  }
};
const { Op } = require("sequelize");
const StudentCourse = require('../../models/sql/studentCourse');
const Course = require('../../models/sql/course');
const Student = require('../../models/sql/student');

exports.fetchCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({ attributes: ['id', 'title', 'departmentId'] });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
};

exports.fetchStudents = async (req, res) => {
  try {
    const students = await Student.findAll({ attributes: ['id', 'name', 'email'] });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const entry = await StudentCourse.create({ studentId, courseId });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Error creating entry", error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    await StudentCourse.destroy({ where: { studentId, courseId } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Error deleting entry", error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const entries = await StudentCourse.findAll({
      include: [
        { model: Student, attributes: ['id', 'name', 'email'] },
        { model: Course, attributes: ['id', 'title'] }
      ]
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Error listing entries", error: err.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) {
    return res.status(400).json({ message: "studentId is required" });
  }
  try {
    const enrolledCourses = await StudentCourse.findAll({
      where: { studentId },
      include: [
        { model: Course, attributes: ['id', 'title', 'departmentId'] }
      ]
    });
    console.log('Enrolled courses raw:', JSON.stringify(enrolledCourses, null, 2));
    res.json(enrolledCourses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching enrolled courses", error: err.message });
  }
};

exports.enrollWithCourseKey = async (req, res) => {
  const { studentId, courseId, key } = req.body;
  if (!studentId || !courseId) {
    return res.status(400).json({ message: "studentId and courseId are required" });
  }
  try {
    const [student, course] = await Promise.all([
      Student.findByPk(studentId, { attributes: ["id", "name", "email"] }),
      Course.findByPk(courseId,  { attributes: ["id", "title", "departmentId", "enrollment_key"] }),
    ]);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!course)  return res.status(404).json({ message: "Course not found" });
    // If enrollment_key is null, auto-enroll
    if (course.enrollment_key == null) {
      const entry = await StudentCourse.create({ studentId, courseId });
      return res.status(201).json(entry);
    }
    // If enrollment_key is set, require key and check
    if (!key) {
      return res.status(400).json({ message: "Enrollment key required for this course" });
    }
    if (course.enrollment_key !== key) {
      return res.status(403).json({ message: "Invalid enrollment key" });
    }
    const entry = await StudentCourse.create({ studentId, courseId, enrollmentKey: key });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Error enrolling with course key", error: err.message });
  }
}
