const Upload = require("../../models/sql/upload");
const Student = require("../../models/sql/student");
const Lecture = require("../../models/sql/lecture");
const Assignment = require("../../models/sql/assignment");
const UploadReadModel = require("../../models/nosql/uploadReadModel");
const uploadMiddleware = require("../../middleware/uploadMiddleware");
const fs = require("fs");
const path = require("path");

// ===== Helper to determine folder =====
const getUploadFolder = (upload) => {
  if (upload.lectureId) return "lectures";
  if (upload.assignmentId) return "assignments";
  return "misc";
};

// ===== Helper: delete uploads (single or bulk) =====
const deleteUploads = async (filter) => {
  const uploads = await Upload.findAll({ where: filter });

  for (const upload of uploads) {
    // Determine folder
    const folder = getUploadFolder(upload);

    // Delete file from disk
    const filePath = path.join(process.cwd(), "uploads", folder, upload.file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete from SQL
    await upload.destroy();

    // Delete from Mongo
    await UploadReadModel.deleteOne({ file: upload.file });
  }
};

// ===== Upload a file (lecture or assignment) =====
exports.uploadDoc = (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const { lectureId, assignmentId, studentId } = req.body;

      // Ensure upload belongs to either lecture or assignment, not both
      if (lectureId && assignmentId) {
        return res.status(400).json({ error: "Upload must belong to either lecture OR assignment, not both" });
      }

      // Save to SQL (write model)
      const upload = await Upload.create({
        file: req.file.filename,
        timeUploaded: new Date(),
        lectureId: lectureId || null,
        assignmentId: assignmentId || null,
        studentId: studentId || null,
      });

      // Project to MongoDB (read model)
      await UploadReadModel.create({
        file: req.file.filename,
        timeUploaded: upload.timeUploaded,
        lectureId: lectureId || null,
        assignmentId: assignmentId || null,
        studentId: studentId || null,
      });

      res.status(201).json(upload);
    } catch (e) {
      console.error("Error creating upload:", e);
      res.status(500).json({ error: e.message });
    }
  });
};

// ===== Delete a single upload by ID =====
exports.deleteDoc = async (req, res) => {
  try {
    const uploadId = req.params.id;

    const upload = await Upload.findByPk(uploadId);
    if (!upload) return res.status(404).json({ error: "Upload not found" });

    await deleteUploads({ id: uploadId });

    res.sendStatus(204);
  } catch (e) {
    console.error("Error deleting upload:", e);
    res.status(500).json({ error: e.message });
  }
};

// ===== Delete all uploads linked to a lecture, assignment, or student =====
exports.deleteUploadsByFilter = async (filter) => {
  await deleteUploads(filter);
};

// ===== Fetch a single upload (with related models) =====
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

// ===== Export helper for use in lecture/assignment deletion =====
exports.deleteUploads = deleteUploads;
