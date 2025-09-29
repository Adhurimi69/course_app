const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudentById,
} = require("../../controllers/queries/studentQueryController");
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');

router.get("/", requireRole('admin','teacher'), getStudents);
router.get("/:id", requireOwnershipOrRole('id', 'admin','teacher'), getStudentById);

module.exports = router;
