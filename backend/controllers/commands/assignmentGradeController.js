const AssignmentGrade = require('../../models/sql/assignemntGrade');
const Assignment = require('../../models/sql/assignment');
const Student = require('../../models/sql/student');

// read-models (Mongo) for syncing queries
const AssignmentGradeRead = require('../../models/nosql/assignmentGradeReadModel');
const StudentRead = require('../../models/nosql/studentReadModel');
const AssignmentRead = require('../../models/nosql/assignmentReadModel');
const { computeCourseScore } = require('./computeCourseScore');

exports.addGrade = async (req, res) => {
  try {
    const { studentId, assignmentId, score } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (assignmentId == null) return res.status(400).json({ error: 'assignmentId is required' });
    const nScore = Number(score);
    if (isNaN(nScore) || nScore < 0) return res.status(400).json({ error: 'score must be a non-negative number' });

    // validate against assignment max points if available
    try {
      const Assignment = require('../../models/sql/assignment');
      const assignmentRow = await Assignment.findByPk(assignmentId);
      if (assignmentRow && assignmentRow.points != null) {
        const max = Number(assignmentRow.points);
        if (!isNaN(max) && nScore > max) return res.status(400).json({ error: `score cannot exceed assignment points (${max})` });
      }
    } catch (e) {
      console.debug('assignment points lookup failed', e?.message || e);
    }

  const grade = await AssignmentGrade.create({ studentId, assignmentId, score: nScore });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
      const assignmentDoc = await AssignmentRead.AssignmentReadModel.findOne({ assignmentId });
      if (studentDoc && assignmentDoc) {
        await AssignmentGradeRead.create({ studentId: studentDoc._id, assignmentId: assignmentDoc._id, score: nScore });
      }
    } catch (e) {
      console.error('Failed to sync assignment grade read-model:', e.message);
    }
    // recompute course score for this student in background (best-effort)
    try {
      // need the course id: fetch assignment to get lecture/course via include
      const Assignment = require('../../models/sql/assignment');
      const Lecture = require('../../models/sql/lecture');
      const a = await Assignment.findByPk(assignmentId, { include: [{ model: Lecture, attributes: ['courseId'] }] });
      const courseId = a && a.Lecture ? a.Lecture.courseId : null;
      if (courseId) {
        try {
          await computeCourseScore(courseId, studentId);
        } catch (e) {
          console.error('computeCourseScore failed', e?.message || e);
        }
      }
    } catch (e) {
      console.debug('computeCourseScore scheduling failed', e?.message || e);
    }
    return res.status(201).json(grade);
  } catch (err) {
    console.error('addGrade error', err?.message || err);
    return res.status(500).json({ error: 'Failed to create assignment grade', details: err?.message });
  }
};

exports.removeGrade = async (req, res) => {
  try {
    const { studentId, assignmentId } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (assignmentId == null) return res.status(400).json({ error: 'assignmentId is required' });
  const destroyed = await AssignmentGrade.destroy({ where: { studentId, assignmentId } });
    if (!destroyed) return res.status(404).json({ error: 'assignment grade not found' });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
      const assignmentDoc = await AssignmentRead.AssignmentReadModel.findOne({ assignmentId });
      if (studentDoc && assignmentDoc) {
        await AssignmentGradeRead.deleteOne({ studentId: studentDoc._id, assignmentId: assignmentDoc._id });
      }
    } catch (e) {
      console.error('Failed to delete assignment grade read-model:', e.message);
    }
    // recompute course score in background
    try {
      const Assignment = require('../../models/sql/assignment');
      const Lecture = require('../../models/sql/lecture');
      const a = await Assignment.findByPk(assignmentId, { include: [{ model: Lecture, attributes: ['courseId'] }] });
      const courseId = a && a.Lecture ? a.Lecture.courseId : null;
      if (courseId) {
        try {
          await computeCourseScore(courseId, studentId);
        } catch (e) {
          console.error('computeCourseScore failed', e?.message || e);
        }
      }
    } catch (e) {
      console.debug('computeCourseScore scheduling failed', e?.message || e);
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error('removeGrade error', err?.message || err);
    return res.status(500).json({ error: 'Failed to remove assignment grade', details: err?.message });
  }
};

exports.changeGrade = async (req, res) => {
  try {
    const { studentId, assignmentId, score } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (assignmentId == null) return res.status(400).json({ error: 'assignmentId is required' });
    const nScore = Number(score);
    if (isNaN(nScore) || nScore < 0) return res.status(400).json({ error: 'score must be a non-negative number' });

    const [affected] = await AssignmentGrade.update({ score: nScore }, {
      where: { studentId, assignmentId }
    });
    if (!affected) return res.status(404).json({ error: 'assignment grade not found' });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
      const assignmentDoc = await AssignmentRead.AssignmentReadModel.findOne({ assignmentId });
      if (studentDoc && assignmentDoc) {
        await AssignmentGradeRead.updateOne({ studentId: studentDoc._id, assignmentId: assignmentDoc._id }, { score: nScore }, { upsert: true });
      }
    } catch (e) {
      console.error('Failed to sync assignment grade read-model update:', e.message);
    }
    return res.sendStatus(200);
  } catch (err) {
    console.error('changeGrade error', err?.message || err);
    return res.status(500).json({ error: 'Failed to change assignment grade', details: err?.message });
  }
};

exports.seeGradesTeacher = async (req, res) => {
  const grades = await AssignmentGrade.findAll({
    include: [
      { model: Assignment, attributes: ['id', 'title', 'dueDate'] },
      { model: Student, attributes: ['id', 'name'] }
    ]
  });
  res.json(grades);
};

exports.seeGradesStudent = async (req, res) => {
  const grades = await AssignmentGrade.findAll({
    where: { studentId: req.params.id },
    include: [{ model: Assignment, attributes: ['id', 'title', 'dueDate'] }]
  });
  res.json(grades);
};
