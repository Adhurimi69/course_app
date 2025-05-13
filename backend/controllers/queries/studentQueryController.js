const { StudentReadModel } = require("../../models/nosql/studentReadModel");

const getStudents = async (req, res) => {
  try {
    const students = await StudentReadModel.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await StudentReadModel.findOne({
      studentId: req.params.id,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
};
