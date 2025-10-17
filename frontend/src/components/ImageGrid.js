import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Calendar, Tag, Download, Eye } from 'lucide-react';
import { utils } from '../services/api';

const ImageCard = ({ image, onImageClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
    >
      <div className="relative aspect-square bg-gray-100">
        {inView && !imageError && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <img
              src={image.url}
              alt={image.originalName}
              className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={() => onImageClick(image)}
              loading="lazy"
            />
          </>
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <Eye className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Failed to load image</p>
            </div>
          </div>
        )}

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(image);
              }}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200"
              title="View Image"
            >
              <Eye className="h-4 w-4" />
            </button>
            <a
              href={image.url}
              download={image.originalName}
              onClick={(e) => e.stopPropagation()}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200"
              title="Download Image"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Image info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate mb-2" title={image.originalName}>
          {image.originalName}
        </h3>
        
        {/* Keywords */}
        {image.keywords && image.keywords.length > 0 && (
          <div className="flex items-center mb-2">
            <Tag className="h-4 w-4 text-gray-400 mr-1" />
            <div className="flex flex-wrap gap-1">
              {image.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
              {image.keywords.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{image.keywords.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Upload date and file size */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{utils.formatDate(image.uploadDate)}</span>
          </div>
          <span>{utils.formatFileSize(image.fileSize)}</span>
        </div>
      </div>
    </div>
  );
};

const ImageGrid = ({ images, loading, onImageClick, emptyMessage = "No images found" }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Images</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

export default ImageGrid;