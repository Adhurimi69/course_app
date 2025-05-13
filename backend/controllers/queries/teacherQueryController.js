const { TeacherReadModel } = require("../../models/nosql/teacherReadModel");

const getTeachers = async (req, res) => {
  try {
    const teachers = await TeacherReadModel.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await TeacherReadModel.findOne({
      teacherId: req.params.id,
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
};
