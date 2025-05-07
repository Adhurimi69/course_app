const Assignment = require("../models/Assignment");
const Lecture = require("../models/Lecture");

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [{ model: Lecture }],
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [{ model: Lecture }],
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { title, dueDate, lectureId } = req.body;

    if (!title || !lectureId) {
      return res
        .status(400)
        .json({ error: "Title and lectureId are required fields." });
    }

    const newAssignment = await Assignment.create({
      title,
      dueDate,
      lectureId,
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { title, dueDate, lectureId } = req.body;

    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    assignment.title = title || assignment.title;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.lectureId = lectureId || assignment.lectureId;

    await assignment.save();

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    await assignment.destroy();

    res.json({ message: "Assignment deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
