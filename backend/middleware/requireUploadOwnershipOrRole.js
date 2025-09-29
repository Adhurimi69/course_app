const requireAuth = require('./requireAuth');
const Upload = require('../models/sql/upload');

module.exports = function requireUploadOwnershipOrRole(...roles) {
  return async function (req, res, next) {
    // Ensure authenticated
    requireAuth(req, res, async function authNext(err) {
      if (err) return; // requireAuth handled response

      const user = req.user;
      if (!user) return res.status(401).json({ message: 'Missing access token' });

      // If user role is allowed, continue
      if (roles && roles.length > 0 && roles.includes(user.role)) return next();

      // Otherwise check upload's studentId
      try {
        const uploadId = req.params.id;
        const upload = await Upload.findByPk(uploadId);
        if (!upload) return res.status(404).json({ message: 'Upload not found' });

        if (String(upload.studentId) === String(user.id)) return next();

        return res.status(403).json({ message: 'Forbidden: not owner' });
      } catch (e) {
        console.error('Error checking upload ownership:', e);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  };
};
