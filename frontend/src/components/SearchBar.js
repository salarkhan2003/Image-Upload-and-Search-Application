import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { utils } from '../services/api';

const SearchBar = ({ onSearch, initialQuery = '', placeholder = "Search images by keywords..." }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions] = useState([
    'beach sunset', 'black t-shirt', 'mountain landscape', 'city skyline',
    'food photography', 'nature', 'portrait', 'architecture', 'animals',
    'flowers', 'cars', 'technology', 'art', 'travel'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
  const debouncedSearch = utils.debounce((searchQuery) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }, 500);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      debouncedSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    // Optionally trigger a search with empty query to show all images
    onSearch('');
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase()) && 
    suggestion.toLowerCase() !== query.toLowerCase()
  ).slice(0, 6);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking on them
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search button for mobile */}
        <button
          type="submit"
          className="md:hidden mt-3 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Search Images
        </button>
      </form>

      {/* Search suggestions */}
      {showSuggestions && (query.length > 0 || filteredSuggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {query.length > 0 && (
            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
              Search suggestions
            </div>
          )}
          
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center">
                  <Search className="h-4 w-4 text-gray-400 mr-3" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))
          ) : query.length > 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;