// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  };

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.message = 'File size too large. Maximum size is 10MB.';
    error.status = 400;
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error.message = 'Too many files. Maximum 5 files allowed.';
    error.status = 400;
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error.message = 'Unexpected field name for file upload.';
    error.status = 400;
  }

  // AWS S3 errors
  if (err.name === 'NoSuchBucket') {
    error.message = 'S3 bucket not found.';
    error.status = 500;
  }

  if (err.name === 'AccessDenied') {
    error.message = 'Access denied to S3 bucket.';
    error.status = 500;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = err.details?.[0]?.message || 'Validation error';
    error.status = 400;
  }

  // Send error response
  res.status(error.status).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
};