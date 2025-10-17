import { useEffect, useState } from 'react';
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRecentImages = async () => {
    try {
      setLoading(true);
      const response = await imageAPI.getAllImages(1, 12);
      setImages(response.data.images || []);
      
      // Show success message if images loaded
      if (response.data.images && response.data.images.length > 0) {
        console.log(`✅ Loaded ${response.data.images.length} images successfully`);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
      setImages([]);
      
      // Show user-friendly error message only for real connection issues
      if (error.message.includes('not responding') || error.message.includes('ECONNREFUSED')) {
        toast.error('🔌 Backend server not running. Please start: npm run dev in backend folder');
      } else if (error.message.includes('timeout')) {
        toast.error('⏱️ Connection timeout. Please check if backend is running on port 5000');
      } else {
        // Don't show error for empty state - it's normal for new installations
        console.log('No images found - this is normal for new installations');
      }
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
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Professional Styles
  const heroSectionStyle = {
    textAlign: 'center',
    padding: '80px 0',
    background: 'rgba(15, 33, 55, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    border: '1px solid rgba(192, 192, 192, 0.1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    marginBottom: '48px',
    position: 'relative',
    overflow: 'hidden',
  };

  const heroTitleStyle = {
    fontSize: 'clamp(36px, 8vw, 72px)',
    fontWeight: 900,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '-0.025em',
    textTransform: 'uppercase',
    background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '24px',
    lineHeight: 1.1,
  };

  const heroSubtitleStyle = {
    fontSize: 'clamp(18px, 3vw, 24px)',
    color: '#C0C0C0',
    marginBottom: '48px',
    maxWidth: '800px',
    margin: '0 auto 48px auto',
    lineHeight: 1.6,
    fontWeight: 400,
  };

  const buttonPrimaryStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    color: '#121212',
    textDecoration: 'none',
    borderRadius: '12px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(0, 240, 255, 0.3)',
    minHeight: '52px',
    border: 'none',
    cursor: 'pointer',
  };

  const buttonSecondaryStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 32px',
    background: 'rgba(15, 33, 55, 0.8)',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '12px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(192, 192, 192, 0.3)',
    backdropFilter: 'blur(10px)',
    minHeight: '52px',
    cursor: 'pointer',
  };

  const statsCardStyle = {
    background: 'rgba(15, 33, 55, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(192, 192, 192, 0.1)',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  };

  const statsIconStyle = {
    width: '48px',
    height: '48px',
    padding: '12px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    color: '#121212',
    margin: '0 auto 16px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const statsNumberStyle = {
    fontSize: '32px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    fontFamily: "'Inter', sans-serif",
  };

  const statsLabelStyle = {
    color: '#C0C0C0',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      {/* Connection Status Indicator */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '20px',
          background: 'rgba(0, 240, 255, 0.9)',
          color: '#121212',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0, 240, 255, 0.3)',
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #121212',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          Connecting to server...
        </div>
      )}
      
      <div className="container">
      {/* Hero Section */}
      <div style={heroSectionStyle} className="animate-slide-up">
        {/* Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 50%, #00F0FF 100%)',
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
        }}></div>
        
        {/* Floating Background Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(30, 144, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 24px',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '50px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#00F0FF',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            ✨ Professional Image Storage Platform
          </div>
          
          <h1 style={heroTitleStyle}>
            STORE & SEARCH YOUR IMAGES
          </h1>
          
          <p style={heroSubtitleStyle}>
            Upload your images securely to the cloud and find them instantly using powerful keyword search technology. 
            Professional-grade storage with lightning-fast retrieval.
          </p>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '16px',
          }}>
            <Link
              to="/upload"
              style={{
                ...buttonPrimaryStyle,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 32px rgba(0, 240, 255, 0.4), 0 0 20px rgba(0, 240, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 240, 255, 0.3)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              }} className="shimmer"></div>
              <Upload size={22} />
              <span>UPLOAD IMAGES</span>
            </Link>
            
            <Link
              to="/search"
              style={{
                ...buttonSecondaryStyle,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(15, 33, 55, 0.95)';
                e.target.style.borderColor = '#00F0FF';
                e.target.style.boxShadow = '0 8px 24px rgba(0, 240, 255, 0.2), 0 0 15px rgba(0, 240, 255, 0.1)';
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(15, 33, 55, 0.8)';
                e.target.style.borderColor = 'rgba(192, 192, 192, 0.3)';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <Search size={22} />
              <span>SEARCH IMAGES</span>
            </Link>
          </div>
          
          {/* Feature Highlights */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '48px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#C0C0C0',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#00F0FF',
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
              }}></div>
              Secure Cloud Storage
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#C0C0C0',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#1E90FF',
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(30, 144, 255, 0.5)',
              }}></div>
              Lightning Fast Search
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#C0C0C0',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#00F0FF',
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
              }}></div>
              Smart Organization
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto 48px auto' }}>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search your images by keywords..."
        />
      </div>

      {/* Stats Section */}
      {stats.totalImages > 0 && (
        <div style={{ marginBottom: '64px' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '-0.025em',
              marginBottom: '8px',
            }}>
              YOUR COLLECTION
            </h2>
            <div style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
              margin: '0 auto',
              borderRadius: '2px',
            }}></div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }} className="animate-slide-up">
          <div 
            style={statsCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0, 240, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            }}
          >
            <div style={statsIconStyle}>
              <ImageIcon size={24} />
            </div>
            <div style={statsNumberStyle}>{stats.totalImages}</div>
            <div style={statsLabelStyle}>Total Images</div>
          </div>

          <div 
            style={statsCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0, 240, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            }}
          >
            <div style={statsIconStyle}>
              <TrendingUp size={24} />
            </div>
            <div style={statsNumberStyle}>
              {(stats.totalSize / (1024 * 1024)).toFixed(1)} MB
            </div>
            <div style={statsLabelStyle}>Storage Used</div>
          </div>

          <div 
            style={statsCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0, 240, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            }}
          >
            <div style={statsIconStyle}>
              <Upload size={24} />
            </div>
            <div style={statsNumberStyle}>{stats.recentUploads.length}</div>
            <div style={statsLabelStyle}>Recent Uploads</div>
          </div>
          </div>
        </div>
      )}

      {/* Recent Images Section */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '-0.025em',
          }}>
            RECENT IMAGES
          </h2>
          {images.length > 0 && (
            <Link
              to="/search"
              style={{
                color: '#00F0FF',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#00F0FF';
              }}
            >
              VIEW ALL
              <Search size={16} />
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
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
          }} className="animate-slide-up">
            <div style={{
              ...statsCardStyle,
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              <div style={{
                ...statsIconStyle,
                width: '80px',
                height: '80px',
                marginBottom: '24px',
              }}>
                <ImageIcon size={40} />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px',
                fontFamily: "'Inter', sans-serif",
                textTransform: 'uppercase',
              }}>
                GET STARTED
              </h3>
              <p style={{
                color: '#C0C0C0',
                marginBottom: '32px',
                fontSize: '18px',
                lineHeight: 1.6,
              }}>
                Upload your first image to start building your collection
              </p>
              <Link
                to="/upload"
                style={buttonPrimaryStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 240, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 240, 255, 0.3)';
                }}
              >
                <Upload size={20} />
                <span>UPLOAD NOW</span>
              </Link>
            </div>
          </div>
        )}
      </div>
      </div>

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
                        }}
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