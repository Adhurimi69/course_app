const express = require("express");

const attendanceMongoRouter = express.Router();
const attendanceMongoController = require('../../controllers/queries/attendanceQueryController');
attendanceMongoRouter.post('/', attendanceMongoController.addAttendance);
attendanceMongoRouter.get('/student/:studentId/:courseId', attendanceMongoController.calculateAttendanceForStudent);
attendanceMongoRouter.get('/lecture/:lectureId', attendanceMongoController.calculateAttendanceForLecture);
module.exports = attendanceMongoRouter;