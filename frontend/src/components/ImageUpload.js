import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Plus, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import { utils } from '../services/api';

const ImageUpload = ({ onUpload, loading = false, multiple = false }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [errors, setErrors] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    const newErrors = [];
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error) => {
        if (error.code === 'file-too-large') {
          newErrors.push(`${file.name}: File size too large (max 10MB)`);
        } else if (error.code === 'file-invalid-type') {
          newErrors.push(`${file.name}: Invalid file type`);
        } else {
          newErrors.push(`${file.name}: ${error.message}`);
        }
      });
    });

    // Validate accepted files
    const validFiles = acceptedFiles.filter(file => {
      if (!utils.isValidFileType(file)) {
        newErrors.push(`${file.name}: Invalid file type`);
        return false;
      }
      if (!utils.isValidFileSize(file)) {
        newErrors.push(`${file.name}: File size too large (max 10MB)`);
        return false;
      }
      return true;
    });

    setErrors(newErrors);

    // Add preview URLs to files
    const filesWithPreview = validFiles.map(file => ({
      file,
      id: utils.generateFileId(),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...filesWithPreview]);
    } else {
      setSelectedFiles(filesWithPreview.slice(0, 1));
    }
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10485760, // 10MB
    multiple,
    disabled: loading,
  });

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !keywords.includes(keyword) && keywords.length < 10) {
      setKeywords(prev => [...prev, keyword]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(prev => prev.filter(k => k !== keywordToRemove));
  };

  const handleKeywordInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setErrors(['Please select at least one image']);
      return;
    }

    try {
      const files = selectedFiles.map(f => f.file);
      await onUpload(files, keywords);
      
      // Clear form on successful upload
      setSelectedFiles([]);
      setKeywords([]);
      setKeywordInput('');
      setErrors([]);
    } catch (error) {
      setErrors([error.message || 'Upload failed']);
    }
  };

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [selectedFiles]);

  // Professional Styles
  const dropzoneStyle = {
    border: `2px dashed ${isDragActive ? '#00F0FF' : 'rgba(192, 192, 192, 0.3)'}`,
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: isDragActive 
      ? 'rgba(0, 240, 255, 0.1)' 
      : 'rgba(15, 33, 55, 0.6)',
    backdropFilter: 'blur(20px)',
    opacity: loading ? 0.5 : 1,
  };

  const errorBoxStyle = {
    marginTop: '24px',
    padding: '20px',
    background: 'rgba(255, 107, 107, 0.1)',
    border: '1px solid rgba(255, 107, 107, 0.3)',
    borderRadius: '12px',
  };

  const fileGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '24px',
  };

  const fileCardStyle = {
    position: 'relative',
    background: 'rgba(15, 33, 55, 0.8)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(192, 192, 192, 0.1)',
  };

  const keywordInputStyle = {
    flex: 1,
    padding: '12px 16px',
    background: 'rgba(15, 33, 55, 0.6)',
    border: '1px solid rgba(192, 192, 192, 0.2)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const keywordBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    color: '#121212',
    fontSize: '12px',
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const uploadButtonStyle = {
    width: '100%',
    padding: '16px 32px',
    background: selectedFiles.length === 0 || loading 
      ? 'rgba(192, 192, 192, 0.3)' 
      : 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    color: selectedFiles.length === 0 || loading ? '#C0C0C0' : '#121212',
    border: 'none',
    borderRadius: '12px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: selectedFiles.length === 0 || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '32px',
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={dropzoneStyle}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.borderColor = '#00F0FF';
            e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && !isDragActive) {
            e.currentTarget.style.borderColor = 'rgba(192, 192, 192, 0.3)';
            e.currentTarget.style.background = 'rgba(15, 33, 55, 0.6)';
          }
        }}
      >
        <input {...getInputProps()} />
        <Upload size={48} style={{ 
          color: isDragActive ? '#00F0FF' : '#C0C0C0', 
          marginBottom: '16px' 
        }} />
        
        {isDragActive ? (
          <p style={{
            fontSize: '20px',
            color: '#00F0FF',
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
          }}>
            DROP THE IMAGES HERE...
          </p>
        ) : (
          <div>
            <p style={{
              fontSize: '20px',
              color: '#FFFFFF',
              fontWeight: 600,
              marginBottom: '8px',
              fontFamily: "'Inter', sans-serif",
            }}>
              DRAG & DROP IMAGES HERE, OR CLICK TO SELECT
            </p>
            <p style={{
              fontSize: '14px',
              color: '#C0C0C0',
              fontFamily: "'Inter', sans-serif",
            }}>
              Supports: JPEG, PNG, GIF, WebP (max 10MB each)
              {multiple && ' • Multiple files allowed'}
            </p>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div style={errorBoxStyle}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <AlertCircle size={20} style={{ color: '#ff6b6b', marginRight: '8px' }} />
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#ff6b6b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: "'Inter', sans-serif",
            }}>
              UPLOAD ERRORS
            </h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {errors.map((error, index) => (
              <li key={index} style={{
                fontSize: '14px',
                color: '#ff9999',
                marginBottom: '4px',
                fontFamily: "'Inter', sans-serif",
              }}>
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '16px',
            fontFamily: "'Inter', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '-0.025em',
          }}>
            SELECTED IMAGES ({selectedFiles.length})
          </h3>
          <div style={fileGridStyle}>
            {selectedFiles.map((fileObj) => (
              <div key={fileObj.id} style={fileCardStyle}>
                <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                  <img
                    src={fileObj.preview}
                    alt={fileObj.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(255, 107, 107, 0.9)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#ff6b6b';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 107, 107, 0.9)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontFamily: "'Inter', sans-serif",
                  }} title={fileObj.name}>
                    {fileObj.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#C0C0C0',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {utils.formatFileSize(fileObj.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords Input */}
      <div style={{ marginTop: '32px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontFamily: "'Inter', sans-serif",
        }}>
          KEYWORDS (OPTIONAL)
        </label>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
        }}>
          {keywords.map((keyword, index) => (
            <span key={index} style={keywordBadgeStyle}>
              <Tag size={14} style={{ marginRight: '6px' }} />
              {keyword}
              <button
                onClick={() => removeKeyword(keyword)}
                style={{
                  marginLeft: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#121212',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={handleKeywordInputKeyPress}
            placeholder="Add keywords (e.g., nature, sunset, portrait)"
            style={keywordInputStyle}
            maxLength={50}
            disabled={keywords.length >= 10}
            onFocus={(e) => {
              e.target.style.borderColor = '#00F0FF';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(192, 192, 192, 0.2)';
            }}
          />
          <button
            type="button"
            onClick={addKeyword}
            disabled={!keywordInput.trim() || keywords.length >= 10}
            style={{
              padding: '12px 16px',
              background: !keywordInput.trim() || keywords.length >= 10 
                ? 'rgba(192, 192, 192, 0.2)' 
                : 'rgba(15, 33, 55, 0.8)',
              color: !keywordInput.trim() || keywords.length >= 10 ? '#C0C0C0' : '#00F0FF',
              border: '1px solid rgba(192, 192, 192, 0.2)',
              borderRadius: '8px',
              cursor: !keywordInput.trim() || keywords.length >= 10 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Plus size={16} />
          </button>
        </div>
        <p style={{
          fontSize: '12px',
          color: '#C0C0C0',
          marginTop: '8px',
          fontFamily: "'Inter', sans-serif",
        }}>
          Add up to 10 keywords to help others find your images
        </p>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || loading}
        style={uploadButtonStyle}
        onMouseEnter={(e) => {
          if (selectedFiles.length > 0 && !loading) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 24px rgba(0, 240, 255, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedFiles.length > 0 && !loading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid transparent',
              borderTop: '2px solid #121212',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
            UPLOADING...
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            UPLOAD {selectedFiles.length} IMAGE{selectedFiles.length !== 1 ? 'S' : ''}
          </>
        )}
      </button>
    </div>
  );
};

export default ImageUpload;