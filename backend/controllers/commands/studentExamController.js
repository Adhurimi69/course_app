const StudentExam = require("../../models/sql/studentExam");
const Student = require("../../models/sql/student");
const Exam = require("../../models/sql/exam");

// Mongo read-models for syncing
const StudentExamRead = require("../../models/nosql/studentExamReadModel");
const StudentRead = require("../../models/nosql/studentReadModel");
const ExamRead = require("../../models/nosql/examReadModel");
const { computeCourseScore } = require('./computeCourseScore');

exports.addGrade = async (req, res) => {
  try {
    const { studentId, examId, score } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (examId == null) return res.status(400).json({ error: 'examId is required' });
    const nScore = Number(score);
    if (isNaN(nScore) || nScore < 0) return res.status(400).json({ error: 'score must be a non-negative number' });

    // validate against exam max points if available
    try {
      const Exam = require('../../models/sql/exam');
      const examRow = await Exam.findByPk(examId);
      if (examRow && examRow.points != null) {
        const max = Number(examRow.points);
        if (!isNaN(max) && nScore > max) return res.status(400).json({ error: `score cannot exceed exam points (${max})` });
      }
    } catch (e) {
      console.debug('exam points lookup failed', e?.message || e);
    }

  const grade = await StudentExam.create({ studentId, examId, score: nScore });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
      const examDoc = await ExamRead.ExamReadModel.findOne({ examId });
      if (studentDoc && examDoc) {
        await StudentExamRead.create({ studentId: studentDoc._id, examId: examDoc._id, score: nScore });
      }
    } catch (e) {
      console.error('Failed to sync student-exam read-model:', e.message);
    }
    // recompute course score for this student now
    try {
      const Exam = require('../../models/sql/exam');
      const ex = await Exam.findByPk(examId);
      const courseId = ex ? ex.courseId : null;
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
    return res.status(500).json({ error: 'Failed to create student exam grade', details: err?.message });
  }
};

exports.removeGrade = async (req, res) => {
  try {
    const { studentId, examId } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (examId == null) return res.status(400).json({ error: 'examId is required' });
  const destroyed = await StudentExam.destroy({ where: { studentId, examId } });
    if (!destroyed) return res.status(404).json({ error: 'student exam grade not found' });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
      const examDoc = await ExamRead.ExamReadModel.findOne({ examId });
      if (studentDoc && examDoc) {
        await StudentExamRead.deleteOne({ studentId: studentDoc._id, examId: examDoc._id });
      }
    } catch (e) {
      console.error('Failed to delete student-exam read-model:', e.message);
    }
    try {
      const Exam = require('../../models/sql/exam');
      const ex = await Exam.findByPk(examId);
      const courseId = ex ? ex.courseId : null;
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
    return res.status(500).json({ error: 'Failed to remove student exam grade', details: err?.message });
  }
};

exports.changeGrade = async (req, res) => {
  try {
    const { studentId, examId, score } = req.body || {};
    if (studentId == null) return res.status(400).json({ error: 'studentId is required' });
    if (examId == null) return res.status(400).json({ error: 'examId is required' });
    const nScore = Number(score);
    if (isNaN(nScore) || nScore < 0) return res.status(400).json({ error: 'score must be a non-negative number' });

    const [affected] = await StudentExam.update({ score: nScore }, {
      where: { studentId, examId }
    });
    if (!affected) return res.status(404).json({ error: 'student exam grade not found' });
    try {
      const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
      const examDoc = await ExamRead.ExamReadModel.findOne({ examId });
      if (studentDoc && examDoc) {
        await StudentExamRead.updateOne({ studentId: studentDoc._id, examId: examDoc._id }, { score: nScore }, { upsert: true });
      }
    } catch (e) {
      console.error('Failed to sync student-exam read-model update:', e.message);
    }
    try {
      const Exam = require('../../models/sql/exam');
      const ex = await Exam.findByPk(examId);
      const courseId = ex ? ex.courseId : null;
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
    return res.sendStatus(200);
  } catch (err) {
    console.error('changeGrade error', err?.message || err);
    return res.status(500).json({ error: 'Failed to change student exam grade', details: err?.message });
  }
};

exports.seeGradesTeacher = async (req, res) => {
  const grades = await StudentExam.findAll({
    include: [
      { model: Exam, attributes: ['id', 'title', 'date'] },
      { model: Student, attributes: ['id', 'name'] }
    ]
  });
  res.json(grades);
};

exports.seeGradesStudent = async (req, res) => {
  const grades = await StudentExam.findAll({
    where: { studentId: req.params.id },
    include: [{ model: Exam, attributes: ['id', 'title', 'date'] }]
  });
  res.json(grades);
};
