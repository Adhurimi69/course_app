const requireAuth = require('./requireAuth');
const Upload = require('../models/sql/upload');
const { LectureReadModel } = require('../models/nosql/lectureReadModel');
const { AssignmentReadModel } = require('../models/nosql/assignmentReadModel');
const { ExamReadModel } = require('../models/nosql/examReadModel');
const { CourseReadModel } = require('../models/nosql/courseReadModel');

module.exports = function requireTeacherOwnsParentResource() {
  return async function (req, res, next) {
    // Ensure authenticated
    requireAuth(req, res, async function authNext(err) {
      if (err) return; // requireAuth handled response

      const user = req.user;
      if (!user) return res.status(401).json({ message: 'Missing access token' });

      // Only relevant for teachers; non-teachers bypass here
      if (user.role !== 'teacher') return next();

      try {
        const uploadId = req.params.id;
        const upload = await Upload.findByPk(uploadId);
        if (!upload) return res.status(404).json({ message: 'Upload not found' });

        // If this upload was created by the teacher directly, allow
        if (String(upload.teacherId) === String(user.id)) return next();

        // Otherwise check parent resource -> course -> teacherId
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
      } catch (e) {
        console.error('Error checking teacher ownership:', e);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  };
};
