// backend/controllers/queries/uploadQueryController.js
const Upload = require("../../models/nosql/uploadReadModel");
const Student = require("../../models/nosql/studentReadModel");
const Assignment = require("../../models/nosql/assignmentReadModel");
const Lecture = require("../../models/nosql/lectureReadModel");

// Fetch a single upload with populated references
exports.fetchUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("assignmentId", "title dueDate")
      .populate("lectureId", "title");

    if (!upload) return res.status(404).json({ error: "Upload not found" });
    res.json(upload);
  } catch (e) {
    console.error("Error fetching upload:", e);
    res.status(500).json({ error: "Failed to fetch upload" });
  }
};

// List all uploads with populated references
exports.listUploads = async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate("studentId", "name email")
      .populate("assignmentId", "title dueDate")
      .populate("lectureId", "title")
      .sort({ timeUploaded: -1 }); // newest first for performance

    res.json(uploads);
  } catch (e) {
    console.error("Error listing uploads:", e);
    res.status(500).json({ error: "Failed to list uploads" });
  }
};
