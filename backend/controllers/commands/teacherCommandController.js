const Teacher = require("../../models/sql/teacher");
const { TeacherReadModel } = require("../../models/nosql/teacherReadModel");

const createTeacher = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields (name, email, password, role) are required",
      });
    }

    const existingTeacher = await Teacher.findOne({ where: { email } });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ message: "Teacher already exists with this email" });
    }

    const newTeacher = await Teacher.create({ name, email, password, role });

    // Sync to MongoDB (NEVER include password!)
    await TeacherReadModel.create({
      teacherId: newTeacher.id,
      name: newTeacher.name,
      email: newTeacher.email,
      role: newTeacher.role,
    });

    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields except password (optional on update)
    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Name, email, and role are required",
      });
    }

    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.name = name;
    teacher.email = email;
    teacher.role = role;

    // Update password only if provided
    if (password) {
      teacher.password = password;
    }

    await teacher.save();

    // Update MongoDB read model (don't store password there)
    await TeacherReadModel.findOneAndUpdate(
      { teacherId: teacher.id },
      {
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
      }
    );

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await teacher.destroy();

    await TeacherReadModel.deleteOne({ teacherId: teacher.id });

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
