const express = require("express");
const router = express.Router();
const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../../controllers/commands/adminCommandController");

router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
