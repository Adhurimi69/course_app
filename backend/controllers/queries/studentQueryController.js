const { StudentReadModel } = require("../../models/nosql/studentReadModel");

const getStudents = async (req, res) => {
  try {
    const students = await StudentReadModel.find();

    // Map to include `id` = `studentId` for frontend convenience
    const mappedStudents = students.map((student) => ({
      id: student.studentId,   // SQL primary key ID
      name: student.name,
      email: student.email,
      role: student.role,
      // other fields if needed
    }));

    res.status(200).json(mappedStudents);
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

    res.status(200).json({
      id: student.studentId,
      name: student.name,
      email: student.email,
      role: student.role,
      // other fields if needed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getStudents,
  getStudentById,
};
