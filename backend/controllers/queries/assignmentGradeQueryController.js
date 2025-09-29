const AssignmentGrade = require('../../models/nosql/assignmentGradeReadModel');

exports.addGrade = async (req, res) => {
  const grade = await AssignmentGrade.create(req.body);
  res.status(201).json(grade);
};

exports.removeGrade = async (req, res) => {
  await AssignmentGrade.deleteOne({
    studentId: req.body.studentId,
    assignmentId: req.body.assignmentId
  });
  res.sendStatus(204);
};

exports.changeGrade = async (req, res) => {
  await AssignmentGrade.updateOne(
    { studentId: req.body.studentId, assignmentId: req.body.assignmentId },
    { score: req.body.score }
  );
  res.sendStatus(200);
};

exports.seeGradesTeacher = async (req, res) => {
  // populate the read-models and include the original SQL id fields (assignmentId, studentId)
  const grades = await AssignmentGrade.find()
    .populate('assignmentId', 'assignmentId title dueDate courseId')
    .populate('studentId', 'studentId name email');
  res.json(grades);
};

exports.seeGradesStudent = async (req, res) => {
  const grades = await AssignmentGrade.find({ studentId: req.params.id })
    .populate('assignmentId', 'assignmentId title dueDate courseId')
    .populate('studentId', 'studentId name email');
  res.json(grades);
};
