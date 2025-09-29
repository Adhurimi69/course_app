const express = require("express");

const attendanceMongoRouter = express.Router();
const attendanceMongoController = require('../../controllers/queries/attendanceQueryController');
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

attendanceMongoRouter.post('/', requireRole('admin','teacher'), attendanceMongoController.addAttendance);
attendanceMongoRouter.get('/student/:studentId/:courseId', requireOwnershipOrRole('studentId', 'admin','teacher'), attendanceMongoController.calculateAttendanceForStudent);
attendanceMongoRouter.get('/lecture/:lectureId', requireRole('admin','teacher'), attendanceMongoController.calculateAttendanceForLecture);
module.exports = attendanceMongoRouter;