const Assignment = require("../../models/sql/assignment");
const Lecture = require("../../models/sql/lecture");
const {
  AssignmentReadModel,
} = require("../../models/nosql/assignmentReadModel");
const { deleteUploads } = require("../commands/uploadController"); // import the helper

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
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    // 1️⃣ Delete all uploads linked to this assignment (SQL + Mongo + disk)
    await deleteUploads({ assignmentId: assignment.id });

    // 2️⃣ Remove assignment-specific file if exists (optional)
    if (assignment.fileName) { // make sure your assignment model has fileName column
      const filePath = path.join(process.cwd(), "uploads/assignments", assignment.fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // 3️⃣ Delete assignment itself from SQL
    await assignment.destroy();

    // 4️⃣ Delete assignment from Mongo
    await AssignmentReadModel.deleteOne({ assignmentId: assignment.id });

    res.json({ message: "Assignment and all linked uploads deleted successfully." });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
