const path = require('path');
const fs = require('fs');
const { sequelize } = require('../config/db');
const Upload = require('../models/sql/upload');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL');

    const uploads = await Upload.findAll();
    console.log(`Found ${uploads.length} upload records`);

    const missing = [];

    uploads.forEach((u) => {
      const folder = u.lectureId ? 'lectures' : u.assignmentId ? 'assignments' : u.examId ? 'exams' : 'misc';
      const p = path.join(__dirname, '..', 'uploads', folder, u.file);
      if (!fs.existsSync(p)) {
        missing.push({ id: u.id, file: u.file, expectedPath: p, folder });
      }
    });

    if (missing.length === 0) {
      console.log('All upload files present on disk ✅');
    } else {
      console.log(`Missing ${missing.length} files:`);
      missing.forEach((m) => console.log(`- id=${m.id} file=${m.file} expected=${m.expectedPath} (folder=${m.folder})`));
    }

    process.exit(0);
  } catch (err) {
    console.error('Error checking uploads:', err);
    process.exit(1);
  }
})();
