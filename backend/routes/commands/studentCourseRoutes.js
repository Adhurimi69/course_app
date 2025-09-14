const express = require('express');
const router = express.Router();
const controller = require('../../controllers/commands/studentCourseController');



router.post('/', controller.enrollWithCourseKey);
router.delete('/', controller.delete);
router.get('/', controller.list);
router.get('/enrolled/:studentId', controller.getEnrolledCourses);
router.get('/available/:studentId', controller.getAvailableCourses);

module.exports = router;

