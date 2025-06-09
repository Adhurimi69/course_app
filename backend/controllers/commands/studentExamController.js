const StudentExam = require("../../models/sql/studentExam");
const Student = require("../../models/sql/student");
const Exam = require("../../models/sql/exam");

exports.addGrade = async (req, res) => {
  const grade = await StudentExam.create(req.body);
  res.status(201).json(grade);
};

exports.removeGrade = async (req, res) => {
  await StudentExam.destroy({
    where: { studentId: req.body.studentId, examId: req.body.examId }
  });
  res.sendStatus(204);
};

exports.changeGrade = async (req, res) => {
  await StudentExam.update({ score: req.body.score }, {
    where: { studentId: req.body.studentId, examId: req.body.examId }
  });
  res.sendStatus(200);
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
