const express = require('express');
const router = express.Router();
const controller = require('../../controllers/commands/studentCourseController');

router.get('/courses', controller.fetchCourses);
router.get('/students', controller.fetchStudents);
router.post('/', controller.create);
router.delete('/', controller.delete);

module.exports = router;

