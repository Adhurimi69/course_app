// backend/routes/queries/uploadQueryRoutes.js
const express = require("express");
const router = express.Router();
const uploadQueryController = require("../../controllers/queries/uploadQueryController");
const requireRole = require('../../middleware/requireRole');
const requireOwnershipOrRole = require('../../middleware/requireOwnershipOrRole');
const requireUploadOwnershipOrRole = require('../../middleware/requireUploadOwnershipOrRole');
const requireUploadModifyPermission = require('../../middleware/requireUploadModifyPermission');
const requireTeacherOwnsParentResource = require('../../middleware/requireTeacherOwnsParentResource');
const requireUploadAccess = require('../../middleware/requireUploadAccess');

// Queries (reads)
router.get("/", requireRole('admin','teacher','student'), uploadQueryController.listUploads);
router.get("/recent", requireRole('admin','teacher','student'), uploadQueryController.listRecentUploads);
router.get("/course/:courseId", requireRole('admin','teacher','student'), uploadQueryController.getCourseUploads);
// Download file (authorized): same ownership rules
router.get("/:id/download", requireUploadAccess(), uploadQueryController.downloadUpload);
// Fetch single upload: admin / student owner / teacher who owns resource
router.get("/:id", requireUploadAccess(), uploadQueryController.fetchUpload);

module.exports = router;
