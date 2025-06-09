const StudentExam = require("../../models/nosql/studentExamReadModel");

exports.addGrade = async (req, res) => {
  const grade = await StudentExam.create(req.body);
  res.status(201).json(grade);
};

exports.removeGrade = async (req, res) => {
  await StudentExam.deleteOne({
    studentId: req.body.studentId,
    examId: req.body.examId
  });
  res.sendStatus(204);
};

exports.changeGrade = async (req, res) => {
  await StudentExam.updateOne(
    { studentId: req.body.studentId, examId: req.body.examId },
    { score: req.body.score }
  );
  res.sendStatus(200);
};

exports.seeGradesTeacher = async (req, res) => {
  const grades = await StudentExam.find()
    .populate("studentId", "name email")
    .populate("examId", "title date");
  res.json(grades);
};

exports.seeGradesStudent = async (req, res) => {
  const grades = await StudentExam.find({ studentId: req.params.id })
    .populate("examId", "title date");
  res.json(grades);
};
