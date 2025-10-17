const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// In-memory storage for image metadata (in production, use a database)
const imageMetadata = new Map();

// Metadata file path for persistence
const METADATA_FILE = path.join(__dirname, '../uploads/metadata.json');

class LocalImageService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.initializeStorage();
  }

  /**
   * Initialize local storage directory and load existing metadata
   */
  async initializeStorage() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
      console.log('📁 Local storage initialized at:', this.uploadsDir);
      
      // Load existing metadata
      await this.loadMetadata();
    } catch (error) {
      console.error('Storage initialization error:', error);
    }
  }

  /**
   * Load metadata from file
   */
  async loadMetadata() {
    try {
      const data = await fs.readFile(METADATA_FILE, 'utf8');
      const metadata = JSON.parse(data);
      
      // Restore metadata to Map
      Object.entries(metadata).forEach(([key, value]) => {
        imageMetadata.set(key, value);
      });
      
      console.log(`📊 Loaded ${imageMetadata.size} images from metadata`);
    } catch (error) {
      // File doesn't exist yet - that's okay for first run
      console.log('📊 No existing metadata found - starting fresh');
    }
  }

  /**
   * Save metadata to file
   */
  async saveMetadata() {
    try {
      const metadata = Object.fromEntries(imageMetadata);
      await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
      console.log(`💾 Saved metadata for ${imageMetadata.size} images`);
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
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
      return buffer; // Return original if optimization fails
    }
  }

  /**
   * Upload image to local storage
   */
  async uploadImage(file, keywords = []) {
    try {
      const fileId = uuidv4();
      const fileExtension = file.mimetype.split('/')[1];
      const fileName = `${fileId}.${fileExtension}`;
      const filePath = path.join(this.uploadsDir, fileName);
      
      // Optimize image
      const optimizedBuffer = await this.optimizeImage(file.buffer, file.mimetype);
      
      // Save to local storage
      await fs.writeFile(filePath, optimizedBuffer);
      
      // Create image URL (served by Express static middleware)
      const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${fileName}`;
      
      // Store metadata
      const imageData = {
        id: fileId,
        fileName,
        originalName: file.originalname,
        keywords,
        uploadDate: new Date().toISOString(),
        fileSize: optimizedBuffer.length,
        contentType: file.mimetype,
        url: imageUrl,
        filePath,
      };
      
      imageMetadata.set(fileId, imageData);
      
      // Save metadata to file for persistence
      await this.saveMetadata();
      
      console.log('✅ Image uploaded successfully:', fileName);
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
      console.log(`📊 Total images available: ${imageMetadata.size}`);
      
      if (!query || query.trim().length === 0) {
        throw new Error('Search query is required');
      }
      
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      console.log(`🔍 Search terms: ${searchTerms.join(', ')}`);
      
      // Filter images based on keywords
      const matchingImages = Array.from(imageMetadata.values()).filter(image => {
        const imageKeywords = image.keywords.map(k => k.toLowerCase());
        const imageName = image.originalName.toLowerCase();
        
        const matches = searchTerms.some(term => 
          imageKeywords.some(keyword => keyword.includes(term)) ||
          imageName.includes(term)
        );
        
        if (matches) {
          console.log(`✅ Match found: ${image.originalName} (keywords: ${image.keywords.join(', ')})`);
        }
        
        return matches;
      });
      
      console.log(`🔍 Found ${matchingImages.length} matching images`);
      
      // Sort by upload date (newest first)
      matchingImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedImages = matchingImages.slice(startIndex, endIndex);
      
      console.log(`📄 Returning ${paginatedImages.length} images for page ${page}`);
      
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

module.exports = new LocalImageService();