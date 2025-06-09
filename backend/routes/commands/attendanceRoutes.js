const express = require("express");

const attendanceRouter = express.Router();
const attendanceController = require('../../controllers/commands/attendanceController');
attendanceRouter.post('/', attendanceController.addAttendance);
attendanceRouter.get('/student/:studentId/:courseId', attendanceController.calculateAttendanceForStudent);
attendanceRouter.get('/lecture/:lectureId', attendanceController.calculateAttendanceForLecture);
module.exports = attendanceRouter;