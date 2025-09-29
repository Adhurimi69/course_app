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

exports.fetchStudentsForCourse = async (req, res) => {
  const mongoose = require('mongoose');
  const { courseId } = req.params;
  if (!courseId) return res.status(400).json({ error: 'courseId required' });

  try {
    let courseObjectId = null;

    // If the caller passed an ObjectId string, use it directly.
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      courseObjectId = courseId;
    } else {
      // Otherwise assume the caller passed the SQL courseId (number).
      // Resolve to the CourseReadModel _id first.
      const CourseRead = require('../../models/nosql/courseReadModel');
      const courseDoc = await CourseRead.CourseReadModel.findOne({ courseId: Number(courseId) });
      if (!courseDoc) return res.status(404).json({ error: 'course not found in read model' });
      courseObjectId = courseDoc._id;
    }

    const entries = await StudentCourse.find({ courseId: courseObjectId })
      .populate({ path: 'studentId', model: 'StudentReadModel', select: 'name email studentId' })
      .populate({ path: 'courseId', model: 'CourseReadModel', select: 'title courseId' });

    // return an array of student objects (populated studentId)
    const students = entries.map(e => e.studentId).filter(Boolean);
    return res.json(students);
  } catch (err) {
    console.error('fetchStudentsForCourse error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'internal error fetching students for course' });
  }
};

// Fallback: fetch enrolled students from SQL StudentCourse join (when read-models are empty)
exports.fetchStudentsForCourseSQL = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) return res.status(400).json({ error: 'courseId required' });
    // Use Sequelize model to find enrollments
    const StudentCourseSQL = require('../../models/sql/studentCourse');
    const StudentSQL = require('../../models/sql/student');
    const CourseSQL = require('../../models/sql/course');

    // find all student entries for courseId
    const entries = await StudentCourseSQL.findAll({
      where: { courseId: Number(courseId) },
      include: [{ model: StudentSQL, attributes: ['id', 'name', 'email'] }],
    });
    const students = entries.map(e => ({ id: e.Student?.id || e.studentId, name: e.Student?.name, email: e.Student?.email }));
    return res.json(students);
  } catch (err) {
    console.error('fetchStudentsForCourseSQL error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'internal error fetching students (sql)' });
  }
};
