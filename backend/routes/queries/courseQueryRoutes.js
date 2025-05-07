const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
} = require("../../controllers/queries/courseQueryController");

router.get("/", getCourses);
router.get("/:id", getCourseById);

module.exports = router;
