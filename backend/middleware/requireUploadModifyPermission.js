const requireAuth = require('./requireAuth');
const Upload = require('../models/sql/upload');

module.exports = function requireUploadModifyPermission() {
  return async function (req, res, next) {
    // Ensure authenticated
    requireAuth(req, res, async function authNext(err) {
      if (err) return; // requireAuth handled response

      const user = req.user;
      if (!user) return res.status(401).json({ message: 'Missing access token' });

      try {
        const uploadId = req.params.id;
        const upload = await Upload.findByPk(uploadId);
        if (!upload) return res.status(404).json({ message: 'Upload not found' });

        // Admin can do anything
        if (user.role === 'admin') return next();

        // If teacher, allow only if teacherId matches upload.teacherId
        if (user.role === 'teacher') {
          if (String(upload.teacherId) === String(user.id)) return next();
          return res.status(403).json({ message: 'Forbidden: teacher not owner of this upload' });
        }

        // If student, allow only if student owns the upload
        if (user.role === 'student') {
          if (String(upload.studentId) === String(user.id)) return next();
          return res.status(403).json({ message: 'Forbidden: not owner' });
        }

        // Default deny
        return res.status(403).json({ message: 'Forbidden' });
      } catch (e) {
        console.error('Error checking upload modify permission:', e);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  };
};
