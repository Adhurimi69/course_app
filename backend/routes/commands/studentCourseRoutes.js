const express = require('express');
const router = express.Router();
const controller = require('../../controllers/commands/studentCourseController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

// Enroll: students (self) or admins may enroll a student using a course key
router.post('/', requireRole('admin','student'), controller.enrollWithCourseKey);

// Delete enrollment: student (self) or admin may delete
router.delete('/', requireRole('admin','student'), controller.delete);

// List enrollments: only admins/teachers should list all enrollments
router.get('/', requireRole('admin','teacher'), controller.list);

// Get enrolled courses for a student: owner or admin/teacher
router.get('/enrolled/:studentId', requireOwnershipOrRole('studentId', 'admin','teacher'), controller.getEnrolledCourses);

// Get available courses for a student: owner or admin/teacher
router.get('/available/:studentId', requireOwnershipOrRole('studentId', 'admin','teacher'), controller.getAvailableCourses);

module.exports = router;

