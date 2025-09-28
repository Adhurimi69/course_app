// backend/routes/commands/uploadCommandRoutes.js
const express = require("express");
const router = express.Router();
const uploadController = require("../../controllers/commands/uploadController");

// Commands (mutations)
router.post("/", uploadController.uploadDoc);       // Create upload
router.get("/:id", uploadController.fetchUpload);   // Fetch single upload (for edit)
router.delete("/:id", uploadController.deleteDoc);  // Delete upload

module.exports = router;
