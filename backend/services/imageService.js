const { PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { s3Client, S3_CONFIG } = require('../config/aws');

// In-memory storage for image metadata (in production, use a database)
const imageMetadata = new Map();

class ImageService {
  /**
   * Optimize image before upload
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
   * Upload image to S3
   */
  async uploadImage(file, keywords = []) {
    try {
      const fileId = uuidv4();
      const fileExtension = file.mimetype.split('/')[1];
      const fileName = `images/${fileId}.${fileExtension}`;
      
      // Optimize image
      const optimizedBuffer = await this.optimizeImage(file.buffer, file.mimetype);
      
      // Prepare metadata
      const metadata = {
        originalName: file.originalname,
        keywords: keywords.join(','),
        uploadDate: new Date().toISOString(),
        fileSize: optimizedBuffer.length.toString(),
        contentType: file.mimetype,
      };
      
      // Upload to S3
      const uploadParams = {
        Bucket: S3_CONFIG.bucketName,
        Key: fileName,
        Body: optimizedBuffer,
        ContentType: file.mimetype,
        Metadata: metadata,
      };
      
      await s3Client.send(new PutObjectCommand(uploadParams));
      
      // Generate signed URL for viewing
      const signedUrl = await this.getSignedUrl(fileName);
      
      // Store metadata in memory (use database in production)
      const imageData = {
        id: fileId,
        fileName,
        originalName: file.originalname,
        keywords,
        uploadDate: metadata.uploadDate,
        fileSize: optimizedBuffer.length,
        contentType: file.mimetype,
        url: signedUrl,
      };
      
      imageMetadata.set(fileId, imageData);
      
      return imageData;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image to S3');
    }
  }

  /**
   * Get signed URL for image
   */
  async getSignedUrl(fileName, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: S3_CONFIG.bucketName,
        Key: fileName,
      });
      
      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Search images by keywords
   */
  async searchImages(query, page = 1, limit = 12) {
    try {
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
      
      // Sort by upload date (newest first)
      matchingImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedImages = matchingImages.slice(startIndex, endIndex);
      
      // Refresh signed URLs
      for (const image of paginatedImages) {
        image.url = await this.getSignedUrl(image.fileName);
      }
      
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
      
      // Sort by upload date (newest first)
      allImages.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedImages = allImages.slice(startIndex, endIndex);
      
      // Refresh signed URLs
      for (const image of paginatedImages) {
        image.url = await this.getSignedUrl(image.fileName);
      }
      
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
      
      // Refresh signed URL
      image.url = await this.getSignedUrl(image.fileName);
      
      return image;
    } catch (error) {
      console.error('Get image by ID error:', error);
      throw error;
    }
  }
}

module.exports = new ImageService();