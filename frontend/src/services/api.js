import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    
    console.error('API Error:', {
      message: errorMessage,
      status: error.response?.status,
      url: error.config?.url,
    });
    
    return Promise.reject(new Error(errorMessage));
  }
);

// API service functions
export const imageAPI = {
  /**
   * Upload single image
   */
  uploadImage: async (file, keywords = []) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('keywords', JSON.stringify(keywords));
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // This can be used with a callback if needed
        console.log(`Upload progress: ${progress}%`);
      },
    });
  },

  /**
   * Upload multiple images
   */
  uploadMultipleImages: async (files, keywords = []) => {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    formData.append('keywords', JSON.stringify(keywords));
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for multiple files
    });
  },

  /**
   * Search images by keywords
   */
  searchImages: async (query, page = 1, limit = 12) => {
    return api.get('/search', {
      params: { q: query, page, limit },
    });
  },

  /**
   * Get all images with pagination
   */
  getAllImages: async (page = 1, limit = 12) => {
    return api.get('/images', {
      params: { page, limit },
    });
  },

  /**
   * Get single image by ID
   */
  getImageById: async (id) => {
    return api.get(`/images/${id}`);
  },

  /**
   * Get upload statistics
   */
  getStats: async () => {
    return api.get('/stats');
  },
};

// Utility functions
export const utils = {
  /**
   * Format file size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Validate file type
   */
  isValidFileType: (file) => {
    const allowedTypes = (process.env.REACT_APP_ALLOWED_FILE_TYPES || 
                         'image/jpeg,image/png,image/gif,image/webp').split(',');
    return allowedTypes.includes(file.type);
  },

  /**
   * Validate file size
   */
  isValidFileSize: (file) => {
    const maxSize = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10485760; // 10MB
    return file.size <= maxSize;
  },

  /**
   * Generate unique file ID
   */
  generateFileId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Debounce function
   */
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Format date
   */
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

export default api;