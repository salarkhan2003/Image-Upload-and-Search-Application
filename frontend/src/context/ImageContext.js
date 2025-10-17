import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  images: [],
  searchResults: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalImages: 0,
    hasNext: false,
    hasPrev: false,
  },
  searchQuery: '',
  uploadProgress: {},
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_IMAGES: 'SET_IMAGES',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  ADD_IMAGES: 'ADD_IMAGES',
  SET_UPLOAD_PROGRESS: 'SET_UPLOAD_PROGRESS',
  CLEAR_UPLOAD_PROGRESS: 'CLEAR_UPLOAD_PROGRESS',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const imageReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ActionTypes.SET_IMAGES:
      return {
        ...state,
        images: action.payload,
        loading: false,
        error: null,
      };

    case ActionTypes.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
        loading: false,
        error: null,
      };

    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case ActionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case ActionTypes.ADD_IMAGES:
      return {
        ...state,
        images: [...action.payload, ...state.images],
        loading: false,
        error: null,
      };

    case ActionTypes.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: {
          ...state.uploadProgress,
          [action.payload.fileId]: action.payload.progress,
        },
      };

    case ActionTypes.CLEAR_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: {},
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const ImageContext = createContext();

// Provider component
export const ImageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(imageReducer, initialState);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const setImages = (images) => {
    dispatch({ type: ActionTypes.SET_IMAGES, payload: images });
  };

  const setSearchResults = (results) => {
    dispatch({ type: ActionTypes.SET_SEARCH_RESULTS, payload: results });
  };

  const setPagination = (pagination) => {
    dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query });
  };

  const addImages = (newImages) => {
    dispatch({ type: ActionTypes.ADD_IMAGES, payload: newImages });
  };

  const setUploadProgress = (fileId, progress) => {
    dispatch({ 
      type: ActionTypes.SET_UPLOAD_PROGRESS, 
      payload: { fileId, progress } 
    });
  };

  const clearUploadProgress = () => {
    dispatch({ type: ActionTypes.CLEAR_UPLOAD_PROGRESS });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    setImages,
    setSearchResults,
    setPagination,
    setSearchQuery,
    addImages,
    setUploadProgress,
    clearUploadProgress,
    clearError,
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook to use the context
export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};

export default ImageContext;