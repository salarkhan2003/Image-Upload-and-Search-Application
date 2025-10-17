const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { supabaseAdmin, supabasePublic, SUPABASE_CONFIG } = require('../config/supabase');

class SupabaseImageService {
  constructor() {
    this.initializeDatabase();
  }

  /**
   * Initialize database tables if they don't exist
   */
  async initializeDatabase() {
    try {
      // Create images table if it doesn't exist
      const { error } = await supabaseAdmin.rpc('create_images_table_if_not_exists');
      if (error && !error.message.includes('already exists')) {
        console.error('Database initialization error:', error);
      }
    } catch (error) {
      console.log('Database initialization skipped (table may already exist)');
    }
  }

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
   * Upload image to Supabase Storage
   */
  async uploadImage(file, keywords = []) {
    try {
      const fileId = uuidv4();
      const fileExtension = file.mimetype.split('/')[1];
      const fileName = `${fileId}.${fileExtension}`;
      const filePath = `images/${fileName}`;
      
      // Optimize image
      const optimizedBuffer = await this.optimizeImage(file.buffer, file.mimetype);
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(SUPABASE_CONFIG.bucketName)
        .upload(filePath, optimizedBuffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabasePublic.storage
        .from(SUPABASE_CONFIG.bucketName)
        .getPublicUrl(filePath);

      // Save metadata to database
      const imageData = {
        id: fileId,
        file_name: fileName,
        file_path: filePath,
        original_name: file.originalname,
        keywords: keywords,
        upload_date: new Date().toISOString(),
        file_size: optimizedBuffer.length,
        content_type: file.mimetype,
        public_url: urlData.publicUrl,
      };

      const { data: dbData, error: dbError } = await supabaseAdmin
        .from('images')
        .insert([imageData])
        .select()
        .single();

      if (dbError) {
        // If database insert fails, try to delete the uploaded file
        await supabaseAdmin.storage
          .from(SUPABASE_CONFIG.bucketName)
          .remove([filePath]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      return {
        id: dbData.id,
        fileName: dbData.file_name,
        originalName: dbData.original_name,
        keywords: dbData.keywords || [],
        uploadDate: dbData.upload_date,
        fileSize: dbData.file_size,
        contentType: dbData.content_type,
        url: dbData.public_url,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Search images by keywords
   */
  async searchImages(query, page = 1, limit = 12) {
    try {
      const offset = (page - 1) * limit;
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      let queryBuilder = supabaseAdmin
        .from('images')
        .select('*', { count: 'exact' });

      // Build search conditions
      if (searchTerms.length > 0) {
        const searchConditions = searchTerms.map(term => 
          `keywords.cs.["${term}"],original_name.ilike.%${term}%`
        ).join(',');
        
        queryBuilder = queryBuilder.or(searchConditions);
      }

      // Add pagination and ordering
      const { data: images, error, count } = await queryBuilder
        .order('upload_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Search failed: ${error.message}`);
      }

      // Format response
      const formattedImages = images.map(image => ({
        id: image.id,
        fileName: image.file_name,
        originalName: image.original_name,
        keywords: image.keywords || [],
        uploadDate: image.upload_date,
        fileSize: image.file_size,
        contentType: image.content_type,
        url: image.public_url,
      }));

      const totalPages = Math.ceil(count / limit);

      return {
        images: formattedImages,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalImages: count,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error(`Failed to search images: ${error.message}`);
    }
  }

  /**
   * Get all images with pagination
   */
  async getAllImages(page = 1, limit = 12) {
    try {
      const offset = (page - 1) * limit;

      const { data: images, error, count } = await supabaseAdmin
        .from('images')
        .select('*', { count: 'exact' })
        .order('upload_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch images: ${error.message}`);
      }

      // Format response
      const formattedImages = images.map(image => ({
        id: image.id,
        fileName: image.file_name,
        originalName: image.original_name,
        keywords: image.keywords || [],
        uploadDate: image.upload_date,
        fileSize: image.file_size,
        contentType: image.content_type,
        url: image.public_url,
      }));

      const totalPages = Math.ceil(count / limit);

      return {
        images: formattedImages,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalImages: count,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Get all images error:', error);
      throw new Error(`Failed to fetch images: ${error.message}`);
    }
  }

  /**
   * Get image by ID
   */
  async getImageById(id) {
    try {
      const { data: image, error } = await supabaseAdmin
        .from('images')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Image not found');
        }
        throw new Error(`Failed to fetch image: ${error.message}`);
      }

      return {
        id: image.id,
        fileName: image.file_name,
        originalName: image.original_name,
        keywords: image.keywords || [],
        uploadDate: image.upload_date,
        fileSize: image.file_size,
        contentType: image.content_type,
        url: image.public_url,
      };
    } catch (error) {
      console.error('Get image by ID error:', error);
      throw error;
    }
  }

  /**
   * Get upload statistics
   */
  async getStats() {
    try {
      const { data: images, error } = await supabaseAdmin
        .from('images')
        .select('file_size, upload_date')
        .order('upload_date', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch stats: ${error.message}`);
      }

      const totalImages = images.length;
      const totalSize = images.reduce((sum, img) => sum + (img.file_size || 0), 0);
      const recentUploads = images.slice(0, 5);

      return {
        totalImages,
        totalSize,
        recentUploads,
      };
    } catch (error) {
      console.error('Get stats error:', error);
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }

  /**
   * Delete image
   */
  async deleteImage(id) {
    try {
      // Get image details first
      const image = await this.getImageById(id);
      
      // Delete from storage
      const { error: storageError } = await supabaseAdmin.storage
        .from(SUPABASE_CONFIG.bucketName)
        .remove([image.fileName]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabaseAdmin
        .from('images')
        .delete()
        .eq('id', id);

      if (dbError) {
        throw new Error(`Failed to delete image from database: ${dbError.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Delete image error:', error);
      throw error;
    }
  }
}

module.exports = new SupabaseImageService();