const Upload = require('../../models/sql/upload');
const Student = require('../../models/sql/student');
const Assignment = require('../../models/sql/assignment');

exports.uploadDoc = async (req, res) => {
  const upload = await Upload.create({
    file: req.body.file,
    timeUploaded: new Date(),
    studentId: req.body.studentId,         // optional
    assignmentId: req.body.assignmentId    // optional
  });
  res.status(201).json(upload);
};

exports.deleteDoc = async (req, res) => {
  await Upload.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
};

exports.fetchUpload = async (req, res) => {
  const upload = await Upload.findByPk(req.params.id, {
    include: [
      { model: Student, attributes: ['id', 'name', 'email'] },
      { model: Assignment, attributes: ['id', 'title', 'dueDate'] }
    ]
  });
  res.json(upload);
};

exports.listUploads = async (req, res) => {
  const uploads = await Upload.findAll({
    include: [
      { model: Student, attributes: ['id', 'name', 'email'] },
      { model: Assignment, attributes: ['id', 'title', 'dueDate'] }
    ]
  });
  res.json(uploads);
};
