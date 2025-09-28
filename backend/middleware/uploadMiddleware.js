const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine folder based on lectureId or assignmentId
    let folder;

    if (req.body.lectureId && req.body.assignmentId) {
      return cb(new Error("Upload must belong to either lecture OR assignment, not both"));
    }

    if (req.body.lectureId) {
      folder = path.join(process.cwd(), "uploads/lectures");
    } else if (req.body.assignmentId) {
      folder = path.join(process.cwd(), "uploads/assignments");
    } else {
      folder = path.join(process.cwd(), "uploads/misc");
    }

    // Create folder if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Optional: limit size & filter file types
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|docx|pptx|jpg|png|jpeg|txt/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.test(ext)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
}).single("file");

module.exports = uploadMiddleware;
