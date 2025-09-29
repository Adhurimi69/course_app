// backend/routes/commands/uploadCommandRoutes.js
const express = require("express");
const router = express.Router();
const uploadController = require("../../controllers/commands/uploadController");
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');
const requireUploadOwnershipOrRole = require('../../middleware/requireUploadOwnershipOrRole');
const requireUploadModifyPermission = require('../../middleware/requireUploadModifyPermission');

// Create: students/teachers/admins can upload
router.post("/", requireRole('student','teacher','admin'), uploadController.uploadDoc);

// Fetch: owner student, or teacher/admin
// Fetch: owner student, or teacher/admin
router.get("/:id", requireUploadOwnershipOrRole('admin','teacher'), uploadController.fetchUpload);

// Delete: only admin, owning teacher, or owning student
router.delete("/:id", requireUploadModifyPermission(), uploadController.deleteDoc);

module.exports = router;
