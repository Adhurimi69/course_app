const Assignment = require("../../models/sql/assignment");
const Lecture = require("../../models/sql/lecture");
const {
  AssignmentReadModel,
} = require("../../models/nosql/assignmentReadModel");

const createAssignment = async (req, res) => {
  try {
    const { title, dueDate, lectureId } = req.body;

    if (!title || !lectureId) {
      return res
        .status(400)
        .json({ error: "Title and lectureId are required." });
    }

    const lecture = await Lecture.findByPk(lectureId);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found." });
    }

    const newAssignment = await Assignment.create({
      title,
      dueDate,
      lectureId,
    });

    // Sync to MongoDB
    await AssignmentReadModel.create({
      assignmentId: newAssignment.id,
      title: newAssignment.title,
      dueDate: newAssignment.dueDate,
      lectureId: lecture.id,
      lectureTitle: lecture.title,
      courseId: lecture.courseId, // assuming lecture has courseId
      courseTitle: "Course title placeholder", // You would fetch course title if needed
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

    // Also update Mongo
    await AssignmentReadModel.findOneAndUpdate(
      { assignmentId: assignment.id },
      {
        title: assignment.title,
        dueDate: assignment.dueDate,
        lectureId: assignment.lectureId,
      }
    );

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
    await AssignmentReadModel.deleteOne({ assignmentId: assignment.id });

    res.json({ message: "Assignment deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
