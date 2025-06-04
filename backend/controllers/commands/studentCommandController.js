const Student = require("../../models/sql/student");
const { StudentReadModel } = require("../../models/nosql/studentReadModel");

const bcrypt = require("bcryptjs");

const createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields (name, email, password) are required",
      });
    }

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student already exists with this email" });
    }

    const newStudent = await Student.create({
      name,
      email,
      password,
      role: "student", // assign role internally
    });

    // Sync to MongoDB (NEVER include password!)
    await StudentReadModel.create({
      studentId: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      role: newStudent.role,
    });

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateStudent = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields (name, email, password, role) are required",
      });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }


    student.name = name;
    student.email = email;
    student.password = password;
    student.role = role;

    await student.save();

    await StudentReadModel.findOneAndUpdate(
      { studentId: student.id },
      {
        name: student.name,
        email: student.email,
        role: student.role,
      }
    );

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.destroy();

    await StudentReadModel.deleteOne({ studentId: student.id });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
};
