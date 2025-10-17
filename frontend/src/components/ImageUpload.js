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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        
        {isDragActive ? (
          <p className="text-lg text-blue-600 font-medium">Drop the images here...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600 font-medium mb-2">
              Drag & drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports: JPEG, PNG, GIF, WebP (max 10MB each)
              {multiple && ' • Multiple files allowed'}
            </p>
          </div>
        )}
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Selected Images ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedFiles.map((fileObj) => (
              <div key={fileObj.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={fileObj.preview}
                    alt={fileObj.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate" title={fileObj.name}>
                    {fileObj.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {utils.formatFileSize(fileObj.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords input */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keywords (Optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              <Tag className="h-3 w-3 mr-1" />
              {keyword}
              <button
                onClick={() => removeKeyword(keyword)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={handleKeywordInputKeyPress}
            placeholder="Add keywords (e.g., nature, sunset, portrait)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            maxLength={50}
            disabled={keywords.length >= 10}
          />
          <button
            type="button"
            onClick={addKeyword}
            disabled={!keywordInput.trim() || keywords.length >= 10}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Add up to 10 keywords to help others find your images
        </p>
      </div>

      {/* Upload button */}
      <div className="mt-6">
        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;