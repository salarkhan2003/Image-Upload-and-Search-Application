import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://rbpkwztpnofawxizvjto.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'demo_key';

// Only create client if we have valid credentials
let supabase = null;
try {
  if (supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'demo_key') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.log('Supabase not configured, using demo mode');
}

export { supabase };

// Supabase configuration
export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  bucketName: 'images',
  maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10485760, // 10MB
  allowedTypes: (process.env.REACT_APP_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
};

// Utility functions for Supabase operations
export const supabaseUtils = {
  /**
   * Upload image directly to Supabase Storage (alternative to backend upload)
   */
  uploadImage: async (file, keywords = []) => {
    if (!supabase) {
      // Demo mode - return mock data
      return {
        id: Date.now().toString(),
        fileName: file.name,
        originalName: file.name,
        keywords: keywords,
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        contentType: file.type,
        url: URL.createObjectURL(file),
      };
    }
    
    try {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;
      const filePath = `images/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(SUPABASE_CONFIG.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(SUPABASE_CONFIG.bucketName)
        .getPublicUrl(filePath);

      // Save metadata to database
      const imageData = {
        file_name: fileName,
        file_path: filePath,
        original_name: file.name,
        keywords: keywords,
        file_size: file.size,
        content_type: file.type,
        public_url: urlData.publicUrl,
      };

      const { data: dbData, error: dbError } = await supabase
        .from('images')
        .insert([imageData])
        .select()
        .single();

      if (dbError) {
        // If database insert fails, try to delete the uploaded file
        await supabase.storage
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
      console.error('Supabase upload error:', error);
      throw error;
    }
  },

  /**
   * Get all images from Supabase
   */
  getAllImages: async (page = 1, limit = 12) => {
    if (!supabase) {
      // Demo mode - return empty data
      return {
        images: [],
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalImages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    
    try {
      const offset = (page - 1) * limit;

      const { data: images, error, count } = await supabase
        .from('images')
        .select('*', { count: 'exact' })
        .order('upload_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch images: ${error.message}`);
      }

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
      console.error('Supabase get images error:', error);
      throw error;
    }
  },

  /**
   * Search images by keywords
   */
  searchImages: async (query, page = 1, limit = 12) => {
    if (!supabase) {
      // Demo mode - return empty data
      return {
        images: [],
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalImages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    
    try {
      const offset = (page - 1) * limit;
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      let queryBuilder = supabase
        .from('images')
        .select('*', { count: 'exact' });

      // Build search conditions
      if (searchTerms.length > 0) {
        const searchConditions = searchTerms.map(term => 
          `keywords.cs.["${term}"],original_name.ilike.%${term}%`
        ).join(',');
        
        queryBuilder = queryBuilder.or(searchConditions);
      }

      const { data: images, error, count } = await queryBuilder
        .order('upload_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Search failed: ${error.message}`);
      }

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
      console.error('Supabase search error:', error);
      throw error;
    }
  },

  /**
   * Get upload statistics
   */
  getStats: async () => {
    if (!supabase) {
      // Demo mode - return demo stats
      return {
        totalImages: 0,
        totalSize: 0,
        recentUploads: [],
      };
    }
    
    try {
      const { data: images, error } = await supabase
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
      console.error('Supabase stats error:', error);
      throw error;
    }
  },
};