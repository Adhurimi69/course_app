const express = require('express');
const router = express.Router();
const controller = require('../../controllers/queries/studentCourseQueryController');

router.post('/', controller.create);
router.delete('/', controller.delete);
router.get('/courses', controller.fetchCourses);
router.get('/students', controller.fetchStudents);

module.exports = router;
