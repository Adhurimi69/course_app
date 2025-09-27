// backend/controllers/commands/uploadCommandController.js
const Upload = require("../../models/sql/upload");
const Student = require("../../models/sql/student");
const Lecture = require("../../models/sql/lecture");
const Assignment = require("../../models/sql/assignment");
const uploadMiddleware = require("../../middleware/uploadMiddleware");
const fs = require("fs");
const path = require("path");

// Upload a file (lecture or assignment)
exports.uploadDoc = (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const upload = await Upload.create({
        file: req.file.filename, // store only the file name
        timeUploaded: new Date(),
        lectureId: req.body.lectureId || null,
        assignmentId: req.body.assignmentId || null,
        studentId: req.body.studentId || null,
      });

      // Optionally: trigger background sync to Mongo here if needed

      res.status(201).json(upload);
    } catch (e) {
      console.error("Error creating upload:", e);
      res.status(500).json({ error: e.message });
    }
  });
};

// Delete a file
exports.deleteDoc = async (req, res) => {
  try {
    const upload = await Upload.findByPk(req.params.id);
    if (!upload) return res.status(404).json({ error: "Upload not found" });

    // Delete physical file
    const filePath = path.join(
      process.cwd(), // safer than __dirname for dynamic paths
      "uploads",
      upload.lectureId ? "lectures" : "assignments",
      upload.file
    );

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await upload.destroy();
    res.sendStatus(204);
  } catch (e) {
    console.error("Error deleting upload:", e);
    res.status(500).json({ error: e.message });
  }
};

// Fetch a single upload with details
exports.fetchUpload = async (req, res) => {
  try {
    const upload = await Upload.findByPk(req.params.id, {
      include: [
        { model: Student, attributes: ["id", "name", "email"] },
        { model: Lecture, attributes: ["id", "title"] },
        { model: Assignment, attributes: ["id", "title", "dueDate"] },
      ],
    });

    if (!upload) return res.status(404).json({ error: "Upload not found" });
    res.json(upload);
  } catch (e) {
    console.error("Error fetching upload:", e);
    res.status(500).json({ error: e.message });
  }
};
