import { useState } from 'react';
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

  const cardStyle = {
    background: 'rgba(15, 33, 55, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(192, 192, 192, 0.1)',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <div
      ref={ref}
      style={cardStyle}
      className="group animate-scale-in"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0, 240, 255, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
      }}
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
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%, transparent 100%)',
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} className="group-hover:opacity-100">
          <div style={{
            display: 'flex',
            gap: '16px',
            transform: 'translateY(16px)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }} className="group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(image);
              }}
              style={{
                background: 'rgba(15, 33, 55, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                color: '#00F0FF',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              title="View Image"
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 240, 255, 0.2)';
                e.target.style.color = '#FFFFFF';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(15, 33, 55, 0.9)';
                e.target.style.color = '#00F0FF';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <Eye size={20} />
            </button>
            <a
              href={image.url}
              download={image.originalName}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(15, 33, 55, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                color: '#00F0FF',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              title="Download Image"
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 240, 255, 0.2)';
                e.target.style.color = '#FFFFFF';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(15, 33, 55, 0.9)';
                e.target.style.color = '#00F0FF';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <Download size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Image info */}
      <div style={{ padding: '24px' }}>
        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '16px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }} title={image.originalName}>
          {image.originalName}
        </h3>
        
        {/* Keywords */}
        {image.keywords && image.keywords.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <Tag size={16} style={{ color: '#00F0FF', marginRight: '8px' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {image.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  style={{
                    background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
                    color: '#121212',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {keyword}
                </span>
              ))}
              {image.keywords.length > 3 && (
                <span style={{
                  fontSize: '11px',
                  color: '#C0C0C0',
                  background: 'rgba(192, 192, 192, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}>
                  +{image.keywords.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Upload date and file size */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#C0C0C0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Calendar size={14} style={{ color: '#00F0FF', marginRight: '6px' }} />
            <span>{utils.formatDate(image.uploadDate)}</span>
          </div>
          <span style={{
            background: 'rgba(192, 192, 192, 0.1)',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
          }}>
            {utils.formatFileSize(image.fileSize)}
          </span>
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
      <div className="text-center py-20 animate-slide-up">
        <div className="bg-gradient-primary p-8 rounded-3xl w-32 h-32 mx-auto mb-6 flex items-center justify-center animate-float">
          <Eye className="h-16 w-16 text-white" />
        </div>
        <h3 className="text-2xl font-bold gradient-text mb-4">No Images</h3>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px',
    }} className="animate-slide-up">
      {images.map((image, index) => (
        <div key={image.id} style={{animationDelay: `${index * 0.1}s`}}>
          <ImageCard
            image={image}
            onImageClick={onImageClick}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;