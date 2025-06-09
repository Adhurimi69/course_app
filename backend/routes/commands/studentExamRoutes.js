const express = require("express");
const router = express.Router();
const controller = require("../../controllers/commands/studentExamController");

router.post("/", controller.addGrade);
router.delete("/", controller.removeGrade);
router.put("/", controller.changeGrade);
router.get("/", controller.seeGradesTeacher);
router.get("/student/:id", controller.seeGradesStudent);

module.exports = router;
