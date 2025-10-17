import React from 'react';
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

      // Navigate to home page after successful upload
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
      throw error; // Re-throw to let ImageUpload component handle it
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Images</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your images securely to the cloud. Add keywords to make them easily searchable later.
        </p>
      </div>

      {/* Upload Component */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <ImageUpload
          onUpload={handleUpload}
          loading={loading}
          multiple={true}
        />
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Upload Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Supported formats: JPEG, PNG, GIF, WebP</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Maximum file size: 10MB per image</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Add descriptive keywords to make your images searchable</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>You can upload multiple images at once</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Images are automatically optimized for faster loading</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;