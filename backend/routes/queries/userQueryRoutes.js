const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
} = require("../../controllers/queries/userQueryController");

router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
