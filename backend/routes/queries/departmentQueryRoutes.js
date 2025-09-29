// routes/departmentQueryRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
} = require("../../controllers/queries/departmentQueryController");
const requireRole = require('../../middleware/requireRole');

router.get("/", requireRole('admin','teacher'), getAllDepartments);
router.get("/:id", requireRole('admin','teacher'), getDepartmentById);

module.exports = router;
