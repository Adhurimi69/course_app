// backend/controllers/queries/uploadQueryController.js
const UploadReadModel = require("../../models/nosql/uploadReadModel");
const Lecture = require("../../models/sql/lecture");
const Assignment = require("../../models/sql/assignment");
const Upload = require("../../models/sql/upload");
const Student = require("../../models/sql/student");

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

// List uploads (with optional filters)
exports.listUploads = async (req, res) => {
  try {
    const { lectureId, assignmentId, studentId, limit } = req.query;

    // Build dynamic filters
    const filter = {};
    if (lectureId) filter.lectureId = lectureId;
    if (assignmentId) filter.assignmentId = assignmentId;
    if (studentId) filter.studentId = studentId;

    // Query with optional limit (default 50 for performance)
    const uploads = await Upload.find(filter)
      .populate("studentId", "name email")
      .populate("assignmentId", "title dueDate")
      .populate("lectureId", "title")
      .sort({ timeUploaded: -1 })
      .limit(parseInt(limit) || 50);

    res.json(uploads);
  } catch (e) {
    console.error("Error listing uploads:", e);
    res.status(500).json({ error: "Failed to list uploads" });
  }
};

// List recent uploads (shortcut endpoint)
exports.listRecentUploads = async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate("studentId", "name email")
      .populate("assignmentId", "title")
      .populate("lectureId", "title")
      .sort({ timeUploaded: -1 })
      .limit(10);

    res.json(uploads);
  } catch (e) {
    console.error("Error fetching recent uploads:", e);
    res.status(500).json({ error: "Failed to fetch recent uploads" });
  }
};

exports.getCourseUploads = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // 1️⃣ Fetch lectures of this course, include teacher uploads and assignments
    const lectures = await Lecture.findAll({
      where: { courseId },
      include: [
        {
          model: Upload, // teacher uploads linked to lecture
          include: [{ model: Student, attributes: ["id", "name", "email"] }],
        },
        {
          model: Assignment,
          include: [
            {
              model: Upload, // student uploads linked to assignment
              include: [{ model: Student, attributes: ["id", "name", "email"] }],
            },
          ],
        },
      ],
      order: [
        ["id", "ASC"],
        [Upload, "timeUploaded", "DESC"], // latest uploads first
        [Assignment, Upload, "timeUploaded", "DESC"],
      ],
    });

    // Transform data to make it easy for frontend
    const result = lectures.map((lec) => ({
      lectureId: lec.id,
      title: lec.title,
      uploads: lec.Uploads.map((u) => ({
        id: u.id,
        file: u.file,
        timeUploaded: u.timeUploaded,
        student: u.studentId
          ? { id: u.studentId.id, name: u.studentId.name, email: u.studentId.email }
          : null,
      })),
      assignments: lec.Assignments.map((a) => ({
        assignmentId: a.id,
        title: a.title,
        dueDate: a.dueDate,
        uploads: a.Uploads.map((u) => ({
          id: u.id,
          file: u.file,
          timeUploaded: u.timeUploaded,
          student: u.studentId
            ? { id: u.studentId.id, name: u.studentId.name, email: u.studentId.email }
            : null,
        })),
      })),
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching course uploads:", err);
    res.status(500).json({ error: "Failed to fetch course uploads" });
  }
};


