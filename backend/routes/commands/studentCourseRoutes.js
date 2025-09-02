const express = require('express');
const router = express.Router();
const controller = require('../../controllers/commands/studentCourseController');

router.post('/', controller.enrollWithCourseKey);
router.delete('/', controller.delete);

module.exports = router;

