const express = require('express');
const router = express.Router();
const controller = require('../../controllers/queries/studentCourseQueryController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

router.post('/', requireRole('admin','student'), controller.create);
router.delete('/', requireRole('admin','student'), controller.delete);
// list all student-course entries
router.get('/', requireRole('admin','teacher'), controller.list);
router.get('/courses', requireRole('admin','teacher','student'), controller.fetchCourses);
router.get('/students', requireRole('admin','teacher'), controller.fetchStudents);
// fetch students enrolled in a specific course (populated)
router.get('/course/:courseId', requireRole('admin','teacher'), controller.fetchStudentsForCourse);
// SQL fallback for environments where read-models are not populated
router.get('/sql/course/:courseId', requireRole('admin','teacher'), controller.fetchStudentsForCourseSQL);
// Development-only helper (unprotected) to inspect SQL enrollments quickly in dev environment
if (process.env.NODE_ENV !== 'production') {
	router.get('/dev/sql/course/:courseId', controller.fetchStudentsForCourseSQL);
}

module.exports = router;
