const express = require("express");
const router = express.Router();
const {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../../controllers/commands/departmentCommandController");

router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
