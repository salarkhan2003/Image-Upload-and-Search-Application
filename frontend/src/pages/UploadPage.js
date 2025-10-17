import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import ImageUpload from '../components/ImageUpload';
import { useImageContext } from '../context/ImageContext';
import { imageAPI } from '../services/api';

const UploadPage = () => {
  const navigate = useNavigate();
  const { loading, setLoading, addImages } = useImageContext();

  const handleUpload = async (files, keywords) => {
    try {
      setLoading(true);
      
      let response;
      if (files.length === 1) {
        response = await imageAPI.uploadImage(files[0], keywords);
      } else {
        response = await imageAPI.uploadMultipleImages(files, keywords);
      }

      // Add uploaded images to context
      addImages(response.data.images);

      // Show success message
      toast.success(
        `Successfully uploaded ${response.data.count} image${response.data.count !== 1 ? 's' : ''}!`
      );

      // Navigate to home page immediately to see the uploaded images
      navigate('/');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
      throw error; // Re-throw to let ImageUpload component handle it
    } finally {
      setLoading(false);
    }
  };

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
    margin: '0 auto',
    lineHeight: 1.6,
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
  };

  const uploadContainerStyle = {
    background: 'rgba(15, 33, 55, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(192, 192, 192, 0.1)',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    marginBottom: '48px',
    position: 'relative',
    overflow: 'hidden',
  };

  const tipsContainerStyle = {
    background: 'rgba(0, 240, 255, 0.1)',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    borderRadius: '12px',
    padding: '32px',
  };

  const tipsListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const tipItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
    fontSize: '16px',
    color: '#C0C0C0',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.6,
  };

  const tipBulletStyle = {
    color: '#00F0FF',
    marginRight: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '2px',
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        {/* Header */}
        <div style={headerStyle} className="animate-slide-up">
          <h1 style={titleStyle}>UPLOAD IMAGES</h1>
          <p style={subtitleStyle}>
            Upload your images securely to the cloud. Add keywords to make them easily searchable later.
          </p>
        </div>

        {/* Upload Component */}
        <div style={uploadContainerStyle} className="animate-slide-up">
          {/* Accent Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
          }}></div>
          
          <ImageUpload
            onUpload={handleUpload}
            loading={loading}
            multiple={true}
          />
        </div>

        {/* Tips Section */}
        <div style={tipsContainerStyle} className="animate-slide-up">
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#00F0FF',
            marginBottom: '24px',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '-0.025em',
          }}>
            UPLOAD TIPS
          </h3>
          <ul style={tipsListStyle}>
            <li style={tipItemStyle}>
              <span style={tipBulletStyle}>•</span>
              <span>Supported formats: JPEG, PNG, GIF, WebP</span>
            </li>
            <li style={tipItemStyle}>
              <span style={tipBulletStyle}>•</span>
              <span>Maximum file size: 10MB per image</span>
            </li>
            <li style={tipItemStyle}>
              <span style={tipBulletStyle}>•</span>
              <span>Add descriptive keywords to make your images searchable</span>
            </li>
            <li style={tipItemStyle}>
              <span style={tipBulletStyle}>•</span>
              <span>You can upload multiple images at once</span>
            </li>
            <li style={tipItemStyle}>
              <span style={tipBulletStyle}>•</span>
              <span>Images are automatically optimized for faster loading</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;