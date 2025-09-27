const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure folder exists
const ensureFolderExists = (folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;

    if (req.body.lectureId) {
      folder = path.join(process.cwd(), "uploads/lectures");
    } else if (req.body.assignmentId) {
      folder = path.join(process.cwd(), "uploads/assignments");
    } else {
      folder = path.join(process.cwd(), "uploads/misc");
    }

    ensureFolderExists(folder);
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({ storage }).single("file");

module.exports = uploadMiddleware;
