const express = require("express");

const attendanceRouter = express.Router();
const attendanceController = require('../../controllers/commands/attendanceController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

// Only teachers/admins may add attendance records
attendanceRouter.post('/', requireRole('admin','teacher'), attendanceController.addAttendance);

// Students can view their own attendance; teachers/admins can view any
attendanceRouter.get('/student/:studentId/:courseId', requireOwnershipOrRole('studentId', 'admin','teacher'), attendanceController.calculateAttendanceForStudent);
attendanceRouter.get('/lecture/:lectureId', requireRole('admin','teacher'), attendanceController.calculateAttendanceForLecture);

module.exports = attendanceRouter;