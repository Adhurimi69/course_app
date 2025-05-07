const {
  AssignmentReadModel,
} = require("../../models/nosql/assignmentReadModel");

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignmentReadModel.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await AssignmentReadModel.findOne({
      assignmentId: req.params.id,
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
};
