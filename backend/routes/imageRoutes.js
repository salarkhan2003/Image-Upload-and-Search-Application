const express = require('express');
const router = express.Router();

const {
  uploadImages,
  searchImages,
  getAllImages,
  getImageById,
  getUploadStats,
  debugImages,
} = require('../controllers/imageController');

const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const {
  validateUpload,
  validateSearch,
  validatePagination,
} = require('../validators/imageValidator');

/**
 * @route   POST /api/upload
 * @desc    Upload single image with keywords
 * @access  Public
 */
router.post('/upload', uploadSingle, validateUpload, uploadImages);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images with keywords
 * @access  Public
 */
router.post('/upload/multiple', uploadMultiple, validateUpload, uploadImages);

/**
 * @route   GET /api/search
 * @desc    Search images by keywords
 * @access  Public
 * @query   q (required) - search query
 * @query   page (optional) - page number (default: 1)
 * @query   limit (optional) - items per page (default: 12)
 */
router.get('/search', validateSearch, searchImages);

/**
 * @route   GET /api/images
 * @desc    Get all images with pagination
 * @access  Public
 * @query   page (optional) - page number (default: 1)
 * @query   limit (optional) - items per page (default: 12)
 */
router.get('/images', validatePagination, getAllImages);

/**
 * @route   GET /api/images/:id
 * @desc    Get single image by ID
 * @access  Public
 */
router.get('/images/:id', getImageById);

/**
 * @route   GET /api/stats
 * @desc    Get upload statistics
 * @access  Public
 */
router.get('/stats', getUploadStats);

/**
 * @route   GET /api/debug
 * @desc    Debug endpoint to check stored images
 * @access  Public
 */
router.get('/debug', debugImages);

/**
 * @route   GET /api/test-search
 * @desc    Test search without validation
 * @access  Public
 */
router.get('/test-search', (req, res) => {
  const { q = 'test' } = req.query;
  
  res.json({
    success: true,
    message: `Test search for: ${q}`,
    query: q,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;