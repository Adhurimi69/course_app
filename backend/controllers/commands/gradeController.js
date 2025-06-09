const Grade = require('../../models/sql/grade');
const Student = require('../../models/sql/student');
const Course = require('../../models/sql/course');

exports.addGrade = async (req, res) => {
  const grade = await Grade.create(req.body);
  res.status(201).json(grade);
};

exports.removeGrade = async (req, res) => {
  await Grade.destroy({ where: { studentId: req.body.studentId, courseId: req.body.courseId } });
  res.sendStatus(204);
};

exports.changeGrade = async (req, res) => {
  await Grade.update({ score: req.body.score }, {
    where: { studentId: req.body.studentId, courseId: req.body.courseId }
  });
  res.sendStatus(200);
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
