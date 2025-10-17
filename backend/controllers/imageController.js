const imageService = require('../services/localImageService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Upload single or multiple images
 */
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided',
    });
  }

  const { keywords = [], title, description } = req.validatedData;
  const files = req.files || [req.file];
  
  try {
    const uploadPromises = files.map(file => 
      imageService.uploadImage(file, keywords)
    );
    
    const uploadedImages = await Promise.all(uploadPromises);
    
    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${uploadedImages.length} image(s)`,
      data: {
        images: uploadedImages,
        count: uploadedImages.length,
      },
    });
  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload images',
      details: error.message,
    });
  }
});

/**
 * Search images by keywords
 */
const searchImages = asyncHandler(async (req, res) => {
  const { q: query, page, limit } = req.validatedData;
  
  try {
    const result = await imageService.searchImages(query, page, limit);
    
    res.status(200).json({
      success: true,
      message: `Found ${result.images.length} images matching "${query}"`,
      data: result,
    });
  } catch (error) {
    console.error('Search controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search images',
      details: error.message,
    });
  }
});

/**
 * Get all images with pagination
 */
const getAllImages = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedData;
  
  try {
    const result = await imageService.getAllImages(page, limit);
    
    res.status(200).json({
      success: true,
      message: `Retrieved ${result.images.length} images`,
      data: result,
    });
  } catch (error) {
    console.error('Get all images controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch images',
      details: error.message,
    });
  }
});

/**
 * Get single image by ID
 */
const getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const image = await imageService.getImageById(id);
    
    res.status(200).json({
      success: true,
      message: 'Image retrieved successfully',
      data: { image },
    });
  } catch (error) {
    console.error('Get image by ID controller error:', error);
    
    if (error.message === 'Image not found') {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch image',
      details: error.message,
    });
  }
});

/**
 * Get upload statistics
 */
const getUploadStats = asyncHandler(async (req, res) => {
  try {
    const result = await imageService.getAllImages(1, 1000); // Get all for stats
    
    const stats = {
      totalImages: result.pagination.totalImages,
      totalSize: result.images.reduce((sum, img) => sum + img.fileSize, 0),
      recentUploads: result.images.slice(0, 5),
    };
    
    res.status(200).json({
      success: true,
      message: 'Upload statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Get stats controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      details: error.message,
    });
  }
});

/**
 * Debug endpoint to check image storage
 */
const debugImages = asyncHandler(async (req, res) => {
  try {
    const result = await imageService.getAllImages(1, 100);
    
    res.status(200).json({
      success: true,
      message: 'Debug info retrieved',
      data: {
        totalImages: result.pagination.totalImages,
        images: result.images.map(img => ({
          id: img.id,
          originalName: img.originalName,
          keywords: img.keywords,
          uploadDate: img.uploadDate,
          url: img.url,
        })),
      },
    });
  } catch (error) {
    console.error('Debug controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get debug info',
      details: error.message,
    });
  }
});

module.exports = {
  uploadImages,
  searchImages,
  getAllImages,
  getImageById,
  getUploadStats,
  debugImages,
};