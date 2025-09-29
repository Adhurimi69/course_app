// backend/controllers/queries/uploadQueryController.js
const UploadReadModel = require("../../models/nosql/uploadReadModel");
const Lecture = require("../../models/sql/lecture");
const Assignment = require("../../models/sql/assignment");
const Upload = require("../../models/sql/upload");
const Student = require("../../models/sql/student");
const Teacher = require("../../models/sql/teacher");

// Fetch a single upload with populated references (Sequelize)
exports.fetchUpload = async (req, res) => {
  try {
    const upload = await Upload.findByPk(req.params.id, {
      include: [
        { model: Student, attributes: ["id", "name", "email"] },
        { model: Teacher, attributes: ["id", "name", "email"] },
        { model: require("../../models/sql/lecture"), attributes: ["id", "title"] },
        { model: require("../../models/sql/assignment"), attributes: ["id", "title", "dueDate"] },
        { model: require("../../models/sql/exam"), attributes: ["id", "title"] },
      ],
    });

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

    const where = {};
    if (lectureId) where.lectureId = lectureId;
    if (assignmentId) where.assignmentId = assignmentId;
    if (studentId) where.studentId = studentId;

    const uploads = await Upload.findAll({
      where,
      include: [
        { model: Student, attributes: ["id", "name", "email"] },
        { model: Teacher, attributes: ["id", "name", "email"] },
        { model: require("../../models/sql/assignment"), attributes: ["id", "title", "dueDate"] },
        { model: require("../../models/sql/lecture"), attributes: ["id", "title"] },
        { model: require("../../models/sql/exam"), attributes: ["id", "title"] },
      ],
      order: [["timeUploaded", "DESC"]],
      limit: parseInt(limit) || 50,
    });

    res.json(uploads);
  } catch (e) {
    console.error("Error listing uploads:", e);
    res.status(500).json({ error: "Failed to list uploads" });
  }
};

// List recent uploads (shortcut endpoint)
exports.listRecentUploads = async (req, res) => {
  try {
    const uploads = await Upload.findAll({
      include: [
        { model: Student, attributes: ["id", "name", "email"] },
        { model: Teacher, attributes: ["id", "name", "email"] },
        { model: require("../../models/sql/assignment"), attributes: ["id", "title"] },
        { model: require("../../models/sql/lecture"), attributes: ["id", "title"] },
        { model: require("../../models/sql/exam"), attributes: ["id", "title"] },
      ],
      order: [["timeUploaded", "DESC"]],
      limit: 10,
    });

    res.json(uploads);
  } catch (e) {
    console.error("Error fetching recent uploads:", e);
    res.status(500).json({ error: "Failed to fetch recent uploads" });
  }
};

exports.getCourseUploads = async (req, res) => {
  try {
    // coerce numeric course ids to numbers to match SQL columns
    const rawCourseId = req.params.courseId;
    const courseId = /^\d+$/.test(String(rawCourseId)) ? Number(rawCourseId) : rawCourseId;

    // 1️⃣ Fetch lectures of this course, include teacher uploads and assignments
    let lectures;
    try {
      lectures = await Lecture.findAll({
      where: { courseId },
      include: [
        {
          model: Upload, // uploads linked to lecture (could be teacher resources or student submissions)
          include: [
            { model: Student, attributes: ["id", "name", "email"] },
            { model: Teacher, attributes: ["id", "name", "email"] },
          ],
        },
        {
          model: Assignment,
            include: [
              {
                model: Upload, // student uploads linked to assignment
                include: [
                  { model: Student, attributes: ["id", "name", "email"] },
                  { model: Teacher, attributes: ["id", "name", "email"] },
                ],
              },
            ],
        },
      ],
      // keep lecture ordering simple here and sort uploads in-memory below
      order: [["id", "ASC"]],
      });
    } catch (errFetchLectures) {
      console.error(`Failed to fetch lectures for courseId=${courseId}:`, errFetchLectures);
      return res.status(500).json({ error: 'Failed to fetch course lectures' });
    }

    // Flatten uploads so frontend can easily filter by lectureId/assignmentId
    const flatUploads = [];

    try {
      lectures.forEach((lec) => {
      // lecture-level uploads (resources provided by teacher or misc uploads tied to lecture)
      (lec.Uploads || []).forEach((u) => {
        flatUploads.push({
          id: u.id,
          file: u.file,
          timeUploaded: u.timeUploaded,
          lectureId: lec.id,
          assignmentId: null,
          student: u.Student
            ? { id: u.Student.id, name: u.Student.name, email: u.Student.email }
            : null,
          teacher: u.Teacher
            ? { id: u.Teacher.id, name: u.Teacher.name, email: u.Teacher.email }
            : null,
        });
      });

      // assignment-level uploads (student submissions)
      (lec.Assignments || []).forEach((a) => {
        (a.Uploads || []).forEach((u) => {
          flatUploads.push({
            id: u.id,
            file: u.file,
            timeUploaded: u.timeUploaded,
            lectureId: lec.id,
            assignmentId: a.id,
            student: u.Student
              ? { id: u.Student.id, name: u.Student.name, email: u.Student.email }
              : null,
            teacher: u.Teacher
              ? { id: u.Teacher.id, name: u.Teacher.name, email: u.Teacher.email }
              : null,
          });
        });
      });
      });
    } catch (errFlatten) {
      console.error('Failed to flatten lecture/assignment uploads:', errFlatten);
      return res.status(500).json({ error: 'Failed to process course uploads' });
    }

    // Also include exam-level uploads for this course
    const exams = await require('../../models/sql/exam').findAll({ where: { courseId }, include: [{ model: Upload, include: [ { model: Student, attributes: ["id","name","email"] }, { model: Teacher, attributes: ["id","name","email"] } ] }] });
    exams.forEach((ex) => {
      (ex.Uploads || []).forEach((u) => {
        flatUploads.push({
          id: u.id,
          file: u.file,
          timeUploaded: u.timeUploaded,
          lectureId: null,
          assignmentId: null,
          examId: ex.id,
          student: u.Student ? { id: u.Student.id, name: u.Student.name, email: u.Student.email } : null,
          teacher: u.Teacher ? { id: u.Teacher.id, name: u.Teacher.name, email: u.Teacher.email } : null,
        });
      });
    });

    // sort all uploads by timeUploaded descending for consistent UI
    flatUploads.sort((a, b) => {
      const ta = a.timeUploaded ? new Date(a.timeUploaded) : 0;
      const tb = b.timeUploaded ? new Date(b.timeUploaded) : 0;
      return tb - ta;
    });

    res.json(flatUploads);
  } catch (err) {
    console.error("Error fetching course uploads:", err);
    // Return message to aid debugging; in production consider hiding details
    res.status(500).json({ error: err.message || "Failed to fetch course uploads" });
  }
};

// Stream a file to the client with authorization already checked by middleware
exports.downloadUpload = async (req, res) => {
  try {
    const upload = await Upload.findByPk(req.params.id);
    if (!upload) return res.status(404).json({ error: 'Upload not found' });

    // Determine folder
    const folder = upload.lectureId ? 'lectures' : upload.assignmentId ? 'assignments' : upload.examId ? 'exams' : 'misc';
    const filePath = require('path').join(process.cwd(), 'uploads', folder, upload.file);

    const fs = require('fs');
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${upload.file}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const stream = fs.createReadStream(filePath);
    stream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).end();
    });
    stream.pipe(res);
  } catch (err) {
    console.error('Error in downloadUpload:', err);
    res.status(500).json({ error: 'Failed to download file' });
  }
};


