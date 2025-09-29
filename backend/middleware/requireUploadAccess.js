const requireAuth = require('./requireAuth');
const Upload = require('../models/sql/upload');
const { LectureReadModel } = require('../models/nosql/lectureReadModel');
const { AssignmentReadModel } = require('../models/nosql/assignmentReadModel');
const { ExamReadModel } = require('../models/nosql/examReadModel');
const { CourseReadModel } = require('../models/nosql/courseReadModel');
const StudentCourse = require('../models/sql/studentCourse');

module.exports = function requireUploadAccess() {
  return async function (req, res, next) {
    // Ensure authenticated
    requireAuth(req, res, async function authNext(err) {
      if (err) return; // requireAuth handled response

      const user = req.user;
      if (!user) return res.status(401).json({ message: 'Missing access token' });

      try {
        // Admin can do anything
        if (user.role === 'admin') return next();

        const uploadId = req.params.id;
        const upload = await Upload.findByPk(uploadId);
        if (!upload) return res.status(404).json({ message: 'Upload not found' });

        // Student owner or enrolled student of parent course
        if (user.role === 'student') {
          if (String(upload.studentId) === String(user.id)) return next();

          // If upload is linked to a lecture/assignment/exam, allow if student enrolled in that course
          let courseId = null;
          if (upload.lectureId) {
            const lec = await LectureReadModel.findOne({ lectureId: upload.lectureId });
            courseId = lec?.courseId;
          } else if (upload.assignmentId) {
            const asg = await AssignmentReadModel.findOne({ assignmentId: upload.assignmentId });
            courseId = asg?.courseId;
          } else if (upload.examId) {
            const ex = await ExamReadModel.findOne({ examId: upload.examId });
            courseId = ex?.courseId;
          }

          if (courseId) {
            const enrollment = await StudentCourse.findOne({ where: { studentId: user.id, courseId } });
            if (enrollment) return next();
          }

          return res.status(403).json({ message: 'Forbidden: not owner or not enrolled in course' });
        }

        // Teacher: allow if teacherId on upload matches OR teacher owns parent course
        if (user.role === 'teacher') {
          if (String(upload.teacherId) === String(user.id)) return next();

          let courseId = null;
          if (upload.lectureId) {
            const lec = await LectureReadModel.findOne({ lectureId: upload.lectureId });
            courseId = lec?.courseId;
          } else if (upload.assignmentId) {
            const asg = await AssignmentReadModel.findOne({ assignmentId: upload.assignmentId });
            courseId = asg?.courseId;
          } else if (upload.examId) {
            const ex = await ExamReadModel.findOne({ examId: upload.examId });
            courseId = ex?.courseId;
          }

          if (!courseId) return res.status(403).json({ message: 'Forbidden: teacher does not own this resource' });

          const course = await CourseReadModel.findOne({ courseId });
          if (!course) return res.status(403).json({ message: 'Forbidden: course not found' });

          if (String(course.teacherId) === String(user.id)) return next();
          return res.status(403).json({ message: 'Forbidden: teacher does not own this course' });
        }

        // Other roles not allowed
        return res.status(403).json({ message: 'Forbidden' });
      } catch (e) {
        console.error('Error checking upload access:', e);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  };
};
