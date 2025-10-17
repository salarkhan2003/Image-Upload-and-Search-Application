const multer = require('multer');

// Configuration from environment variables
const UPLOAD_CONFIG = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
};

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (UPLOAD_CONFIG.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${UPLOAD_CONFIG.allowedTypes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: UPLOAD_CONFIG.maxFileSize, // 10MB
    files: 5, // Maximum 5 files per request
  },
  fileFilter: fileFilter,
});

// Middleware for single file upload
const uploadSingle = upload.single('image');

// Middleware for multiple file upload
const uploadMultiple = upload.array('images', 5);

// Custom upload middleware with error handling
const handleUpload = (uploadType) => (req, res, next) => {
  uploadType(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = {
  uploadSingle: handleUpload(uploadSingle),
  uploadMultiple: handleUpload(uploadMultiple),
};