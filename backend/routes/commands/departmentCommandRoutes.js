const express = require("express");
const router = express.Router();
const {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../../controllers/commands/departmentCommandController");
const requireRole = require('../../middleware/requireRole');

router.post("/", requireRole('admin'), createDepartment);
router.put("/:id", requireRole('admin'), updateDepartment);
router.delete("/:id", requireRole('admin'), deleteDepartment);

module.exports = router;
