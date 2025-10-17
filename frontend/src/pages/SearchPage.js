import { useEffect, useState } from 'react';
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
    setLoading,
    setSearchResults,
    setPagination,
    setSearchQuery,
    setError,
  } = useImageContext();

  const [selectedImage, setSelectedImage] = useState(null);

  const currentQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (currentQuery) {
      setSearchQuery(currentQuery);
      performSearch(currentQuery, currentPage);
    } else {
      loadAllImages(currentPage);
    }
  }, [currentQuery, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const performSearch = async (query, page = 1) => {
    if (!query.trim()) {
      loadAllImages(page);
      return;
    }

    try {
      setLoading(true);
      console.log(`🔍 Frontend: Searching for "${query}"`);
      
      const response = await imageAPI.searchImages(query, page, 12);
      console.log(`🔍 Frontend: Search response:`, response);
      
      setSearchResults(response.data.images || []);
      setPagination(response.data.pagination || {
        currentPage: page,
        totalPages: 0,
        totalImages: 0,
        hasNext: false,
        hasPrev: false,
      });
      
      if (response.data.images && response.data.images.length === 0) {
        toast.info(`No images found for "${query}". Try different keywords.`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      toast.error(`Search failed: ${error.message}`);
      
      // Set empty results on error
      setSearchResults([]);
      setPagination({
        currentPage: page,
        totalPages: 0,
        totalImages: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllImages = async (page = 1) => {
    try {
      setLoading(true);
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

  // Professional Styles
  const pageStyle = {
    paddingTop: '100px',
    minHeight: '100vh',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '48px',
  };

  const titleStyle = {
    fontSize: 'clamp(32px, 6vw, 48px)',
    fontWeight: 900,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '-0.025em',
    textTransform: 'uppercase',
    background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    lineHeight: 1.1,
  };

  const subtitleStyle = {
    fontSize: 'clamp(16px, 3vw, 20px)',
    color: '#C0C0C0',
    maxWidth: '600px',
    margin: '0 auto 32px auto',
    lineHeight: 1.6,
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
  };

  const resultsHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const paginationStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '48px',
    flexWrap: 'wrap',
  };

  const paginationButtonStyle = (active = false, disabled = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: active 
      ? 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)'
      : 'rgba(15, 33, 55, 0.8)',
    color: active ? '#121212' : disabled ? '#C0C0C0' : '#FFFFFF',
    border: '1px solid rgba(192, 192, 192, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
  });

  return (
    <div style={pageStyle}>
      <div className="container">
        {/* Header */}
        <div style={headerStyle} className="animate-slide-up">
          <h1 style={titleStyle}>SEARCH IMAGES</h1>
          <p style={subtitleStyle}>
            Find your images using keywords, descriptions, or any text that describes what you're looking for.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '48px' }}>
          <SearchBar
            onSearch={handleSearch}
            initialQuery={currentQuery}
            placeholder="Search by keywords, descriptions, or image names..."
          />
        </div>

        {/* Search Results Header */}
        <div style={resultsHeaderStyle}>
          <div>
            {currentQuery ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  SEARCH RESULTS FOR "{currentQuery}"
                </h2>
                <button
                  onClick={clearSearch}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#C0C0C0',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  title="Clear search"
                  onMouseEnter={(e) => {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.background = 'rgba(192, 192, 192, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#C0C0C0';
                    e.target.style.background = 'transparent';
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
              }}>
                ALL IMAGES
              </h2>
            )}
            
            {!loading && pagination.totalImages > 0 && (
              <p style={{
                fontSize: '14px',
                color: '#C0C0C0',
                marginTop: '8px',
                fontFamily: "'Inter', sans-serif",
              }}>
                Showing {((pagination.currentPage - 1) * 12) + 1} - {Math.min(pagination.currentPage * 12, pagination.totalImages)} of {pagination.totalImages} images
              </p>
            )}
          </div>

          {currentQuery && (
            <button
              onClick={clearSearch}
              style={{
                color: '#00F0FF',
                background: 'transparent',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#00F0FF';
              }}
            >
              SHOW ALL IMAGES
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
          <div style={paginationStyle}>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              style={paginationButtonStyle(false, !pagination.hasPrev)}
              onMouseEnter={(e) => {
                if (pagination.hasPrev) {
                  e.target.style.background = 'rgba(15, 33, 55, 0.95)';
                  e.target.style.borderColor = '#00F0FF';
                }
              }}
              onMouseLeave={(e) => {
                if (pagination.hasPrev) {
                  e.target.style.background = 'rgba(15, 33, 55, 0.8)';
                  e.target.style.borderColor = 'rgba(192, 192, 192, 0.2)';
                }
              }}
            >
              <ChevronLeft size={16} />
              PREVIOUS
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                    style={paginationButtonStyle(pageNumber === pagination.currentPage)}
                    onMouseEnter={(e) => {
                      if (pageNumber !== pagination.currentPage) {
                        e.target.style.background = 'rgba(15, 33, 55, 0.95)';
                        e.target.style.borderColor = '#00F0FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pageNumber !== pagination.currentPage) {
                        e.target.style.background = 'rgba(15, 33, 55, 0.8)';
                        e.target.style.borderColor = 'rgba(192, 192, 192, 0.2)';
                      }
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              style={paginationButtonStyle(false, !pagination.hasNext)}
              onMouseEnter={(e) => {
                if (pagination.hasNext) {
                  e.target.style.background = 'rgba(15, 33, 55, 0.95)';
                  e.target.style.borderColor = '#00F0FF';
                }
              }}
              onMouseLeave={(e) => {
                if (pagination.hasNext) {
                  e.target.style.background = 'rgba(15, 33, 55, 0.8)';
                  e.target.style.borderColor = 'rgba(192, 192, 192, 0.2)';
                }
              }}
            >
              NEXT
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}>
            <div style={{
              background: 'rgba(15, 33, 55, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(192, 192, 192, 0.2)',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid rgba(192, 192, 192, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {selectedImage.originalName}
                </h3>
                <button
                  onClick={closeImageModal}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#C0C0C0',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.background = 'rgba(192, 192, 192, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#C0C0C0';
                    e.target.style.background = 'transparent';
                  }}
                >
                  <X size={24} />
                </button>
              </div>
              <div style={{ padding: '24px' }}>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.originalName}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
                {selectedImage.keywords && selectedImage.keywords.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#C0C0C0',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      KEYWORDS:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedImage.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
                            color: '#121212',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '6px 12px',
                            borderRadius: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                          title={`Search for "${keyword}"`}
                          onClick={() => {
                            closeImageModal();
                            handleSearch(keyword);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{
                  marginTop: '24px',
                  fontSize: '14px',
                  color: '#C0C0C0',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  <p>Uploaded: {new Date(selectedImage.uploadDate).toLocaleDateString()}</p>
                  <p>Size: {(selectedImage.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;