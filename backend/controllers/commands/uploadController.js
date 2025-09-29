const Upload = require("../../models/sql/upload");
const Student = require("../../models/sql/student");
const Teacher = require("../../models/sql/teacher");
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
  if (upload.examId) return "exams";
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
      const { lectureId, assignmentId } = req.body;

      // Determine studentId or teacherId based on authenticated user role
      let studentId = null;
      let teacherId = null;

      if (req.body.studentId) {
        studentId = req.body.studentId;
      } else if (req.user && req.user.role === 'student' && req.user.id) {
        studentId = req.user.id;
      }

      // If uploader is a teacher, set teacherId automatically (teacher uploads resources)
      if (req.user && req.user.role === 'teacher' && req.user.id) {
        teacherId = req.user.id;
      } else if (req.body.teacherId) {
        teacherId = req.body.teacherId;
      }

      // Ensure upload targets only one resource type (lecture, assignment, or exam)
      if ((!!lectureId + !!assignmentId + !!req.body.examId) > 1) {
        return res.status(400).json({ error: "Upload must belong to only one of: lecture, assignment, or exam" });
      }

      const examId = req.body.examId || null;

      // Server-side enforcement: students are not allowed to upload exam files.
      if (examId && req.user && req.user.role === 'student') {
        // If multer already saved a file to disk, remove it to avoid orphan files
        try {
          if (req.file && req.file.path) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          } else if (req.file && req.file.filename) {
            // try to remove from uploads/misc or the computed folder as a best-effort
            const maybePath = path.join(process.cwd(), 'uploads', 'misc', req.file.filename);
            if (fs.existsSync(maybePath)) fs.unlinkSync(maybePath);
          }
        } catch (unlinkErr) {
          console.error('Failed to remove uploaded file after rejecting exam upload:', unlinkErr);
        }

        return res.status(403).json({ error: 'Students are not permitted to upload exam files.' });
      }

      // Save to SQL (write model)
      const upload = await Upload.create({
        file: req.file.filename,
        timeUploaded: new Date(),
        lectureId: lectureId || null,
        assignmentId: assignmentId || null,
        examId: examId,
        studentId: studentId || null,
        teacherId: teacherId || null,
      });

      // Project to MongoDB (read model)
      await UploadReadModel.create({
        file: req.file.filename,
        timeUploaded: upload.timeUploaded,
        lectureId: lectureId || null,
        assignmentId: assignmentId || null,
        examId: examId,
        studentId: studentId || null,
        teacherId: teacherId || null,
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
