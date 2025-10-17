import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

import SearchBar from '../components/SearchBar';
import ImageGrid from '../components/ImageGrid';
import { useImageContext } from '../context/ImageContext';
import { imageAPI } from '../services/api';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    searchResults,
    loading,
    pagination,
    searchQuery,
    setLoading,
    setSearchResults,
    setPagination,
    setSearchQuery,
    setError,
  } = useImageContext();

  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);

  const currentQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (currentQuery) {
      setSearchQuery(currentQuery);
      performSearch(currentQuery, currentPage);
    } else {
      loadAllImages(currentPage);
      setShowAllImages(true);
    }
  }, [currentQuery, currentPage]);

  const performSearch = async (query, page = 1) => {
    if (!query.trim()) {
      loadAllImages(page);
      return;
    }

    try {
      setLoading(true);
      setShowAllImages(false);
      const response = await imageAPI.searchImages(query, page, 12);
      setSearchResults(response.data.images);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      toast.error('Failed to search images');
    } finally {
      setLoading(false);
    }
  };

  const loadAllImages = async (page = 1) => {
    try {
      setLoading(true);
      setShowAllImages(true);
      const response = await imageAPI.getAllImages(page, 12);
      setSearchResults(response.data.images);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Load images error:', error);
      setError(error.message);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query);
      setSearchQuery(query);
    } else {
      setSearchQuery('');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const clearSearch = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Images</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Find your images using keywords, descriptions, or any text that describes what you're looking for.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          onSearch={handleSearch}
          initialQuery={currentQuery}
          placeholder="Search by keywords, descriptions, or image names..."
        />
      </div>

      {/* Search Results Header */}
      <div className="flex items-center justify-between">
        <div>
          {currentQuery ? (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Search results for "{currentQuery}"
              </h2>
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <h2 className="text-xl font-semibold text-gray-900">All Images</h2>
          )}
          
          {!loading && pagination.totalImages > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Showing {((pagination.currentPage - 1) * 12) + 1} - {Math.min(pagination.currentPage * 12, pagination.totalImages)} of {pagination.totalImages} images
            </p>
          )}
        </div>

        {currentQuery && (
          <button
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Show All Images
          </button>
        )}
      </div>

      {/* Search Results */}
      <ImageGrid
        images={searchResults}
        loading={loading}
        onImageClick={handleImageClick}
        emptyMessage={
          currentQuery 
            ? `No images found for "${currentQuery}". Try different keywords or check your spelling.`
            : "No images uploaded yet. Upload some images to get started!"
        }
      />

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-1">
            {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
              let pageNumber;
              if (pagination.totalPages <= 5) {
                pageNumber = index + 1;
              } else if (pagination.currentPage <= 3) {
                pageNumber = index + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNumber = pagination.totalPages - 4 + index;
              } else {
                pageNumber = pagination.currentPage - 2 + index;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pageNumber === pagination.currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}

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
                        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                        onClick={() => {
                          closeImageModal();
                          handleSearch(keyword);
                        }}
                        title={`Search for "${keyword}"`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-500">
                <p>Uploaded: {new Date(selectedImage.uploadDate).toLocaleDateString()}</p>
                <p>Size: {(selectedImage.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;