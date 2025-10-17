import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, Image as ImageIcon, TrendingUp, X } from 'lucide-react';
import toast from 'react-hot-toast';

import ImageGrid from '../components/ImageGrid';
import SearchBar from '../components/SearchBar';
import { useImageContext } from '../context/ImageContext';
import { imageAPI } from '../services/api';

const HomePage = () => {
  const {
    images,
    loading,
    setImages,
    setLoading,
    setError,
  } = useImageContext();

  const [stats, setStats] = useState({
    totalImages: 0,
    totalSize: 0,
    recentUploads: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadRecentImages();
    loadStats();
  }, []);

  const loadRecentImages = async () => {
    try {
      setLoading(true);
      const response = await imageAPI.getAllImages(1, 12);
      setImages(response.data.images);
    } catch (error) {
      console.error('Failed to load images:', error);
      setError(error.message);
      toast.error('Failed to load recent images');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await imageAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Store & Search Your Images
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your images securely to the cloud and find them instantly using powerful keyword search
        </p>
        
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/upload"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Images
          </Link>
          <Link
            to="/search"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Images
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search your images by keywords..."
        />
      </div>

      {/* Stats Section */}
      {stats.totalImages > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <ImageIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalImages}</h3>
            <p className="text-gray-600">Total Images</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">
              {(stats.totalSize / (1024 * 1024)).toFixed(1)} MB
            </h3>
            <p className="text-gray-600">Storage Used</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Upload className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.recentUploads.length}</h3>
            <p className="text-gray-600">Recent Uploads</p>
          </div>
        </div>
      )}

      {/* Recent Images Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Images</h2>
          {images.length > 0 && (
            <Link
              to="/search"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <Search className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>

        <ImageGrid
          images={images}
          loading={loading}
          onImageClick={handleImageClick}
          emptyMessage="No images uploaded yet. Start by uploading your first image!"
        />

        {images.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600 mb-6">
                Upload your first image to start building your collection
              </p>
              <Link
                to="/upload"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Now
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {selectedImage.originalName}
              </h3>
              <button
                onClick={closeImageModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.originalName}
                className="w-full h-auto max-h-96 object-contain mx-auto"
              />
              {selectedImage.keywords && selectedImage.keywords.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;