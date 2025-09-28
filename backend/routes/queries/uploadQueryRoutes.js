// backend/routes/queries/uploadQueryRoutes.js
const express = require("express");
const router = express.Router();
const uploadQueryController = require("../../controllers/queries/uploadQueryController");

// Queries (reads)
router.get("/", uploadQueryController.listUploads);          // List uploads (with filters)
router.get("/recent", uploadQueryController.listRecentUploads); // Recent uploads
router.get("/:id", uploadQueryController.fetchUpload);       // Fetch single upload
router.get("/course/:courseId", uploadQueryController.getCourseUploads);   // New: Get all uploads for a course (lectures + assignments)

module.exports = router;
