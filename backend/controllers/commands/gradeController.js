const Grade = require('../../models/sql/grade');
const Student = require('../../models/sql/student');
const Course = require('../../models/sql/course');

// Mongo read-models
const GradeRead = require('../../models/nosql/gradeReadModel');
const StudentRead = require('../../models/nosql/studentReadModel');
const CourseRead = require('../../models/nosql/courseReadModel');

exports.addGrade = async (req, res) => {
  try {
    const { studentId, courseId, score } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (courseId == null) return res.status(400).json({ error: 'courseId is required' });
    const nScore = Number(score);
    if (isNaN(nScore) || nScore < 0 || nScore > 100) return res.status(400).json({ error: 'score must be a number between 0 and 100' });

    const grade = await Grade.create({ studentId, courseId, score: nScore });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId: req.body.studentId });
      const courseDoc = await CourseRead.CourseReadModel.findOne({ courseId: req.body.courseId });
      if (studentDoc && courseDoc) {
        await GradeRead.create({ studentId: studentDoc._id, courseId: courseDoc._id, score: nScore });
      }
    } catch (e) {
      console.error('Failed to sync grade read-model:', e.message);
    }
    return res.status(201).json(grade);
  } catch (err) {
    console.error('addGrade error', err?.message || err);
    return res.status(500).json({ error: 'Failed to create grade', details: err?.message });
  }
};

exports.removeGrade = async (req, res) => {
  try {
    const { studentId, courseId } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (courseId == null) return res.status(400).json({ error: 'courseId is required' });
    const destroyed = await Grade.destroy({ where: { studentId, courseId } });
    if (!destroyed) return res.status(404).json({ error: 'grade not found' });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
      const courseDoc = await CourseRead.CourseReadModel.findOne({ courseId });
      if (studentDoc && courseDoc) {
        await GradeRead.deleteOne({ studentId: studentDoc._id, courseId: courseDoc._id });
      }
    } catch (e) {
      console.error('Failed to delete grade read-model:', e.message);
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error('removeGrade error', err?.message || err);
    return res.status(500).json({ error: 'Failed to remove grade', details: err?.message });
  }
};

exports.changeGrade = async (req, res) => {
  try {
    const { studentId, courseId, score } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (courseId == null) return res.status(400).json({ error: 'courseId is required' });
    const nScore = Number(score);
    if (isNaN(nScore) || nScore < 0 || nScore > 100) return res.status(400).json({ error: 'score must be a number between 0 and 100' });

    const [affected] = await Grade.update({ score: nScore }, {
      where: { studentId, courseId }
    });
    if (!affected) return res.status(404).json({ error: 'grade not found' });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
      const courseDoc = await CourseRead.CourseReadModel.findOne({ courseId });
      if (studentDoc && courseDoc) {
        await GradeRead.updateOne({ studentId: studentDoc._id, courseId: courseDoc._id }, { score: nScore }, { upsert: true });
      }
    } catch (e) {
      console.error('Failed to sync grade read-model update:', e.message);
    }
    return res.sendStatus(200);
  } catch (err) {
    console.error('changeGrade error', err?.message || err);
    return res.status(500).json({ error: 'Failed to change grade', details: err?.message });
  }
};

exports.seegradeTeacher = async (req, res) => {
  const grade = await Grade.findAll({
    include: [
      { model: Student, attributes: ['id', 'name', 'email'] },
      { model: Course, attributes: ['id', 'title'] }
    ]
  });
  res.json(grade);
};

exports.seegradeStudent = async (req, res) => {
  const grade = await Grade.findAll({
    where: { studentId: req.params.id },
    include: [{ model: Course, attributes: ['id', 'title'] }]
  });
  res.json(grade);
};
