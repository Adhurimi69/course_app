const AssignmentGrade = require('../../models/sql/assignemntGrade');
const Assignment = require('../../models/sql/assignment');
const Student = require('../../models/sql/student');

exports.addGrade = async (req, res) => {
  const grade = await AssignmentGrade.create(req.body);
  res.status(201).json(grade);
};

exports.removeGrade = async (req, res) => {
  await AssignmentGrade.destroy({
    where: { studentId: req.body.studentId, assignmentId: req.body.assignmentId }
  });
  res.sendStatus(204);
};

exports.changeGrade = async (req, res) => {
  await AssignmentGrade.update({ score: req.body.score }, {
    where: { studentId: req.body.studentId, assignmentId: req.body.assignmentId }
  });
  res.sendStatus(200);
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
