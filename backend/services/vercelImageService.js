const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// Simple in-memory storage for demo (in production, use a database)
let imageMetadata = new Map();

class VercelImageService {
  constructor() {
    // Initialize with some sample data for demo
    this.initializeSampleData();
  }

  /**
   * Initialize with sample data for demo purposes
   */
  initializeSampleData() {
    const sampleImages = [
      {
        id: 'sample-1',
        fileName: 'sample-nature.jpg',
        originalName: 'beautiful-nature.jpg',
        keywords: ['nature', 'landscape', 'mountains'],
        uploadDate: new Date().toISOString(),
        fileSize: 2048576,
        contentType: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      },
      {
        id: 'sample-2',
        fileName: 'sample-sunset.jpg',
        originalName: 'amazing-sunset.jpg',
        keywords: ['sunset', 'beach', 'ocean'],
        uploadDate: new Date(Date.now() - 86400000).toISOString(),
        fileSize: 1536000,
        contentType: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
      },
      {
        id: 'sample-3',
        fileName: 'sample-city.jpg',
        originalName: 'city-skyline.jpg',
        keywords: ['city', 'skyline', 'urban', 'architecture'],
        uploadDate: new Date(Date.now() - 172800000).toISOString(),
        fileSize: 1843200,
        contentType: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop',
      }
    ];

    sampleImages.forEach(image => {
      imageMetadata.set(image.id, image);
    });

    console.log(`📊 Initialized with ${imageMetadata.size} sample images`);
  }

  /**
   * Optimize image before storage
   */
  async optimizeImage(buffer, mimetype) {
    try {
      let sharpInstance = sharp(buffer);
      
      // Get image metadata
      const metadata = await sharpInstance.metadata();
      
      // Resize if image is too large (max 1920px width)
      if (metadata.width > 1920) {
        sharpInstance = sharpInstance.resize(1920, null, {
          withoutEnlargement: true,
        });
      }
      
      // Compress based on format
      if (mimetype === 'image/jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality: 85 });
      } else if (mimetype === 'image/png') {
        sharpInstance = sharpInstance.png({ compressionLevel: 8 });
      } else if (mimetype === 'image/webp') {
        sharpInstance = sharpInstance.webp({ quality: 85 });
      }
      
      return await sharpInstance.toBuffer();
    } catch (error) {
      console.error('Image optimization error:', error);
      return buffer;
    }
  }

  /**
   * Upload image (demo version - converts to base64 data URL)
   */
  async uploadImage(file, keywords = []) {
    try {
      const fileId = uuidv4();
      
      // Optimize image
      const optimizedBuffer = await this.optimizeImage(file.buffer, file.mimetype);
      
      // Convert to base64 data URL for demo
      const base64 = optimizedBuffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;
      
      // Store metadata
      const imageData = {
        id: fileId,
        fileName: `${fileId}.${file.mimetype.split('/')[1]}`,
        originalName: file.originalname,
        keywords,
        uploadDate: new Date().toISOString(),
        fileSize: optimizedBuffer.length,
        contentType: file.mimetype,
        url: dataUrl,
      };
      
      imageMetadata.set(fileId, imageData);
      
      console.log('✅ Image uploaded successfully:', file.originalname);
      console.log('📊 Total images in storage:', imageMetadata.size);
      return imageData;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Search images by keywords
   */
  async searchImages(query, page = 1, limit = 12) {
    try {
      console.log(`🔍 Searching for: "${query}" (page ${page}, limit ${limit})`);
      
      // If no query, return all images
      if (!query || query.trim().length === 0) {
        return await this.getAllImages(page, limit);
      }
      
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      // Filter images based on keywords
      const matchingImages = Array.from(imageMetadata.values()).filter(image => {
        const imageKeywords = image.keywords.map(k => k.toLowerCase());
        const imageName = image.originalName.toLowerCase();
        
        return searchTerms.some(term => 
          imageKeywords.some(keyword => keyword.includes(term)) ||
          imageName.includes(term)
        );
      });
      
      console.log(`🔍 Found ${matchingImages.length} matching images`);
      
      // Sort by upload date (newest first)
      matchingImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedImages = matchingImages.slice(startIndex, endIndex);
      
      return {
        images: paginatedImages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(matchingImages.length / limit),
          totalImages: matchingImages.length,
          hasNext: endIndex < matchingImages.length,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search images');
    }
  }

  /**
   * Get all images with pagination
   */
  async getAllImages(page = 1, limit = 12) {
    try {
      const allImages = Array.from(imageMetadata.values());
      
      console.log(`📊 getAllImages called - Found ${allImages.length} total images`);
      
      // Sort by upload date (newest first)
      allImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedImages = allImages.slice(startIndex, endIndex);
      
      console.log(`📄 Returning ${paginatedImages.length} images for page ${page}`);
      
      return {
        images: paginatedImages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(allImages.length / limit),
          totalImages: allImages.length,
          hasNext: endIndex < allImages.length,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Get all images error:', error);
      throw new Error('Failed to fetch images');
    }
  }

  /**
   * Get image by ID
   */
  async getImageById(id) {
    try {
      const image = imageMetadata.get(id);
      if (!image) {
        throw new Error('Image not found');
      }
      
      return image;
    } catch (error) {
      console.error('Get image by ID error:', error);
      throw error;
    }
  }
}

module.exports = new VercelImageService();