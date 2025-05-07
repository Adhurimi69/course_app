const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/commands/userCommandController");

router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
