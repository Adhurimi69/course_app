const Grade = require('../../models/nosql/gradeReadModel');

exports.addGrade = async (req, res) => {
  const grade = await Grade.create(req.body);
  res.status(201).json(grade);
};

exports.removeGrade = async (req, res) => {
  await Grade.deleteOne({ studentId: req.body.studentId, courseId: req.body.courseId });
  res.sendStatus(204);
};

exports.changeGrade = async (req, res) => {
  await Grade.updateOne(
    { studentId: req.body.studentId, courseId: req.body.courseId },
    { score: req.body.score }
  );
  res.sendStatus(200);
};

exports.seeGradesTeacher = async (req, res) => {
  const grades = await Grade.find()
    .populate('studentId', 'name email')
    .populate('courseId', 'title');
  res.json(grades);
};

exports.seeGradesStudent = async (req, res) => {
  const grades = await Grade.find({ studentId: req.params.id })
    .populate('courseId', 'title');
  res.json(grades);
};
