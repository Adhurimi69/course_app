const Assignment = require('../../models/sql/assignment');
const Lecture = require('../../models/sql/lecture');
const AssignmentGrade = require('../../models/sql/assignemntGrade');
const Exam = require('../../models/sql/exam');
const StudentExam = require('../../models/sql/studentExam');
const Grade = require('../../models/sql/grade');

// Mongo read-models
const StudentRead = require('../../models/nosql/studentReadModel');
const CourseRead = require('../../models/nosql/courseReadModel');
const GradeRead = require('../../models/nosql/gradeReadModel');

async function computeCourseScore(courseId, studentId) {
  if (!courseId || !studentId) throw new Error('courseId and studentId are required');
  // 1) Fetch assignments for the course -> via Lecture join
  const assignments = await Assignment.findAll({
    include: [{ model: Lecture, attributes: ['id', 'courseId'], where: { courseId } }]
  });
  const assignmentIds = assignments.map(a => a.id);
  const totalAssignmentPoints = assignments.reduce((sum, a) => sum + (a.points != null ? Number(a.points) : 0), 0);

  // 2) Fetch student's assignment grades for those assignments
  let studentAssignmentPoints = 0;
  if (assignmentIds.length > 0) {
    const ags = await AssignmentGrade.findAll({ where: { studentId, assignmentId: assignmentIds } });
    // map by assignmentId for quick lookup
    const agMap = {};
    ags.forEach(g => { agMap[String(g.assignmentId)] = g.score != null ? Number(g.score) : 0; });
    assignments.forEach(a => {
      const sid = String(a.id);
      const sscore = agMap[sid] != null ? agMap[sid] : 0;
      studentAssignmentPoints += Number(sscore || 0);
    });
  }

  // 3) Fetch exams for the course
  const exams = await Exam.findAll({ where: { courseId } });
  const examIds = exams.map(e => e.id);
  const totalExamPoints = exams.reduce((sum, e) => sum + (e.points != null ? Number(e.points) : 0), 0);

  // 4) Fetch student's exam grades for those exams
  let studentExamPoints = 0;
  if (examIds.length > 0) {
    const ses = await StudentExam.findAll({ where: { studentId, examId: examIds } });
    const seMap = {};
    ses.forEach(s => { seMap[String(s.examId)] = s.score != null ? Number(s.score) : 0; });
    exams.forEach(e => {
      const key = String(e.id);
      const sscore = seMap[key] != null ? seMap[key] : 0;
      studentExamPoints += Number(sscore || 0);
    });
  }

  const totalPoints = totalAssignmentPoints + totalExamPoints;
  const studentPoints = studentAssignmentPoints + studentExamPoints;
  const percent = totalPoints > 0 ? (studentPoints / totalPoints) * 100 : 0;
  const rounded = Math.round(percent * 100) / 100; // two decimals

  // persist into SQL Grade (create or update)
  try {
    const existing = await Grade.findOne({ where: { studentId, courseId } });
    if (existing) {
      await Grade.update({ score: rounded }, { where: { studentId, courseId } });
    } else {
      await Grade.create({ studentId, courseId, score: rounded });
    }
  } catch (e) {
    console.error('Failed to persist SQL Grade', e?.message || e);
  }

  // update read-model GradeRead
  try {
    const studentDoc = await StudentRead.StudentReadModel.findOne({ studentId });
    const courseDoc = await CourseRead.CourseReadModel.findOne({ courseId });
    if (studentDoc && courseDoc) {
      await GradeRead.updateOne({ studentId: studentDoc._id, courseId: courseDoc._id }, { score: rounded }, { upsert: true });
    }
  } catch (e) {
    console.error('Failed to persist GradeRead', e?.message || e);
  }

  return { totalPoints, studentPoints, percent: rounded };
}

module.exports = { computeCourseScore };
